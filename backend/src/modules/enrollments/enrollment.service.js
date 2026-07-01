'use strict';

/**
 * modules/enrollments/enrollment.service.js
 *
 * Métodos:
 *
 *   listEnrollments(actorRole, actorId, filters)
 *     → Admin: todas, sin restricción de scope
 *     → Teacher: solo de sus alumnos asignados (assignedTeacherId), vía
 *       validateTeacherScope si se filtra por studentId, o restringiendo
 *       a su cohorte en caso contrario
 *     → Student: solo las propias
 *
 *   getEnrollmentById(actorRole, actorId, enrollmentId)
 *     → Scope por rol (Teacher vía validateTeacherScope)
 *
 *   createEnrollment(studentId, courseId)
 *     Precondiciones:
 *       1. Student existe con role='student' y isActive=true
 *       2. Course existe con status='published'
 *       3. No existe ya una matrícula para ese par (índice unique lo garantiza en BD)
 *     Proceso:
 *       - Crea Enrollment
 *       - Delega a ProgressService.initializeProgress(enrollmentId, courseId)
 *         que crea todos los LessonProgress en bloque
 *     → Enrollment creada
 *
 *   updateStatus(enrollmentId, status)
 *     → Solo admin
 *     → Transiciones válidas: cualquier → suspended | completed
 *     → NUNCA elimina la matrícula
 */

const EnrollmentRepository = require('../../repositories/enrollment.repository');
const UserRepository       = require('../../repositories/user.repository');
const CourseRepository     = require('../../repositories/course.repository');
const ProgressService      = require('../progress/progress.service');
const pagination           = require('../../utils/pagination');
const validateTeacherScope = require('../../utils/validateTeacherScope');
const { ROLES, COURSE_STATUS, ENROLLMENT_STATUS } = require('../../config/constants');
const {
  NotFoundError,
  ForbiddenError,
  ConflictError,
  UnprocessableError,
} = require('../../utils/ApiError');

const getEnrollmentOrThrow = async (enrollmentId) => {
  const enrollment = await EnrollmentRepository.findById(enrollmentId);
  if (!enrollment) throw new NotFoundError('ENROLLMENT_NOT_FOUND', 'Matrícula no encontrada');
  return enrollment;
};

const assertScope = async (actorRole, actorId, enrollment) => {
  if (actorRole === ROLES.STUDENT && enrollment.studentId.toString() !== actorId.toString()) {
    throw new ForbiddenError('FORBIDDEN', 'Solo puedes acceder a tus propias matrículas');
  }
  if (actorRole === ROLES.TEACHER) {
    await validateTeacherScope(actorId, enrollment.studentId);
  }
};

const listEnrollments = async (actorRole, actorId, query = {}) => {
  const options = pagination.toMongoOptions(query.page, query.limit, query.sortBy, query.sortOrder);

  if (actorRole === ROLES.STUDENT) {
    return EnrollmentRepository.findByStudent(actorId, options);
  }

  const filters = {};
  if (query.studentId) filters.studentId = query.studentId;
  if (query.courseId)  filters.courseId  = query.courseId;
  if (query.status)    filters.status    = query.status;

  if (actorRole === ROLES.TEACHER) {
    if (filters.studentId) {
      await validateTeacherScope(actorId, filters.studentId);
    } else {
      const { docs: cohort } = await UserRepository.findAll(
        { assignedTeacherId: actorId, role: ROLES.STUDENT },
        { limit: 1000 },
      );
      filters.studentId = { $in: cohort.map((s) => s._id) };
    }
  }

  return EnrollmentRepository.findAll(filters, options);
};

const getEnrollmentById = async (actorRole, actorId, enrollmentId) => {
  const enrollment = await getEnrollmentOrThrow(enrollmentId);
  await assertScope(actorRole, actorId, enrollment);
  return enrollment;
};

const createEnrollment = async (studentId, courseId) => {
  const student = await UserRepository.findById(studentId);
  if (!student || student.role !== ROLES.STUDENT) {
    throw new UnprocessableError('INVALID_STUDENT', 'El usuario debe existir y tener rol student');
  }
  if (!student.isActive) {
    throw new ForbiddenError('ACCOUNT_INACTIVE', 'El student tiene la cuenta desactivada');
  }

  const course = await CourseRepository.findById(courseId);
  if (!course) throw new NotFoundError('COURSE_NOT_FOUND', 'Curso no encontrado');
  if (course.status !== COURSE_STATUS.PUBLISHED) {
    throw new UnprocessableError('COURSE_NOT_PUBLISHED', 'Solo se puede matricular en cursos publicados');
  }

  const existing = await EnrollmentRepository.findOne({ studentId, courseId });
  if (existing) throw new ConflictError('ALREADY_ENROLLED', 'El student ya tiene una matrícula en este curso');

  const enrollment = await EnrollmentRepository.create({ studentId, courseId });

  await ProgressService.initializeProgress(enrollment._id, courseId, studentId);

  return enrollment;
};

const updateStatus = async (enrollmentId, status) => {
  if (!Object.values(ENROLLMENT_STATUS).includes(status)) {
    throw new UnprocessableError('INVALID_STATUS', `Estado no válido: ${status}`);
  }
  if (status === ENROLLMENT_STATUS.COMPLETED) {
    throw new ForbiddenError('CANNOT_FORCE_COMPLETE', 'El estado completed lo asigna el sistema automáticamente');
  }

  const enrollment = await getEnrollmentOrThrow(enrollmentId);

  if (enrollment.status === ENROLLMENT_STATUS.COMPLETED) {
    throw new ConflictError('ENROLLMENT_COMPLETED', 'No se puede modificar una matrícula completada');
  }

  return EnrollmentRepository.updateById(enrollmentId, { status });
};

const markCompleted = async (enrollmentId) => {
  return EnrollmentRepository.markCompleted(enrollmentId);
};

module.exports = { listEnrollments, getEnrollmentById, createEnrollment, updateStatus, markCompleted };
