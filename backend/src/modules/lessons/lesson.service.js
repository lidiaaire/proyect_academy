'use strict';

/**
 * modules/lessons/lesson.service.js
 *
 * Métodos:
 *   listLessons(actorRole, actorId, courseId, unitId)
 *     → Sin content/videoUrl en la respuesta (proyección reducida para índice)
 *     → Añade locked/completed para student
 *
 *   getLessonById(actorRole, actorId, courseId, unitId, lessonId)
 *     → Incluye content y videoUrl
 *     → ForbiddenError LESSON_LOCKED si student intenta acceder a lección bloqueada
 *
 *   createLesson(courseId, unitId, data)
 *     → Valida coherencia type/content/videoUrl
 *     → order = maxOrder + 1
 *
 *   updateLesson(courseId, unitId, lessonId, data)
 *     → type es inmutable — se ignora si se envía
 *
 *   reorderLessons(courseId, unitId, orderedIds)
 *     → Valida array completo; bulkWrite
 *
 *   deleteLesson(courseId, unitId, lessonId)
 *     → Solo en curso draft
 *     → Recompacta order de lecciones restantes
 */

const LessonRepository            = require('../../repositories/lesson.repository');
const UnitRepository              = require('../../repositories/unit.repository');
const CourseRepository            = require('../../repositories/course.repository');
const EnrollmentRepository        = require('../../repositories/enrollment.repository');
const LessonProgressRepository    = require('../../repositories/lessonProgress.repository');
const AssessmentRepository        = require('../../repositories/assessment.repository');
const AssessmentAttemptRepository = require('../../repositories/assessmentAttempt.repository');
const { ROLES, COURSE_STATUS, LESSON_TYPES, PROGRESS_STATUS, ENROLLMENT_STATUS } = require('../../config/constants');
const {
  NotFoundError,
  ForbiddenError,
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

const getLessonOrThrow = async (unitId, lessonId) => {
  const lesson = await LessonRepository.findOne({ _id: lessonId, unitId });
  if (!lesson) throw new NotFoundError('LESSON_NOT_FOUND', 'Lección no encontrada');
  return lesson;
};

const assertCourseAccessible = (actorRole, course) => {
  if (actorRole !== ROLES.ADMIN && course.status !== COURSE_STATUS.PUBLISHED) {
    throw new ForbiddenError('COURSE_NOT_PUBLISHED', 'El curso no está disponible');
  }
};

const assertStudentEnrolled = async (actorId, courseId) => {
  const enrollment = await EnrollmentRepository.findOne({ studentId: actorId, courseId, status: ENROLLMENT_STATUS.ACTIVE });
  if (!enrollment) throw new ForbiddenError('NOT_ENROLLED', 'No tienes matrícula activa en este curso');
  return enrollment;
};

// Verifica si la unidad actual está bloqueada porque la unidad anterior no está
// completamente superada (lecciones 100 % + assessment aprobado si existe).
const isCurrentUnitLocked = async (studentId, unit) => {
  if (unit.order === 1) return false;
  const prevUnit = await UnitRepository.findOne({ courseId: unit.courseId, order: unit.order - 1 });
  if (!prevUnit) return false;

  const { docs: prevLessons } = await LessonRepository.findByUnitId(prevUnit._id);
  const progresses = await Promise.all(
    prevLessons.map((l) => LessonProgressRepository.findByStudentAndLesson(studentId, l._id))
  );
  if (!progresses.every((p) => p?.status === PROGRESS_STATUS.COMPLETED)) return true;

  const assessment = await AssessmentRepository.findOne({ unitId: prevUnit._id });
  if (!assessment) return false;

  const best = await AssessmentAttemptRepository.findBestScore(studentId, assessment._id);
  return !(best?.passed === true);
};

const isLessonLocked = async (unit, lesson, actorId) => {
  if (!unit.sequentialUnlock) return false;
  if (lesson.order === 1) return isCurrentUnitLocked(actorId, unit);
  const prevLesson = await LessonRepository.findOne({ unitId: lesson.unitId, order: lesson.order - 1 });
  if (!prevLesson) return false;
  const prevProgress = await LessonProgressRepository.findByStudentAndLesson(actorId, prevLesson._id);
  return !prevProgress || prevProgress.status !== PROGRESS_STATUS.COMPLETED;
};

const assertTypeContentCoherence = (type, data) => {
  if (type === LESSON_TYPES.TEXT && !data.content) {
    throw new UnprocessableError('CONTENT_REQUIRED', 'Las lecciones de tipo text requieren el campo content');
  }
  if (type === LESSON_TYPES.VIDEO && !data.videoUrl) {
    throw new UnprocessableError('VIDEO_URL_REQUIRED', 'Las lecciones de tipo video requieren el campo videoUrl');
  }
};

const listLessons = async (actorRole, actorId, courseId, unitId) => {
  const course = await getCourseOrThrow(courseId);
  assertCourseAccessible(actorRole, course);
  const unit = await getUnitOrThrow(courseId, unitId);

  if (actorRole === ROLES.STUDENT) {
    await assertStudentEnrolled(actorId, courseId);
  }

  const { docs, total } = await LessonRepository.findByUnitId(unitId);

  if (actorRole !== ROLES.STUDENT) return { docs, total };

  const docsWithMeta = await Promise.all(
    docs.map(async (lesson) => {
      const locked = await isLessonLocked(unit, lesson, actorId);
      const progress = await LessonProgressRepository.findOne({ studentId: actorId, lessonId: lesson._id });
      return { ...lesson.toObject(), locked, completed: progress?.status === PROGRESS_STATUS.COMPLETED };
    })
  );

  return { docs: docsWithMeta, total };
};

const getLessonById = async (actorRole, actorId, courseId, unitId, lessonId) => {
  const course = await getCourseOrThrow(courseId);
  assertCourseAccessible(actorRole, course);
  const unit   = await getUnitOrThrow(courseId, unitId);
  const lesson = await getLessonOrThrow(unitId, lessonId);

  if (actorRole === ROLES.STUDENT) {
    await assertStudentEnrolled(actorId, courseId);
    const locked = await isLessonLocked(unit, lesson, actorId);
    if (locked) throw new ForbiddenError('LESSON_LOCKED', 'Debes completar la lección anterior primero');
  }

  return lesson;
};

const createLesson = async (courseId, unitId, data) => {
  const course = await getCourseOrThrow(courseId);
  if (course.status === COURSE_STATUS.ARCHIVED) {
    throw new ForbiddenError('COURSE_ARCHIVED', 'No se pueden añadir lecciones a un curso archivado');
  }
  await getUnitOrThrow(courseId, unitId);
  assertTypeContentCoherence(data.type, data);

  const maxOrder = await LessonRepository.getMaxOrder(unitId);
  const lesson   = await LessonRepository.create({ ...data, unitId, courseId, order: maxOrder + 1 });

  if (course.status === COURSE_STATUS.PUBLISHED) {
    const { docs: activeEnrollments } = await EnrollmentRepository.findAll({
      courseId,
      status: ENROLLMENT_STATUS.ACTIVE,
    });
    if (activeEnrollments.length > 0) {
      const progressDocs = activeEnrollments.map((e) => ({
        enrollmentId: e._id,
        studentId:    e.studentId,
        lessonId:     lesson._id,
        unitId,
        courseId,
        status:       PROGRESS_STATUS.NOT_STARTED,
      }));
      await LessonProgressRepository.bulkCreate(progressDocs).catch((err) => {
        if (err.code !== 11000 && err.name !== 'BulkWriteError') throw err;
      });
    }
  }

  return lesson;
};

const updateLesson = async (courseId, unitId, lessonId, data) => {
  await getCourseOrThrow(courseId);
  await getUnitOrThrow(courseId, unitId);
  const lesson = await getLessonOrThrow(unitId, lessonId);

  const { type: _ignored, order: _order, unitId: _unit, courseId: _course, ...safeData } = data;

  if (safeData.content !== undefined || safeData.videoUrl !== undefined) {
    assertTypeContentCoherence(lesson.type, { ...lesson.toObject(), ...safeData });
  }

  return LessonRepository.updateById(lessonId, safeData);
};

const reorderLessons = async (courseId, unitId, orderedIds) => {
  await getCourseOrThrow(courseId);
  await getUnitOrThrow(courseId, unitId);

  const { docs: lessons } = await LessonRepository.findByUnitId(unitId);
  if (lessons.length !== orderedIds.length) {
    throw new UnprocessableError('REORDER_INCOMPLETE', 'orderedIds debe incluir todas las lecciones de la unidad');
  }
  const existingIds = new Set(lessons.map((l) => l._id.toString()));
  if (!orderedIds.every((id) => existingIds.has(id.toString()))) {
    throw new UnprocessableError('REORDER_INVALID_ID', 'Algún id no pertenece a esta unidad');
  }

  return LessonRepository.reorder(unitId, orderedIds);
};

const deleteLesson = async (courseId, unitId, lessonId) => {
  const course = await getCourseOrThrow(courseId);
  if (course.status !== COURSE_STATUS.DRAFT) {
    throw new ForbiddenError('CANNOT_DELETE_LESSON', 'Solo se pueden eliminar lecciones de cursos en estado draft');
  }
  await getUnitOrThrow(courseId, unitId);
  await getLessonOrThrow(unitId, lessonId);
  await LessonRepository.deleteById(lessonId);
  await LessonProgressRepository.deleteAllByLesson(lessonId);

  const remaining = await LessonRepository.findByUnitIdWithContent(unitId);
  if (remaining.length > 0) {
    await LessonRepository.reorder(unitId, remaining.map((l) => l._id));
  }
};

module.exports = { listLessons, getLessonById, createLesson, updateLesson, reorderLessons, deleteLesson };
