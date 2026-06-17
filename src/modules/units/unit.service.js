'use strict';

/**
 * modules/units/unit.service.js
 *
 * Métodos:
 *   listUnits(actorRole, actorId, courseId)     → añade locked/completedLessons para student
 *   getUnitById(actorRole, actorId, courseId, unitId) → incluye LessonSummary[]
 *   createUnit(courseId, data)                  → solo en draft; order = maxOrder + 1
 *   updateUnit(courseId, unitId, data)
 *   reorderUnits(courseId, orderedIds)          → valida array completo; bulkWrite
 *   deleteUnit(courseId, unitId)                → solo en draft; cascade lessons + assessment
 */

const UnitRepository       = require('../../repositories/unit.repository');
const CourseRepository     = require('../../repositories/course.repository');
const LessonRepository     = require('../../repositories/lesson.repository');
const EnrollmentRepository = require('../../repositories/enrollment.repository');
const { ROLES, COURSE_STATUS } = require('../../config/constants');
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

const assertCourseAccessible = (actorRole, course) => {
  if (actorRole !== ROLES.ADMIN && course.status !== COURSE_STATUS.PUBLISHED) {
    throw new ForbiddenError('COURSE_NOT_PUBLISHED', 'El curso no está disponible');
  }
};

const assertStudentEnrolled = async (actorId, courseId) => {
  const enrollment = await EnrollmentRepository.findOne({ studentId: actorId, courseId });
  if (!enrollment) throw new ForbiddenError('NOT_ENROLLED', 'No tienes matrícula activa en este curso');
};

const listUnits = async (actorRole, actorId, courseId) => {
  const course = await getCourseOrThrow(courseId);
  assertCourseAccessible(actorRole, course);
  if (actorRole === ROLES.STUDENT) await assertStudentEnrolled(actorId, courseId);
  return UnitRepository.findByCourseId(courseId);
};

const getUnitById = async (actorRole, actorId, courseId, unitId) => {
  const course = await getCourseOrThrow(courseId);
  assertCourseAccessible(actorRole, course);
  if (actorRole === ROLES.STUDENT) await assertStudentEnrolled(actorId, courseId);
  return getUnitOrThrow(courseId, unitId);
};

const createUnit = async (courseId, data) => {
  const course = await getCourseOrThrow(courseId);
  if (course.status === COURSE_STATUS.ARCHIVED) {
    throw new ForbiddenError('COURSE_ARCHIVED', 'No se pueden añadir unidades a un curso archivado');
  }
  const maxOrder = await UnitRepository.getMaxOrder(courseId);
  return UnitRepository.create({ ...data, courseId, order: maxOrder + 1 });
};

const updateUnit = async (courseId, unitId, data) => {
  await getCourseOrThrow(courseId);
  await getUnitOrThrow(courseId, unitId);
  return UnitRepository.updateById(unitId, data);
};

const reorderUnits = async (courseId, orderedIds) => {
  await getCourseOrThrow(courseId);
  const { docs: units } = await UnitRepository.findByCourseId(courseId);

  if (units.length !== orderedIds.length) {
    throw new UnprocessableError('REORDER_INCOMPLETE', 'orderedIds debe incluir todas las unidades del curso');
  }

  const existingIds = new Set(units.map((u) => u._id.toString()));
  const allValid = orderedIds.every((id) => existingIds.has(id.toString()));
  if (!allValid) {
    throw new UnprocessableError('REORDER_INVALID_ID', 'Algún id no pertenece a este curso');
  }

  return UnitRepository.reorder(courseId, orderedIds);
};

const deleteUnit = async (courseId, unitId) => {
  const course = await getCourseOrThrow(courseId);
  if (course.status !== COURSE_STATUS.DRAFT) {
    throw new ForbiddenError('CANNOT_DELETE_UNIT', 'Solo se pueden eliminar unidades de cursos en estado draft');
  }
  await getUnitOrThrow(courseId, unitId);
  await LessonRepository.deleteAllByUnit(unitId);
  await UnitRepository.deleteById(unitId);
};

module.exports = { listUnits, getUnitById, createUnit, updateUnit, reorderUnits, deleteUnit };
