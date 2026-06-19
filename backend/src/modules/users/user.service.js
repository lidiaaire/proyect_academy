'use strict';

const bcrypt = require('bcryptjs');

const userRepository                = require('../../repositories/user.repository');
const { build: buildPagination,
        toMongoOptions }            = require('../../utils/pagination');
const { ConflictError,
        NotFoundError,
        ForbiddenError,
        UnprocessableError }        = require('../../utils/ApiError');
const { ROLES }                     = require('../../config/constants');

const BCRYPT_ROUNDS = 10;

// ---------------------------------------------------------------------------
// Helper privado — no forma parte de la API pública del Service.
// Verifica que un ID referenciado corresponde a un teacher existente y activo.
// Lanza errores de dominio; el caller no necesita manejar nulls.
// ---------------------------------------------------------------------------
const _validateTeacherAssignment = async (teacherId) => {
  const teacher = await userRepository.findById(teacherId);

  if (!teacher) {
    throw new NotFoundError('TEACHER_NOT_FOUND', 'El profesor asignado no existe');
  }
  if (teacher.role !== ROLES.TEACHER) {
    throw new UnprocessableError('INVALID_TEACHER_ROLE', 'El usuario asignado no tiene rol de profesor');
  }
  if (!teacher.isActive) {
    throw new UnprocessableError('TEACHER_INACTIVE', 'El profesor asignado está inactivo');
  }
};

// ---------------------------------------------------------------------------
// createUser
// Responsabilidad: crear un usuario con contraseña hasheada y validaciones
// de negocio completas (unicidad de email, coherencia de assignedTeacherId).
// El hashing ocurre aquí — el Repository nunca recibe una contraseña en texto plano.
// ---------------------------------------------------------------------------
const createUser = async (data) => {
  const { firstName, lastName, email, password, role, assignedTeacherId, avatarUrl } = data;

  if (await userRepository.existsByEmail(email)) {
    throw new ConflictError('EMAIL_ALREADY_EXISTS', `El email ${email} ya está registrado`);
  }

  // assignedTeacherId solo tiene sentido para estudiantes
  if (assignedTeacherId != null && role !== ROLES.STUDENT) {
    throw new UnprocessableError(
      'ASSIGNED_TEACHER_ONLY_FOR_STUDENTS',
      'Solo se puede asignar un profesor a usuarios con rol student',
    );
  }

  if (assignedTeacherId != null) {
    await _validateTeacherAssignment(assignedTeacherId);
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  const user = await userRepository.create({
    firstName,
    lastName,
    email,
    passwordHash,
    role,
    assignedTeacherId: assignedTeacherId ?? null,
    avatarUrl:         avatarUrl         ?? null,
  });

  // TODO [Phase TeacherProfile]: si role === ROLES.TEACHER, llamar a
  // teacherProfileService.create(user._id) dentro de una sesión MongoDB
  // para garantizar atomicidad. La estrategia de compensación se diseña
  // en esa fase — no se implementa aquí para no acoplar módulos prematuramente.

  return user;
};

// ---------------------------------------------------------------------------
// getUserById
// Responsabilidad: obtener cualquier usuario por ID, activo o inactivo.
// El filtrado por isActive es responsabilidad del middleware de autorización,
// no de esta consulta — el admin necesita poder ver usuarios inactivos.
// ---------------------------------------------------------------------------
const getUserById = async (id) => {
  const user = await userRepository.findById(id);
  if (!user) throw new NotFoundError('USER_NOT_FOUND', 'El usuario no existe');
  return user;
};

// ---------------------------------------------------------------------------
// listUsers
// Responsabilidad: devolver usuarios paginados con filtros según el rol del caller.
// Teacher ve exclusivamente sus alumnos activos — no puede ampliar su scope
// enviando otros filtros desde el cliente.
// ---------------------------------------------------------------------------
const listUsers = async (filters, paginationOpts, currentUser) => {
  const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = paginationOpts;

  // Los teachers solo pueden ver sus propios alumnos activos.
  // Se ignoran los filtros del request para prevenir acceso a datos ajenos.
  const query = currentUser.role === ROLES.TEACHER
    ? { role: ROLES.STUDENT, assignedTeacherId: currentUser._id, isActive: true }
    : buildAdminQuery(filters);

  const mongoOptions          = toMongoOptions(page, limit, sortBy, sortOrder);
  const { docs, total }       = await userRepository.findAll(query, mongoOptions);

  return {
    users:      docs,
    pagination: buildPagination(total, Number(page), mongoOptions.limit),
  };
};

// Construye el objeto query para admin a partir de los filtros del request.
// Separado para mantener listUsers legible y evitar lógica inline.
const buildAdminQuery = (filters) => {
  const query = {};
  if (filters.role              != null) query.role              = filters.role;
  if (filters.isActive          != null) query.isActive          = filters.isActive;
  if (filters.assignedTeacherId != null) query.assignedTeacherId = filters.assignedTeacherId;
  return query;
};

// ---------------------------------------------------------------------------
// updateUser
// Responsabilidad: actualizar campos de perfil de un usuario existente.
// No gestiona cambios de contraseña ni de estado isActive — esas operaciones
// tienen métodos propios con sus reglas específicas.
// ---------------------------------------------------------------------------
const updateUser = async (id, data) => {
  const user = await userRepository.findById(id);
  if (!user) throw new NotFoundError('USER_NOT_FOUND', 'El usuario no existe');

  // El rol es inmutable tras la creación — cambios de rol implicarían side effects
  // (crear/eliminar TeacherProfile, reasignar alumnos) que están fuera del MVP.
  if (data.role !== undefined) {
    throw new UnprocessableError('ROLE_IS_IMMUTABLE', 'El rol de un usuario no puede modificarse');
  }

  // El cambio de contraseña tiene su propio endpoint en AuthService.
  // Rechazarlo aquí previene que llegue al Repository por error.
  if (data.password !== undefined) {
    throw new UnprocessableError('USE_CHANGE_PASSWORD_ENDPOINT', 'Usa el endpoint de cambio de contraseña');
  }

  if (data.email != null && data.email !== user.email) {
    if (await userRepository.existsByEmail(data.email, id)) {
      throw new ConflictError('EMAIL_ALREADY_EXISTS', `El email ${data.email} ya está registrado`);
    }
  }

  if (data.assignedTeacherId !== undefined) {
    if (user.role !== ROLES.STUDENT) {
      throw new UnprocessableError(
        'ASSIGNED_TEACHER_ONLY_FOR_STUDENTS',
        'Solo se puede asignar un profesor a usuarios con rol student',
      );
    }
    // null es válido — permite desasignar al profesor
    if (data.assignedTeacherId != null) {
      await _validateTeacherAssignment(data.assignedTeacherId);
    }
  }

  return userRepository.updateProfile(id, data);
};

// ---------------------------------------------------------------------------
// activateUser
// Responsabilidad: establecer isActive: true.
// Idempotente: si ya está activo, devuelve el documento sin modificar.
// ---------------------------------------------------------------------------
const activateUser = async (id) => {
  const user = await userRepository.findById(id);
  if (!user) throw new NotFoundError('USER_NOT_FOUND', 'El usuario no existe');

  if (user.isActive) return user;

  return userRepository.updateProfile(id, { isActive: true });
};

// ---------------------------------------------------------------------------
// deactivateUser
// Responsabilidad: establecer isActive: false con dos protecciones críticas:
//   1. Un usuario no puede desactivarse a sí mismo.
//   2. El último admin activo no puede ser desactivado.
// Idempotente: si ya está inactivo, devuelve el documento sin modificar.
//
// Limitación conocida MVP: si el usuario es teacher, sus alumnos asignados
// quedan con assignedTeacherId apuntando a un usuario inactivo. El admin
// deberá reasignarlos manualmente. No hay cascade en esta fase.
// ---------------------------------------------------------------------------
const deactivateUser = async (id, currentUserId) => {
  const user = await userRepository.findById(id);
  if (!user) throw new NotFoundError('USER_NOT_FOUND', 'El usuario no existe');

  if (id.toString() === currentUserId.toString()) {
    throw new ForbiddenError('CANNOT_DEACTIVATE_SELF', 'No puedes desactivar tu propia cuenta');
  }

  if (!user.isActive) return user;

  if (user.role === ROLES.ADMIN) {
    const activeAdminCount = await userRepository.count({ role: ROLES.ADMIN, isActive: true });
    if (activeAdminCount === 1) {
      throw new ForbiddenError(
        'LAST_ADMIN_PROTECTION',
        'No se puede desactivar el único administrador activo del sistema',
      );
    }
  }

  return userRepository.updateProfile(id, { isActive: false });
};

module.exports = {
  createUser,
  getUserById,
  listUsers,
  updateUser,
  activateUser,
  deactivateUser,
};
