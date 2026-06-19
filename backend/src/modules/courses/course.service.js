'use strict';

/**
 * modules/courses/course.service.js
 *
 * Responsabilidad: Lógica de negocio de gestión de cursos.
 *
 * Métodos:
 *
 *   listCourses(actorRole, filters)
 *     → Admin: todos los estados + filtros completos
 *     → Teacher: sobreescribe status='published'
 *     → Student: solo cursos con Enrollment activa del student
 *
 *   getCourseById(actorRole, actorId, courseId)
 *     → Incluye UnitSummary[] con campo locked calculado para Student
 *     → ForbiddenError si Teacher/Student intenta ver draft/archived
 *     → ForbiddenError si Student no tiene matrícula activa
 *
 *   createCourse(data) → solo status='draft', siempre
 *
 *   updateCourse(courseId, data) → actualiza campos de contenido (no status)
 *
 *   publishCourse(courseId)
 *     Precondiciones:
 *       1. status='draft'         → ConflictError INVALID_STATUS_TRANSITION
 *       2. ≥1 unidad              → UnprocessableError COURSE_REQUIRES_UNIT
 *       3. ≥1 lección por unidad  → UnprocessableError UNIT_REQUIRES_LESSON
 *     → status='published'
 *
 *   archiveCourse(courseId)
 *     → status debe ser 'published' → ConflictError si no
 *     → status='archived'
 *
 *   deleteCourse(courseId)
 *     → ForbiddenError CANNOT_DELETE_PUBLISHED|ARCHIVED si no es draft
 *     → Delega cascade: UnitService.deleteAllByCourse(courseId)
 */

const CourseRepository     = require('../../repositories/course.repository');
const UnitRepository       = require('../../repositories/unit.repository');
const EnrollmentRepository = require('../../repositories/enrollment.repository');
const pagination           = require('../../utils/pagination');
const { ROLES, COURSE_STATUS, ENROLLMENT_STATUS } = require('../../config/constants');
const {
  NotFoundError,
  ConflictError,
  ForbiddenError,
  UnprocessableError,
} = require('../../utils/ApiError');

const getCourseOrThrow = async (courseId) => {
  const course = await CourseRepository.findById(courseId);
  if (!course) throw new NotFoundError('COURSE_NOT_FOUND', 'Curso no encontrado');
  return course;
};

const listCourses = async (actorRole, actorId, filters = {}, query = {}) => {
  const options = pagination.toMongoOptions(pagination.build(query));

  if (actorRole === ROLES.STUDENT) {
    const { docs: enrollments } = await EnrollmentRepository.findAll({
      studentId: actorId,
      status:    ENROLLMENT_STATUS.ACTIVE,
    });
    const courseIds = enrollments.map((e) => e.courseId?.toString());
    const { docs, total } = await CourseRepository.findAll({ status: COURSE_STATUS.PUBLISHED });
    const enrolled = docs.filter((c) => courseIds.includes(c._id.toString()));
    return { docs: enrolled, total: enrolled.length };
  }

  if (actorRole === ROLES.TEACHER) {
    return CourseRepository.findPublished(options);
  }

  return CourseRepository.findAll(filters, options);
};

const getCourseById = async (actorRole, actorId, courseId) => {
  const course = await getCourseOrThrow(courseId);

  if (actorRole !== ROLES.ADMIN && course.status !== COURSE_STATUS.PUBLISHED) {
    throw new ForbiddenError('COURSE_NOT_PUBLISHED', 'El curso no está disponible');
  }

  if (actorRole === ROLES.STUDENT) {
    const enrollment = await EnrollmentRepository.findOne({
      studentId: actorId,
      courseId:  course._id,
    });
    if (!enrollment) {
      throw new ForbiddenError('NOT_ENROLLED', 'No tienes matrícula activa en este curso');
    }
  }

  return course;
};

const createCourse = async (data) => {
  const exists = await CourseRepository.existsByTitle(data.title);
  if (exists) throw new ConflictError('COURSE_TITLE_TAKEN', 'Ya existe un curso con ese título');

  return CourseRepository.create({ ...data, status: COURSE_STATUS.DRAFT });
};

const updateCourse = async (courseId, data) => {
  const course = await getCourseOrThrow(courseId);

  if (data.title && data.title !== course.title) {
    const exists = await CourseRepository.existsByTitle(data.title, courseId);
    if (exists) throw new ConflictError('COURSE_TITLE_TAKEN', 'Ya existe un curso con ese título');
  }

  return CourseRepository.updateById(courseId, data);
};

const publishCourse = async (courseId) => {
  const course = await getCourseOrThrow(courseId);

  if (course.status !== COURSE_STATUS.DRAFT) {
    throw new ConflictError('INVALID_STATUS_TRANSITION', `No se puede publicar un curso en estado '${course.status}'`);
  }

  const unitCount = await UnitRepository.count({ courseId });
  if (unitCount === 0) {
    throw new UnprocessableError('COURSE_REQUIRES_UNIT', 'El curso debe tener al menos una unidad');
  }

  return CourseRepository.updateById(courseId, { status: COURSE_STATUS.PUBLISHED });
};

const archiveCourse = async (courseId) => {
  const course = await getCourseOrThrow(courseId);

  if (course.status !== COURSE_STATUS.PUBLISHED) {
    throw new ConflictError('INVALID_STATUS_TRANSITION', `No se puede archivar un curso en estado '${course.status}'`);
  }

  return CourseRepository.updateById(courseId, { status: COURSE_STATUS.ARCHIVED });
};

const deleteCourse = async (courseId) => {
  const course = await getCourseOrThrow(courseId);

  if (course.status !== COURSE_STATUS.DRAFT) {
    throw new ForbiddenError('CANNOT_DELETE_PUBLISHED', 'Solo se pueden eliminar cursos en estado draft');
  }

  await CourseRepository.deleteById(courseId);
};

module.exports = {
  listCourses,
  getCourseById,
  createCourse,
  updateCourse,
  publishCourse,
  archiveCourse,
  deleteCourse,
};
