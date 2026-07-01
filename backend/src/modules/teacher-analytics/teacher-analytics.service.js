'use strict';

const { Types }                   = require('mongoose');
const UserRepository              = require('../../repositories/user.repository');
const AssessmentAttemptRepository = require('../../repositories/assessmentAttempt.repository');
const AssessmentRepository        = require('../../repositories/assessment.repository');
const UnitRepository              = require('../../repositories/unit.repository');
const CourseRepository            = require('../../repositories/course.repository');
const LessonProgressRepository    = require('../../repositories/lessonProgress.repository');
const validateTeacherScope        = require('../../utils/validateTeacherScope');
const { ROLES, PROGRESS_STATUS }  = require('../../config/constants');

const getAssessmentBreakdown = async (teacherId) => {
  // 1. Obtener cohort del teacher
  const { docs: students } = await UserRepository.findAll(
    { assignedTeacherId: teacherId, role: ROLES.STUDENT },
    { limit: 1000 },
  );

  if (students.length === 0) return [];

  const studentIds = students.map(s => s._id);

  // 2. Aggregation en dos etapas:
  //    - Primera: métricas por (assessment, alumno) para calcular passRate por alumno
  //    - Segunda: métricas de cohort por assessment
  const stats = await AssessmentAttemptRepository.aggregate([
    { $match: { studentId: { $in: studentIds } } },
    {
      $group: {
        _id: { assessmentId: '$assessmentId', studentId: '$studentId' },
        hasPassed:    { $max: '$passed' },
        attemptCount: { $sum: 1 },
        bestScore:    { $max: '$score' },
      },
    },
    {
      $group: {
        _id:                '$_id.assessmentId',
        totalStudentsTried: { $sum: 1 },
        passedStudents:     { $sum: { $cond: ['$hasPassed', 1, 0] } },
        totalAttempts:      { $sum: '$attemptCount' },
        avgBestScore:       { $avg: '$bestScore' },
      },
    },
    {
      $project: {
        _id:                1,
        totalStudentsTried: 1,
        passRate: {
          $round: [
            { $multiply: [{ $divide: ['$passedStudents', '$totalStudentsTried'] }, 100] },
            0,
          ],
        },
        avgScore:    { $round: ['$avgBestScore', 1] },
        avgAttempts: { $round: [{ $divide: ['$totalAttempts', '$totalStudentsTried'] }, 1] },
      },
    },
  ]);

  if (stats.length === 0) return [];

  // 3. Metadatos de assessments
  const assessmentIds = stats.map(s => s._id);
  const { docs: assessments } = await AssessmentRepository.findAll(
    { _id: { $in: assessmentIds } },
    { limit: 1000 },
  );

  // 4. Metadatos de units y courses en paralelo
  const uniqueUnitIds   = [...new Set(assessments.map(a => a.unitId.toString()))];
  const uniqueCourseIds = [...new Set(assessments.map(a => a.courseId.toString()))];

  const [{ docs: units }, { docs: courses }] = await Promise.all([
    UnitRepository.findAll({ _id: { $in: uniqueUnitIds } },   { limit: 1000 }),
    CourseRepository.findAll({ _id: { $in: uniqueCourseIds } }, { limit: 1000 }),
  ]);

  // 5. Mapas de búsqueda rápida
  const assessmentMap = new Map(assessments.map(a => [a._id.toString(), a]));
  const unitMap       = new Map(units.map(u => [u._id.toString(), u]));
  const courseMap     = new Map(courses.map(c => [c._id.toString(), c]));

  // 6. Combinar resultados
  return stats.map(stat => {
    const assessment = assessmentMap.get(stat._id.toString());
    const unit       = assessment ? unitMap.get(assessment.unitId.toString())   : null;
    const course     = assessment ? courseMap.get(assessment.courseId.toString()) : null;

    return {
      assessmentId:       stat._id,
      unitTitle:          unit?.title   ?? 'Unidad desconocida',
      courseTitle:        course?.title ?? 'Curso desconocido',
      passRate:           stat.passRate,
      avgScore:           stat.avgScore,
      avgAttempts:        stat.avgAttempts,
      totalStudentsTried: stat.totalStudentsTried,
    };
  });
};

const getWeeklyTrend = async (teacherId, studentId) => {
  // 1. Scope validation siempre primero
  await validateTeacherScope(teacherId, studentId);

  const studentObjId  = new Types.ObjectId(studentId);
  const eightWeeksAgo = new Date(Date.now() - 8 * 7 * 24 * 60 * 60 * 1000);

  // 2. Tres queries independientes en paralelo
  const [totalLessons, completedBeforeWindow, weeklyData] = await Promise.all([
    LessonProgressRepository.count({ studentId: studentObjId }),
    LessonProgressRepository.count({
      studentId:   studentObjId,
      status:      PROGRESS_STATUS.COMPLETED,
      completedAt: { $lt: eightWeeksAgo },
    }),
    LessonProgressRepository.aggregate([
      {
        $match: {
          studentId:   studentObjId,
          status:      PROGRESS_STATUS.COMPLETED,
          completedAt: { $gte: eightWeeksAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $isoWeekYear: '$completedAt' },
            week: { $isoWeek:     '$completedAt' },
          },
          lessonsCompleted: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.week': 1 } },
    ]),
  ]);

  if (totalLessons === 0 || weeklyData.length === 0) return [];

  // 3. Acumulado por semana partiendo de lecciones completadas antes de la ventana
  let cumulative = completedBeforeWindow;

  return weeklyData.map(w => {
    cumulative += w.lessonsCompleted;
    return {
      weekLabel:          `${w._id.year}-W${String(w._id.week).padStart(2, '0')}`,
      lessonsCompleted:   w.lessonsCompleted,
      cumulativeProgress: Math.round((cumulative / totalLessons) * 100),
    };
  });
};

module.exports = { getAssessmentBreakdown, getWeeklyTrend };
