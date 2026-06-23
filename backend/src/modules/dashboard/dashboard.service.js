'use strict';

/**
 * modules/dashboard/dashboard.service.js
 *
 * Responsabilidad: Toda la lógica de negocio del Dashboard Avanzado.
 * Solo lectura — no modifica ningún documento.
 *
 * Métodos públicos:
 *   getStudentDashboard(studentId)
 *   getTeacherDashboard(teacherId)
 *   getTeacherStudentDetail(teacherId, studentId)  ← scope validation como primera operación
 *   getAdminDashboard()
 *   getAdminActivityFeed(days)
 *   getAdminAtRisk()
 *
 * Métodos privados:
 *   _calculateStudentGrowth(studentId, totalLessons)
 *   _calculateSkillProgress(studentId, courseIds)
 *   _calculateStreak(studentId)           ← JS post-procesado, no MongoDB aggregation
 *   _calculateAssessmentSummary(studentId, courseIds)
 *   _getRecentActivity(studentId)
 *   _calculateCohortProgressAvg(studentIds)  ← aggregation directa, nunca bucle
 *   _calculateCohortGrowth(studentIds)
 *   _calculateCoursesSummary()
 *   _calculatePlatformGrowth()
 *
 * Reglas:
 *   - nextLesson se deriva de progressService.getCourseProgress — nunca reimplementar lock logic.
 *   - cohortProgressAvg siempre vía _calculateCohortProgressAvg (aggregation).
 *   - Queries independientes dentro de cada método en Promise.all.
 *   - No importar modelos directamente — usar repositories con aggregate().
 */

const { Types }                    = require('mongoose');
const LessonProgressRepository     = require('../../repositories/lessonProgress.repository');
const AssessmentAttemptRepository  = require('../../repositories/assessmentAttempt.repository');
const AssessmentRepository         = require('../../repositories/assessment.repository');
const EnrollmentRepository         = require('../../repositories/enrollment.repository');
const UserRepository               = require('../../repositories/user.repository');
const CourseRepository             = require('../../repositories/course.repository');
const LessonRepository             = require('../../repositories/lesson.repository');
const progressService              = require('../progress/progress.service');
const progressCalculator           = require('../../utils/progressCalculator');
const {
  ROLES,
  LESSON_TYPES,
  ENROLLMENT_STATUS,
  PROGRESS_STATUS,
  SKILL_RADAR_SOURCE,
  GROWTH_WINDOWS,
  ACTIVITY_FEED_MAX_DAYS,
  AT_RISK_DAYS,
  AT_RISK_PROGRESS_THRESHOLD,
} = require('../../config/constants');
const { NotFoundError, ForbiddenError } = require('../../utils/ApiError');

// ---------------------------------------------------------------------------
// Utilidades internas
// ---------------------------------------------------------------------------

const daysAgo = (days) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);

const daysBetween = (date) =>
  date ? Math.floor((Date.now() - new Date(date)) / (1000 * 60 * 60 * 24)) : null;

const toObjId = (id) => new Types.ObjectId(id);

// ---------------------------------------------------------------------------
// Métodos privados
// ---------------------------------------------------------------------------

const _calculateStudentGrowth = async (studentId, totalLessons) => {
  const since7d  = daysAgo(GROWTH_WINDOWS.DAYS_7);
  const since30d = daysAgo(GROWTH_WINDOWS.DAYS_30);

  const [completed7d, completed30d, assessmentsPassed30d] = await Promise.all([
    LessonProgressRepository.count({
      studentId,
      status:      PROGRESS_STATUS.COMPLETED,
      completedAt: { $gte: since7d },
    }),
    LessonProgressRepository.count({
      studentId,
      status:      PROGRESS_STATUS.COMPLETED,
      completedAt: { $gte: since30d },
    }),
    AssessmentAttemptRepository.count({
      studentId,
      passed:      true,
      submittedAt: { $gte: since30d },
    }),
  ]);

  return {
    lessonsCompleted7d:  completed7d,
    lessonsCompleted30d: completed30d,
    progressGained7d:    totalLessons === 0 ? 0 : Math.floor((completed7d  / totalLessons) * 100),
    progressGained30d:   totalLessons === 0 ? 0 : Math.floor((completed30d / totalLessons) * 100),
    assessmentsPassed30d,
  };
};

const _calculateSkillProgress = async (studentId, courseIds) => {
  if (courseIds.length === 0) {
    return {
      listening: null, reading: null, assessmentScore: null,
      writing: null, speaking: null, _source: SKILL_RADAR_SOURCE.PRELIMINARY,
    };
  }

  const studentObjId = toObjId(studentId);
  const courseObjIds = courseIds.map(toObjId);
  const completedMatch = {
    studentId: studentObjId,
    courseId:  { $in: courseObjIds },
    status:    PROGRESS_STATUS.COMPLETED,
  };

  const [videoCompleted, textCompleted, videoTotal, textTotal, assessmentAgg] = await Promise.all([
    LessonProgressRepository.aggregate([
      { $match: completedMatch },
      { $lookup: { from: 'lessons', localField: 'lessonId', foreignField: '_id', as: 'lesson' } },
      { $unwind: '$lesson' },
      { $match: { 'lesson.type': LESSON_TYPES.VIDEO } },
      { $count: 'n' },
    ]),
    LessonProgressRepository.aggregate([
      { $match: completedMatch },
      { $lookup: { from: 'lessons', localField: 'lessonId', foreignField: '_id', as: 'lesson' } },
      { $unwind: '$lesson' },
      { $match: { 'lesson.type': LESSON_TYPES.TEXT } },
      { $count: 'n' },
    ]),
    LessonRepository.aggregate([
      { $match: { courseId: { $in: courseObjIds }, type: LESSON_TYPES.VIDEO } },
      { $count: 'n' },
    ]),
    LessonRepository.aggregate([
      { $match: { courseId: { $in: courseObjIds }, type: LESSON_TYPES.TEXT } },
      { $count: 'n' },
    ]),
    AssessmentAttemptRepository.aggregate([
      { $match: { studentId: studentObjId } },
      { $group: { _id: '$assessmentId', bestScore: { $max: '$score' } } },
      { $group: { _id: null, avg: { $avg: '$bestScore' } } },
    ]),
  ]);

  const cVideo = videoCompleted[0]?.n ?? 0;
  const cText  = textCompleted[0]?.n  ?? 0;
  const tVideo = videoTotal[0]?.n     ?? 0;
  const tText  = textTotal[0]?.n      ?? 0;

  return {
    listening:      tVideo === 0 ? null : Math.floor((cVideo / tVideo) * 100),
    reading:        tText  === 0 ? null : Math.floor((cText  / tText)  * 100),
    assessmentScore: assessmentAgg[0] ? Math.floor(assessmentAgg[0].avg) : null,
    writing:         null,
    speaking:        null,
    _source:         SKILL_RADAR_SOURCE.PRELIMINARY,
  };
};

// Streak: MongoDB obtiene las fechas; el cálculo de racha es JavaScript post-procesado.
// No se resuelve mediante aggregation MongoDB — la detección de días consecutivos requiere
// comparación secuencial entre fechas que no es expresable eficientemente en un pipeline.
const _calculateStreak = async (studentId) => {
  const dateDocs = await LessonProgressRepository.aggregate([
    {
      $match: {
        studentId:   toObjId(studentId),
        status:      PROGRESS_STATUS.COMPLETED,
        completedAt: { $ne: null },
      },
    },
    {
      $project: {
        dateStr: { $dateToString: { format: '%Y-%m-%d', date: '$completedAt' } },
      },
    },
    { $group: { _id: '$dateStr' } },
    { $sort: { _id: -1 } },
  ]);

  if (dateDocs.length === 0) return 0;

  const dateSet = new Set(dateDocs.map((d) => d._id));
  const toStr   = (d) => d.toISOString().split('T')[0];
  const cursor  = new Date();
  cursor.setUTCHours(0, 0, 0, 0);

  let streak = 0;
  while (dateSet.has(toStr(cursor))) {
    streak++;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
};

const _calculateAssessmentSummary = async (studentId, courseIds) => {
  if (courseIds.length === 0) return { total: 0, passed: 0, avgBestScore: null };

  const { docs: assessments } = await AssessmentRepository.findAll(
    { courseId: { $in: courseIds } },
    { limit: 200 },
  );
  if (assessments.length === 0) return { total: 0, passed: 0, avgBestScore: null };

  const bestScores = await Promise.all(
    assessments.map((a) => AssessmentAttemptRepository.findBestScore(studentId, a._id)),
  );

  const withAttempts = bestScores.filter((b) => b !== null);
  const passed       = withAttempts.filter((b) => b.passed).length;
  const avgBestScore = withAttempts.length === 0
    ? null
    : Math.floor(withAttempts.reduce((sum, b) => sum + b.score, 0) / withAttempts.length);

  return { total: assessments.length, passed, avgBestScore };
};

const _getRecentActivity = async (studentId) => {
  return LessonProgressRepository.aggregate([
    { $match: { studentId: toObjId(studentId), status: PROGRESS_STATUS.COMPLETED } },
    { $sort: { completedAt: -1 } },
    { $limit: 5 },
    { $lookup: { from: 'lessons', localField: 'lessonId', foreignField: '_id', as: 'lesson' } },
    { $unwind: '$lesson' },
    { $lookup: { from: 'courses', localField: 'courseId', foreignField: '_id', as: 'course' } },
    { $unwind: '$course' },
    {
      $project: {
        _id:         0,
        lessonId:    '$lessonId',
        lessonTitle: '$lesson.title',
        courseTitle: '$course.title',
        completedAt: '$completedAt',
      },
    },
  ]);
};

// Aggregation directa — nunca bucle sobre students. Ver spec v3 §5.10.
const _calculateCohortProgressAvg = async (studentIds) => {
  if (studentIds.length === 0) return 0;

  const result = await LessonProgressRepository.aggregate([
    { $match: { studentId: { $in: studentIds.map(toObjId) } } },
    {
      $group: {
        _id:       { studentId: '$studentId', courseId: '$courseId' },
        total:     { $sum: 1 },
        completed: { $sum: { $cond: [{ $eq: ['$status', PROGRESS_STATUS.COMPLETED] }, 1, 0] } },
      },
    },
    {
      $project: {
        progress: {
          $floor: { $multiply: [{ $divide: ['$completed', '$total'] }, 100] },
        },
      },
    },
    { $group: { _id: null, cohortProgressAvg: { $avg: '$progress' } } },
  ]);

  return result[0] ? Math.floor(result[0].cohortProgressAvg) : 0;
};

const _calculateCohortGrowth = async (studentIds) => {
  if (studentIds.length === 0) {
    return { lessonsCompleted7d: 0, lessonsCompleted30d: 0, assessmentsPassed30d: 0 };
  }

  const since7d  = daysAgo(GROWTH_WINDOWS.DAYS_7);
  const since30d = daysAgo(GROWTH_WINDOWS.DAYS_30);

  const [completed7d, completed30d, assessmentsPassed30d] = await Promise.all([
    LessonProgressRepository.count({
      studentId: { $in: studentIds },
      status:    PROGRESS_STATUS.COMPLETED,
      completedAt: { $gte: since7d },
    }),
    LessonProgressRepository.count({
      studentId: { $in: studentIds },
      status:    PROGRESS_STATUS.COMPLETED,
      completedAt: { $gte: since30d },
    }),
    AssessmentAttemptRepository.count({
      studentId: { $in: studentIds },
      passed:    true,
      submittedAt: { $gte: since30d },
    }),
  ]);

  return {
    lessonsCompleted7d:  completed7d,
    lessonsCompleted30d: completed30d,
    assessmentsPassed30d,
  };
};

const _calculateCoursesSummary = async () => {
  const { docs: courses } = await CourseRepository.findAll({}, { limit: 200 });

  return Promise.all(
    courses.map(async (course) => {
      const courseObjId = toObjId(course._id);

      const [enrollmentAgg, progressAgg, lastActivityAgg] = await Promise.all([
        EnrollmentRepository.aggregate([
          { $match: { courseId: courseObjId } },
          { $group: { _id: '$status', count: { $sum: 1 } } },
        ]),
        LessonProgressRepository.aggregate([
          { $match: { courseId: courseObjId } },
          {
            $group: {
              _id:       '$studentId',
              total:     { $sum: 1 },
              completed: { $sum: { $cond: [{ $eq: ['$status', PROGRESS_STATUS.COMPLETED] }, 1, 0] } },
            },
          },
          {
            $project: {
              progress: { $floor: { $multiply: [{ $divide: ['$completed', '$total'] }, 100] } },
            },
          },
          { $group: { _id: null, avgProgress: { $avg: '$progress' } } },
        ]),
        LessonProgressRepository.aggregate([
          { $match: { courseId: courseObjId, status: PROGRESS_STATUS.COMPLETED } },
          { $group: { _id: null, lastActivity: { $max: '$completedAt' } } },
        ]),
      ]);

      const byStatus = { active: 0, suspended: 0, completed: 0 };
      enrollmentAgg.forEach((r) => { byStatus[r._id] = r.count; });

      return {
        courseId:             course._id,
        title:                course.title,
        level:                course.level,
        status:               course.status,
        totalEnrollments:     Object.values(byStatus).reduce((s, c) => s + c, 0),
        activeEnrollments:    byStatus.active,
        completedEnrollments: byStatus.completed,
        avgProgress:          progressAgg[0] ? Math.floor(progressAgg[0].avgProgress) : 0,
        lastActivityAt:       lastActivityAgg[0]?.lastActivity || null,
      };
    }),
  );
};

const _calculatePlatformGrowth = async () => {
  const since7d  = daysAgo(GROWTH_WINDOWS.DAYS_7);
  const since30d = daysAgo(GROWTH_WINDOWS.DAYS_30);

  const [
    newEnrollments7d,
    newEnrollments30d,
    lessonsCompleted7d,
    lessonsCompleted30d,
    assessmentsPassed30d,
    activeUsers7d,
    activeUsers30d,
  ] = await Promise.all([
    EnrollmentRepository.count({ enrolledAt: { $gte: since7d } }),
    EnrollmentRepository.count({ enrolledAt: { $gte: since30d } }),
    LessonProgressRepository.count({ status: PROGRESS_STATUS.COMPLETED, completedAt: { $gte: since7d } }),
    LessonProgressRepository.count({ status: PROGRESS_STATUS.COMPLETED, completedAt: { $gte: since30d } }),
    AssessmentAttemptRepository.count({ passed: true, submittedAt: { $gte: since30d } }),
    UserRepository.count({ role: ROLES.STUDENT, isActive: true, lastLoginAt: { $gte: since7d } }),
    UserRepository.count({ role: ROLES.STUDENT, isActive: true, lastLoginAt: { $gte: since30d } }),
  ]);

  return {
    newEnrollments7d,
    newEnrollments30d,
    lessonsCompleted7d,
    lessonsCompleted30d,
    assessmentsPassed30d,
    activeUsers7d,
    activeUsers30d,
  };
};

// ---------------------------------------------------------------------------
// Métodos públicos
// ---------------------------------------------------------------------------

const getStudentDashboard = async (studentId) => {
  // 1. Enrollments con courseId poblado
  const { docs: allEnrollments } = await EnrollmentRepository.findByStudent(studentId, { limit: 100 });
  const activeEnrollments = allEnrollments.filter((e) => e.status === ENROLLMENT_STATUS.ACTIVE);

  // 2. Perfil de usuario + progreso por curso en paralelo
  const [user, ...batchResults] = await Promise.all([
    UserRepository.findById(studentId),
    ...activeEnrollments.map(async (enrollment) => {
      const course = enrollment.courseId; // populated: _id, title, level, ...
      const [cp, { docs: courseAssessments }] = await Promise.all([
        progressService.getCourseProgress(studentId, course._id),
        AssessmentRepository.findAll({ courseId: course._id }, { limit: 100 }),
      ]);
      return { course, cp, courseAssessments };
    }),
  ]);

  // 3. Construir detalles de enrollments + recopilar pendingAssessments
  let totalLessons          = 0;
  let totalLessonsCompleted = 0;
  const lastActivities      = [];
  const pendingAssessments  = [];
  const enrollmentDetails   = [];

  for (let i = 0; i < activeEnrollments.length; i++) {
    const enrollment = activeEnrollments[i];
    const { course, cp, courseAssessments } = batchResults[i];

    totalLessons          += cp.totalLessons;
    totalLessonsCompleted += cp.completedLessons;
    if (cp.lastActivity) lastActivities.push(new Date(cp.lastActivity));

    // Siguiente lección disponible: primera no completada y no bloqueada
    let nextLesson = null;
    for (const u of cp.units) {
      if (u.locked) continue;
      const next = u.lessons.find((l) => !l.completed && !l.locked);
      if (next) {
        const lessonDoc = await LessonRepository.findById(next.lesson._id);
        nextLesson = {
          lessonId:    next.lesson._id,
          lessonTitle: lessonDoc?.title || null,
          unitId:      u.unit._id,
          unitTitle:   u.unit.title,
        };
        break;
      }
    }

    enrollmentDetails.push({
      enrollmentId:          enrollment._id,
      courseId:              course._id,
      courseTitle:           course.title,
      level:                 course.level,
      overallProgress:       cp.overallProgress,
      completedLessons:      cp.completedLessons,
      totalLessons:          cp.totalLessons,
      lastActivityAt:        cp.lastActivity,
      daysSinceLastActivity: daysBetween(cp.lastActivity),
      enrollmentStatus:      enrollment.status,
      nextLesson,
    });

    // Assessments pendientes: unidad completa + assessment existe + no aprobado + intentos restantes
    const unitsDone = cp.units.filter(
      (u) => !u.locked && u.totalLessons > 0 && u.completedLessons === u.totalLessons,
    );
    const pairs = unitsDone
      .map((u) => ({
        u,
        assessment: courseAssessments.find(
          (a) => a.unitId.toString() === u.unit._id.toString(),
        ),
      }))
      .filter((p) => p.assessment !== undefined);

    if (pairs.length > 0) {
      const attemptData = await Promise.all(
        pairs.map(({ assessment }) => Promise.all([
          AssessmentAttemptRepository.findBestScore(studentId, assessment._id),
          AssessmentAttemptRepository.countAttempts(studentId, assessment._id),
        ])),
      );

      for (let j = 0; j < pairs.length; j++) {
        const { u, assessment } = pairs[j];
        const [best, attemptsUsed] = attemptData[j];
        if (best?.passed) continue;
        if (attemptsUsed >= assessment.maxAttempts) continue;
        pendingAssessments.push({
          assessmentId: assessment._id,
          unitId:       assessment.unitId,
          unitTitle:    u.unit.title,
          courseTitle:  course.title,
          attemptsUsed,
          maxAttempts:  assessment.maxAttempts,
        });
      }
    }
  }

  // 4. Valores agregados
  const overallProgressAvg = activeEnrollments.length === 0
    ? 0
    : Math.floor(enrollmentDetails.reduce((s, e) => s + e.overallProgress, 0) / enrollmentDetails.length);
  const lastActivityAt = lastActivities.length === 0
    ? null
    : new Date(Math.max(...lastActivities));
  const courseIds = activeEnrollments.map((e) => e.courseId._id);

  // 5. Cálculos paralelos finales
  const [growth, skillProgress, streakDays, assessmentSummary, recentActivity] = await Promise.all([
    _calculateStudentGrowth(studentId, totalLessons),
    _calculateSkillProgress(studentId, courseIds),
    _calculateStreak(studentId),
    _calculateAssessmentSummary(studentId, courseIds),
    _getRecentActivity(studentId),
  ]);

  return {
    profile: {
      studentId: user._id,
      firstName: user.firstName,
      lastName:  user.lastName,
      avatarUrl: user.avatarUrl,
    },
    summary: {
      totalEnrollments:     activeEnrollments.length,
      overallProgressAvg,
      totalLessonsCompleted,
      totalLessons,
      assessmentsPassed:    assessmentSummary.passed,
      assessmentsTotal:     assessmentSummary.total,
      avgBestScore:         assessmentSummary.avgBestScore,
      lastActivityAt,
      streakDays,
    },
    growth,
    skillProgress,
    enrollments:       enrollmentDetails,
    recentActivity,
    pendingAssessments,
  };
};

const getTeacherDashboard = async (teacherId) => {
  const [teacher, { docs: students }] = await Promise.all([
    UserRepository.findById(teacherId),
    UserRepository.findAll({ assignedTeacherId: teacherId }, { limit: 200 }),
  ]);

  if (students.length === 0) {
    return {
      profile:       { teacherId: teacher._id, firstName: teacher.firstName, lastName: teacher.lastName },
      cohortSummary: { totalStudents: 0, activeStudents7d: 0, cohortProgressAvg: 0, atRiskCount: 0, assessmentPassRate: null },
      cohortGrowth:  { lessonsCompleted7d: 0, lessonsCompleted30d: 0, assessmentsPassed30d: 0 },
      students:      [],
      atRiskStudents: [],
    };
  }

  const studentIds = students.map((s) => s._id);
  const since7d    = daysAgo(GROWTH_WINDOWS.DAYS_7);

  // Aggregations de cohorte + datos por alumno en paralelo
  const [
    cohortProgressAvg,
    cohortGrowth,
    totalAttempts,
    passedAttempts,
    active7dAgg,
    ...perStudentData
  ] = await Promise.all([
    _calculateCohortProgressAvg(studentIds),
    _calculateCohortGrowth(studentIds),
    AssessmentAttemptRepository.count({ studentId: { $in: studentIds } }),
    AssessmentAttemptRepository.count({ studentId: { $in: studentIds }, passed: true }),
    LessonProgressRepository.aggregate([
      {
        $match: {
          studentId:   { $in: studentIds.map(toObjId) },
          status:      PROGRESS_STATUS.COMPLETED,
          completedAt: { $gte: since7d },
        },
      },
      { $group: { _id: '$studentId' } },
    ]),
    ...students.map(async (student) => {
      const { docs: enrollments } = await EnrollmentRepository.findByStudent(student._id, { limit: 100 });
      const active = enrollments.filter((e) => e.status === ENROLLMENT_STATUS.ACTIVE);

      const progressData = await Promise.all(
        active.map(async (e) => {
          const allProgress = await LessonProgressRepository.findByStudentAndCourse(
            student._id,
            e.courseId._id,
          );
          return {
            courseId:         e.courseId._id,
            courseTitle:      e.courseId.title,
            level:            e.courseId.level,
            enrollmentStatus: e.status,
            ...progressCalculator.calcCourseProgress(allProgress),
            lastActivityAt:   progressCalculator.getLastActivity(allProgress),
          };
        }),
      );

      const lastActivity = progressData
        .map((p) => p.lastActivityAt)
        .filter(Boolean)
        .sort((a, b) => new Date(b) - new Date(a))[0] || null;

      const overallProgressAvg = progressData.length === 0
        ? 0
        : Math.floor(progressData.reduce((s, p) => s + p.overallProgress, 0) / progressData.length);

      const isAtRisk =
        (daysBetween(lastActivity) === null || daysBetween(lastActivity) >= AT_RISK_DAYS) &&
        overallProgressAvg < AT_RISK_PROGRESS_THRESHOLD;

      return { student, progressData, lastActivity, overallProgressAvg, isAtRisk };
    }),
  ]);

  const activeStudents7d   = active7dAgg.length;
  const assessmentPassRate = totalAttempts === 0
    ? null
    : Math.floor((passedAttempts / totalAttempts) * 100);

  const studentsList = perStudentData.map(({ student, progressData, lastActivity, isAtRisk }) => ({
    studentId:            student._id,
    firstName:            student.firstName,
    lastName:             student.lastName,
    avatarUrl:            student.avatarUrl,
    isAtRisk,
    daysSinceLastActivity: daysBetween(lastActivity),
    enrollments: progressData.map((p) => ({
      courseId:         p.courseId,
      courseTitle:      p.courseTitle,
      level:            p.level,
      overallProgress:  p.overallProgress,
      completedLessons: p.completedLessons,
      totalLessons:     p.totalLessons,
      lastActivityAt:   p.lastActivityAt,
      enrollmentStatus: p.enrollmentStatus,
    })),
  }));

  const atRiskStudents = perStudentData
    .filter((d) => d.isAtRisk)
    .map((d) => ({
      studentId:            d.student._id,
      firstName:            d.student.firstName,
      lastName:             d.student.lastName,
      daysSinceLastActivity: daysBetween(d.lastActivity),
      overallProgressAvg:   d.overallProgressAvg,
    }));

  return {
    profile: {
      teacherId: teacher._id,
      firstName: teacher.firstName,
      lastName:  teacher.lastName,
    },
    cohortSummary: {
      totalStudents:    students.length,
      activeStudents7d,
      cohortProgressAvg,
      atRiskCount:      atRiskStudents.length,
      assessmentPassRate,
    },
    cohortGrowth,
    students: studentsList,
    atRiskStudents,
  };
};

const getTeacherStudentDetail = async (teacherId, studentId) => {
  // Scope validation — primera operación, antes de cualquier query de datos.
  const student = await UserRepository.findById(studentId);
  if (!student) {
    throw new NotFoundError('STUDENT_NOT_FOUND', 'Alumno no encontrado');
  }
  if (!student.assignedTeacherId || student.assignedTeacherId.toString() !== teacherId.toString()) {
    throw new ForbiddenError('STUDENT_NOT_IN_COHORT', 'Este alumno no pertenece a tu cohorte');
  }
  return getStudentDashboard(studentId);
};

const getAdminDashboard = async () => {
  const [
    userAgg,
    activeUserCount,
    enrollmentAgg,
    courseAgg,
    lessonCount,
    attemptAgg,
    platformGrowth,
    coursesSummary,
  ] = await Promise.all([
    UserRepository.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
    UserRepository.count({ isActive: true }),
    EnrollmentRepository.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    CourseRepository.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    LessonRepository.count({}),
    AssessmentAttemptRepository.aggregate([
      {
        $group: {
          _id:            null,
          totalAttempts:  { $sum: 1 },
          passedAttempts: { $sum: { $cond: ['$passed', 1, 0] } },
          avgScore:       { $avg: '$score' },
        },
      },
    ]),
    _calculatePlatformGrowth(),
    _calculateCoursesSummary(),
  ]);

  const usersByRole = { admin: 0, teacher: 0, student: 0 };
  userAgg.forEach((r) => { usersByRole[r._id] = r.count; });

  const enrollmentsByStatus = { active: 0, suspended: 0, completed: 0 };
  enrollmentAgg.forEach((r) => { enrollmentsByStatus[r._id] = r.count; });

  const coursesByStatus = { draft: 0, published: 0, archived: 0 };
  courseAgg.forEach((r) => { coursesByStatus[r._id] = r.count; });

  const stats          = attemptAgg[0] ?? { totalAttempts: 0, passedAttempts: 0, avgScore: null };
  const passRate       = stats.totalAttempts === 0
    ? null
    : Math.floor((stats.passedAttempts / stats.totalAttempts) * 100);
  const avgScore       = stats.avgScore != null ? Math.floor(stats.avgScore) : null;

  return {
    platform: {
      users: {
        ...usersByRole,
        total:       Object.values(usersByRole).reduce((s, c) => s + c, 0),
        activeTotal: activeUserCount,
      },
      enrollments: {
        ...enrollmentsByStatus,
        total: Object.values(enrollmentsByStatus).reduce((s, c) => s + c, 0),
      },
      courses: {
        ...coursesByStatus,
        total: Object.values(coursesByStatus).reduce((s, c) => s + c, 0),
      },
      lessons:     { total: lessonCount },
      assessments: { totalAttempts: stats.totalAttempts, passRate, avgScore },
    },
    platformGrowth,
    coursesSummary,
  };
};

const getAdminActivityFeed = async (days) => {
  const validDays = Math.min(Math.max(parseInt(days, 10) || 30, 1), ACTIVITY_FEED_MAX_DAYS);
  const startDate = daysAgo(validDays);

  const results = await LessonProgressRepository.aggregate([
    { $match: { status: PROGRESS_STATUS.COMPLETED, completedAt: { $gte: startDate } } },
    {
      $group: {
        _id:              { $dateToString: { format: '%Y-%m-%d', date: '$completedAt' } },
        lessonsCompleted: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Rellenar huecos: garantizar una entrada por día incluyendo días con 0 actividad
  const activityMap = new Map(results.map((r) => [r._id, r.lessonsCompleted]));
  const series      = [];
  const cursor      = new Date(startDate);
  cursor.setUTCHours(0, 0, 0, 0);
  const today = new Date();
  today.setUTCHours(23, 59, 59, 999);

  while (cursor <= today) {
    const dateStr = cursor.toISOString().split('T')[0];
    series.push({ date: dateStr, lessonsCompleted: activityMap.get(dateStr) || 0 });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return { days: validDays, series };
};

const getAdminAtRisk = async () => {
  const { docs: students } = await UserRepository.findAll(
    { role: ROLES.STUDENT, isActive: true },
    { limit: 1000 },
  );

  if (students.length === 0) {
    return { threshold: { days: AT_RISK_DAYS, progressBelow: AT_RISK_PROGRESS_THRESHOLD }, count: 0, students: [] };
  }

  const studentIds    = students.map((s) => s._id);
  const studentObjIds = studentIds.map(toObjId);

  // Tres aggregations en paralelo: enrollments activos + última actividad + progreso por alumno/curso
  const [enrolledAgg, lastActivityAgg, progressAgg] = await Promise.all([
    EnrollmentRepository.aggregate([
      { $match: { studentId: { $in: studentObjIds }, status: ENROLLMENT_STATUS.ACTIVE } },
      { $group: { _id: '$studentId' } },
    ]),
    LessonProgressRepository.aggregate([
      { $match: { studentId: { $in: studentObjIds }, status: PROGRESS_STATUS.COMPLETED } },
      { $group: { _id: '$studentId', lastActivity: { $max: '$completedAt' } } },
    ]),
    LessonProgressRepository.aggregate([
      { $match: { studentId: { $in: studentObjIds } } },
      {
        $group: {
          _id:       { studentId: '$studentId', courseId: '$courseId' },
          total:     { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ['$status', PROGRESS_STATUS.COMPLETED] }, 1, 0] } },
        },
      },
      {
        $project: {
          studentId: '$_id.studentId',
          courseId:  '$_id.courseId',
          progress:  { $floor: { $multiply: [{ $divide: ['$completed', '$total'] }, 100] } },
        },
      },
    ]),
  ]);

  const enrolledStudentIds = new Set(enrolledAgg.map((r) => r._id.toString()));
  const lastActivityMap    = new Map(lastActivityAgg.map((r) => [r._id.toString(), r.lastActivity]));

  // Mapa: studentId → [{ courseId, progress }]
  const studentCourseMap = new Map();
  for (const row of progressAgg) {
    const sId = row.studentId.toString();
    if (!studentCourseMap.has(sId)) studentCourseMap.set(sId, []);
    studentCourseMap.get(sId).push({ courseId: row.courseId, progress: row.progress });
  }

  // Promedio de progreso por alumno
  const avgProgressMap = new Map();
  for (const [sId, courses] of studentCourseMap) {
    const avg = courses.length === 0
      ? 0
      : Math.floor(courses.reduce((s, c) => s + c.progress, 0) / courses.length);
    avgProgressMap.set(sId, avg);
  }

  // Filtrar alumnos en riesgo — solo entre los que tienen al menos un enrollment activo
  const atRisk = students.filter((s) => {
    const sId = s._id.toString();
    if (!enrolledStudentIds.has(sId)) return false;
    const lastAct     = lastActivityMap.get(sId);
    const daysSince   = daysBetween(lastAct);
    const avgProgress = avgProgressMap.get(sId) ?? 0;
    return (daysSince === null || daysSince >= AT_RISK_DAYS) && avgProgress < AT_RISK_PROGRESS_THRESHOLD;
  });

  if (atRisk.length === 0) {
    return { threshold: { days: AT_RISK_DAYS, progressBelow: AT_RISK_PROGRESS_THRESHOLD }, count: 0, students: [] };
  }

  // Cargar títulos de cursos necesarios
  const neededCourseIds = new Set(
    atRisk.flatMap((s) => (studentCourseMap.get(s._id.toString()) || []).map((c) => c.courseId.toString())),
  );
  const courseDocs = await Promise.all([...neededCourseIds].map((id) => CourseRepository.findById(id)));
  const courseMap  = new Map(courseDocs.filter(Boolean).map((c) => [c._id.toString(), c]));

  // Cargar teachers necesarios (deduplicados)
  const neededTeacherIds = [...new Set(
    atRisk.filter((s) => s.assignedTeacherId).map((s) => s.assignedTeacherId.toString()),
  )];
  const teacherDocs = await Promise.all(neededTeacherIds.map((id) => UserRepository.findById(id)));
  const teacherMap  = new Map(teacherDocs.filter(Boolean).map((t) => [t._id.toString(), t]));

  const result = atRisk.map((student) => {
    const sId          = student._id.toString();
    const lastAct      = lastActivityMap.get(sId);
    const courseProgresses = studentCourseMap.get(sId) || [];
    const teacher      = student.assignedTeacherId
      ? teacherMap.get(student.assignedTeacherId.toString()) || null
      : null;

    return {
      studentId:            student._id,
      firstName:            student.firstName,
      lastName:             student.lastName,
      lastActivityAt:       lastAct || null,
      daysSinceLastActivity: daysBetween(lastAct),
      overallProgressAvg:   avgProgressMap.get(sId) ?? 0,
      assignedTeacher: teacher
        ? { teacherId: teacher._id, firstName: teacher.firstName, lastName: teacher.lastName }
        : null,
      enrollments: courseProgresses.map((cp) => {
        const course = courseMap.get(cp.courseId.toString());
        return {
          courseTitle:     course?.title || '',
          level:           course?.level || '',
          overallProgress: cp.progress,
        };
      }),
    };
  });

  return {
    threshold: { days: AT_RISK_DAYS, progressBelow: AT_RISK_PROGRESS_THRESHOLD },
    count:    result.length,
    students: result,
  };
};

// ---------------------------------------------------------------------------

module.exports = {
  getStudentDashboard,
  getTeacherDashboard,
  getTeacherStudentDetail,
  getAdminDashboard,
  getAdminActivityFeed,
  getAdminAtRisk,
};
