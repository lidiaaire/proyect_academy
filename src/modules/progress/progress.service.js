'use strict';

/**
 * modules/progress/progress.service.js
 *
 * Responsabilidad: Toda la lógica de progreso académico.
 * El progreso NUNCA se almacena — siempre se calcula desde LessonProgress.
 *
 * Métodos:
 *
 *   initializeProgress(enrollmentId, courseId)
 *     → Carga todos los lessonIds del curso (LessonRepository.findByCourseId)
 *     → Construye array de docs con status='not_started'
 *     → LessonProgressRepository.bulkCreate(docs)
 *     → Llamado por EnrollmentService al crear matrícula
 *
 *   completeLesson(studentId, lessonId)
 *     Precondiciones:
 *       1. Lesson existe
 *       2. Matrícula activa en el curso de la lección
 *       3. Lección desbloqueada (ProgressCalculator.isLessonLocked = false)
 *     Proceso:
 *       - Si ya completed → retorna estado actual (idempotente)
 *       - Actualiza status='completed', completedAt=now
 *       - Calcula snapshot de 3 niveles con ProgressCalculator
 *     → { lesson, unit, course } snapshot
 *
 *   getCourseProgress(studentId, courseId)
 *     → Carga todos LessonProgress del student en el curso
 *     → Construye CourseProgress completo con UnitProgress[] y LessonProgressItem[]
 *     → ProgressCalculator para locked, progress %, lastActivity
 *
 *   getProgressOverview(studentId)
 *     → Todas las matrículas del student
 *     → Para cada una calcula CourseOverviewItem con overallProgress
 *
 *   getStudentCourseProgress(actorRole, actorId, studentId, courseId)
 *     → Mismo que getCourseProgress pero con verificación de scope para Teacher
 *
 *   getStudentOverview(actorRole, actorId, studentId)
 *     → Mismo que getProgressOverview pero con verificación de scope para Teacher
 */

const LessonProgressRepository    = require('../../repositories/lessonProgress.repository');
const LessonRepository            = require('../../repositories/lesson.repository');
const EnrollmentRepository        = require('../../repositories/enrollment.repository');
const UnitRepository              = require('../../repositories/unit.repository');
const AssessmentRepository        = require('../../repositories/assessment.repository');
const AssessmentAttemptRepository = require('../../repositories/assessmentAttempt.repository');
const progressCalculator          = require('../../utils/progressCalculator');
const { ROLES, PROGRESS_STATUS, ENROLLMENT_STATUS } = require('../../config/constants');
const {
  NotFoundError,
  ForbiddenError,
} = require('../../utils/ApiError');

// Llamado por EnrollmentService al crear matrícula.
// studentId se pasa explícitamente porque el Enrollment model puede ser stub.
const initializeProgress = async (enrollmentId, courseId, studentId) => {
  const lessons = await LessonRepository.findByCourseId(courseId);
  if (!lessons.length) return;

  const docs = lessons.map((lesson) => ({
    enrollmentId,
    studentId,
    lessonId:  lesson._id,
    unitId:    lesson.unitId,
    courseId,
    status:    PROGRESS_STATUS.NOT_STARTED,
    completedAt: null,
  }));

  await LessonProgressRepository.bulkCreate(docs);
};

const assertLessonUnlocked = async (studentId, progress) => {
  const unit = await UnitRepository.findById(progress.unitId);
  if (!unit || !unit.sequentialUnlock) return;

  const lesson = await LessonRepository.findById(progress.lessonId);
  if (!lesson || lesson.order === 1) return;

  const prevLesson = await LessonRepository.findOne({ unitId: progress.unitId, order: lesson.order - 1 });
  if (!prevLesson) return;

  const prevProgress = await LessonProgressRepository.findByStudentAndLesson(studentId, prevLesson._id);
  if (!prevProgress || prevProgress.status !== PROGRESS_STATUS.COMPLETED) {
    throw new ForbiddenError('LESSON_LOCKED', 'Debes completar la lección anterior primero');
  }
};

const completeLesson = async (studentId, lessonId) => {
  const progress = await LessonProgressRepository.findByStudentAndLesson(studentId, lessonId);
  if (!progress) throw new NotFoundError('PROGRESS_NOT_FOUND', 'Progreso de lección no encontrado');

  if (progress.status === PROGRESS_STATUS.COMPLETED) {
    return { completed: true, alreadyCompleted: true, progress };
  }

  const enrollment = await EnrollmentRepository.findOne({ studentId, courseId: progress.courseId, status: ENROLLMENT_STATUS.ACTIVE });
  if (!enrollment) throw new ForbiddenError('NOT_ENROLLED', 'No tienes matrícula activa en este curso');

  await assertLessonUnlocked(studentId, progress);

  const updated = await LessonProgressRepository.markCompleted(studentId, lessonId);

  const allProgress    = await LessonProgressRepository.findByStudentAndCourse(studentId, progress.courseId);
  const courseSnapshot = progressCalculator.calcCourseProgress(allProgress);
  const unitSnapshot   = progressCalculator.calcUnitProgress(allProgress, progress.unitId);

  if (courseSnapshot.overallProgress === 100) {
    const EnrollmentService = require('../enrollments/enrollment.service');
    await EnrollmentService.markCompleted(enrollment._id);
  }

  return { completed: true, alreadyCompleted: false, progress: updated, courseSnapshot, unitSnapshot };
};

const getCourseProgress = async (studentId, courseId) => {
  const allProgress     = await LessonProgressRepository.findByStudentAndCourse(studentId, courseId);
  const { docs: units } = await UnitRepository.findByCourseId(courseId);
  const allLessons      = await LessonRepository.findByCourseId(courseId);

  const { docs: assessments } = await AssessmentRepository.findAll({ courseId });
  const assessmentStatusMap   = new Map();
  await Promise.all(
    assessments.map(async (a) => {
      const best = await AssessmentAttemptRepository.findBestScore(studentId, a._id);
      assessmentStatusMap.set(a.unitId.toString(), best?.passed === true);
    })
  );

  const lessonOrderMap = new Map(allLessons.map((l) => [l._id.toString(), l.order]));
  const progressMap    = new Map(allProgress.map((p) => [p.lessonId.toString(), p]));

  const unitProgress = units.map((unit) => {
    const unitLessons = allLessons.filter((l) => l.unitId.toString() === unit._id.toString());
    return {
      unit,
      locked: progressCalculator.isUnitLocked(unit, units, allProgress, assessmentStatusMap),
      ...progressCalculator.calcUnitProgress(allProgress, unit._id),
      lessons: unitLessons.map((lesson) => ({
        lesson,
        locked:    progressCalculator.isLessonLocked(lesson, progressMap, unit, lessonOrderMap),
        completed: progressMap.get(lesson._id.toString())?.status === 'completed',
      })),
    };
  });

  return {
    ...progressCalculator.calcCourseProgress(allProgress),
    lastActivity: progressCalculator.getLastActivity(allProgress),
    units: unitProgress,
  };
};

const getProgressOverview = async (studentId) => {
  const { docs: enrollments } = await EnrollmentRepository.findAll({ studentId, status: ENROLLMENT_STATUS.ACTIVE });

  return Promise.all(
    enrollments.map(async (enrollment) => {
      const allProgress = await LessonProgressRepository.findByStudentAndCourse(studentId, enrollment.courseId);
      return {
        enrollmentId: enrollment._id,
        courseId:     enrollment.courseId,
        ...progressCalculator.calcCourseProgress(allProgress),
      };
    })
  );
};

const getStudentCourseProgress = async (actorRole, actorId, studentId, courseId) => {
  if (actorRole === ROLES.STUDENT && actorId.toString() !== studentId.toString()) {
    throw new ForbiddenError('FORBIDDEN', 'Solo puedes consultar tu propio progreso');
  }
  return getCourseProgress(studentId, courseId);
};

const getStudentOverview = async (actorRole, actorId, studentId) => {
  if (actorRole === ROLES.STUDENT && actorId.toString() !== studentId.toString()) {
    throw new ForbiddenError('FORBIDDEN', 'Solo puedes consultar tu propio progreso');
  }
  return getProgressOverview(studentId);
};

module.exports = {
  initializeProgress,
  completeLesson,
  getCourseProgress,
  getProgressOverview,
  getStudentCourseProgress,
  getStudentOverview,
};
