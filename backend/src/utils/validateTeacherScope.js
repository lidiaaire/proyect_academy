const { NotFoundError, ForbiddenError } = require('./ApiError');
const UserRepository = require('../repositories/user.repository');

/**
 * Lanza NotFoundError si el alumno no existe.
 * Lanza ForbiddenError si el alumno no pertenece al teacher.
 */
const validateTeacherScope = async (teacherId, studentId) => {
  const student = await UserRepository.findById(studentId);

  if (!student) {
    throw new NotFoundError('STUDENT_NOT_FOUND', 'Alumno no encontrado');
  }

  if (!student.assignedTeacherId || student.assignedTeacherId.toString() !== teacherId.toString()) {
    throw new ForbiddenError('STUDENT_NOT_IN_COHORT', 'Este alumno no pertenece a tu cohorte');
  }
};

module.exports = validateTeacherScope;
