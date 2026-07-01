'use strict';

/**
 * modules/assessments/assessment.service.js
 *
 * Métodos:
 *
 *   getAssessment(actorRole, actorId, courseId, unitId)
 *     → Admin: incluye correctAnswer
 *     → Teacher: excluye correctAnswer
 *     → Student: excluye correctAnswer + verifica que todas las lecciones de la unidad están completadas
 *
 *   createAssessment(courseId, unitId, data)
 *     → ForbiddenError si el curso está archivado (mismo guard que createUnit/createLesson)
 *     → ConflictError si ya existe un assessment para esa unidad
 *
 *   updateAssessment(courseId, unitId, data)
 *
 *   deleteAssessment(courseId, unitId)
 *     → Solo en curso draft
 *
 *   submitAttempt(studentId, assessmentId, answers)
 *     Precondiciones:
 *       1. Matrícula activa en el curso
 *       2. Todas las lecciones de la unidad completadas
 *       3. intentos previos < Assessment.maxAttempts
 *     Proceso:
 *       - Carga Assessment CON correctAnswer (único caso)
 *       - Calcula isCorrect por pregunta
 *       - Calcula score = (puntos_obtenidos / puntos_totales) * 100  (ponderado por question.points)
 *       - Calcula passed = score >= passingScore
 *       - Persiste AssessmentAttempt inmutable
 *     → AssessmentAttempt creado (sin correctAnswer en respuesta al student)
 *
 *   listAttempts(actorRole, actorId, assessmentId)
 *     → Historial de intentos con scope por rol
 */

const AssessmentRepository        = require('../../repositories/assessment.repository');
const AssessmentAttemptRepository = require('../../repositories/assessmentAttempt.repository');
const CourseRepository            = require('../../repositories/course.repository');
const UnitRepository              = require('../../repositories/unit.repository');
const LessonRepository            = require('../../repositories/lesson.repository');
const LessonProgressRepository    = require('../../repositories/lessonProgress.repository');
const EnrollmentRepository        = require('../../repositories/enrollment.repository');
const { ROLES, COURSE_STATUS, PROGRESS_STATUS, ENROLLMENT_STATUS } = require('../../config/constants');
const achievementService = require('../achievements/achievement.service');
const {
  NotFoundError,
  ForbiddenError,
  ConflictError,
  UnprocessableError,
} = require('../../utils/ApiError');

const getCourseOrThrow = async (courseId) => {
  const course = await CourseRepository.findById(courseId);
  if (!course) throw new NotFoundError('COURSE_NOT_FOUND', 'Curso no encontrado');
  return course;
};

const getUnitOrThrow = async (courseId, unitId) => {
  const unit = await UnitRepository.findOne({ _id: unitId, courseId });
  if (!unit) throw new NotFoundError('UNIT_NOT_FOUND', 'Unidad no encontrada');
  return unit;
};

const getAssessmentOrThrow = async (unitId, includeCorrectAnswers = false) => {
  const assessment = await AssessmentRepository.findByUnitId(unitId, includeCorrectAnswers);
  if (!assessment) throw new NotFoundError('ASSESSMENT_NOT_FOUND', 'Assessment no encontrado');
  return assessment;
};

const assertAllLessonsCompleted = async (studentId, unitId) => {
  const allLessons = await LessonRepository.findByUnitIdWithContent(unitId);
  if (!allLessons.length) return;

  const completedCount = await Promise.all(
    allLessons.map((l) => LessonProgressRepository.findByStudentAndLesson(studentId, l._id))
  ).then((results) => results.filter((p) => p?.status === PROGRESS_STATUS.COMPLETED).length);

  if (completedCount < allLessons.length) {
    throw new ForbiddenError('LESSONS_INCOMPLETE', 'Debes completar todas las lecciones de la unidad primero');
  }
};

const assertActiveEnrollment = async (studentId, courseId) => {
  const enrollment = await EnrollmentRepository.findOne({ studentId, courseId, status: ENROLLMENT_STATUS.ACTIVE });
  if (!enrollment) throw new ForbiddenError('NOT_ENROLLED', 'No tienes matrícula activa en este curso');
  return enrollment;
};

const getAssessment = async (actorRole, actorId, courseId, unitId) => {
  const course = await getCourseOrThrow(courseId);
  if (actorRole !== ROLES.ADMIN && course.status !== COURSE_STATUS.PUBLISHED) {
    throw new ForbiddenError('COURSE_NOT_PUBLISHED', 'El curso no está disponible');
  }
  await getUnitOrThrow(courseId, unitId);

  if (actorRole === ROLES.STUDENT) {
    await assertActiveEnrollment(actorId, courseId);
    await assertAllLessonsCompleted(actorId, unitId);
  }

  return AssessmentRepository.findByUnitId(unitId, actorRole === ROLES.ADMIN);
};

const createAssessment = async (courseId, unitId, data) => {
  const course = await getCourseOrThrow(courseId);
  if (course.status === COURSE_STATUS.ARCHIVED) {
    throw new ForbiddenError('COURSE_ARCHIVED', 'No se pueden añadir assessments a un curso archivado');
  }
  await getUnitOrThrow(courseId, unitId);

  const existing = await AssessmentRepository.findByUnitId(unitId);
  if (existing) throw new ConflictError('ASSESSMENT_EXISTS', 'Esta unidad ya tiene un assessment');

  return AssessmentRepository.create({ ...data, unitId, courseId });
};

const updateAssessment = async (courseId, unitId, data) => {
  await getCourseOrThrow(courseId);
  await getUnitOrThrow(courseId, unitId);
  const assessment = await getAssessmentOrThrow(unitId);

  const { unitId: _u, courseId: _c, ...safeData } = data;
  return AssessmentRepository.updateById(assessment._id, safeData);
};

const deleteAssessment = async (courseId, unitId) => {
  const course = await getCourseOrThrow(courseId);
  if (course.status !== COURSE_STATUS.DRAFT) {
    throw new ForbiddenError('CANNOT_DELETE_ASSESSMENT', 'Solo se pueden eliminar assessments de cursos en estado draft');
  }
  await getUnitOrThrow(courseId, unitId);
  const assessment = await getAssessmentOrThrow(unitId);
  await AssessmentAttemptRepository.deleteAllByAssessment(assessment._id);
  await AssessmentRepository.deleteByUnitId(unitId);
};

const submitAttempt = async (studentId, courseId, unitId, answers) => {
  await getUnitOrThrow(courseId, unitId);

  const enrollment = await EnrollmentRepository.findOne({ studentId, courseId, status: ENROLLMENT_STATUS.ACTIVE });
  if (!enrollment) throw new ForbiddenError('NOT_ENROLLED', 'No tienes matrícula activa en este curso');

  await assertAllLessonsCompleted(studentId, unitId);

  const assessment = await getAssessmentOrThrow(unitId, true);

  const attemptCount = await AssessmentAttemptRepository.countAttempts(studentId, assessment._id);
  if (attemptCount >= assessment.maxAttempts) {
    throw new ForbiddenError('MAX_ATTEMPTS_REACHED', `Has alcanzado el máximo de ${assessment.maxAttempts} intentos`);
  }

  const bestScore = await AssessmentAttemptRepository.findBestScore(studentId, assessment._id);
  if (bestScore?.passed) {
    throw new ForbiddenError('ALREADY_PASSED', 'Ya has superado este assessment');
  }

  const evaluated = assessment.questions.map((q, i) => ({
    questionId: q._id,
    selected:   answers[i],
    isCorrect:  answers[i] === q.correctIndex,
  }));

  const totalPoints  = assessment.questions.reduce((sum, q) => sum + q.points, 0);
  const earnedPoints = assessment.questions.reduce((sum, q, i) => sum + (evaluated[i].isCorrect ? q.points : 0), 0);
  const score        = Math.floor((earnedPoints / totalPoints) * 100);
  const passed       = score >= assessment.passingScore;

  const attempt = await AssessmentAttemptRepository.create({
    assessmentId:  assessment._id,
    studentId,
    attemptNumber: attemptCount + 1,
    answers:       evaluated,
    score,
    passed,
    submittedAt:   new Date(),
  });

  if (score === 100) {
    await achievementService.unlockAchievement(studentId, 'perfect_assessment');
  }

  return attempt;
};

const listAttempts = async (actorRole, actorId, courseId, unitId) => {
  await getUnitOrThrow(courseId, unitId);
  const assessment = await getAssessmentOrThrow(unitId);

  if (actorRole === ROLES.STUDENT) {
    await assertActiveEnrollment(actorId, courseId);
    return AssessmentAttemptRepository.findByStudentAndAssessment(actorId, assessment._id);
  }
  return AssessmentAttemptRepository.findAll({ assessmentId: assessment._id });
};

module.exports = { getAssessment, createAssessment, updateAssessment, deleteAssessment, submitAttempt, listAttempts };
