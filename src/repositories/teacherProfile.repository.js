'use strict';

/**
 * repositories/teacherProfile.repository.js
 *
 * Responsabilidad: Acceso a datos para la entidad TeacherProfile.
 *
 * Métodos adicionales:
 *
 *   findByUserId(userId)
 *     → TeacherProfile del usuario o null
 *     → Usado por AvailabilityService y UserService
 *
 *   replaceAvailability(userId, slots)
 *     → Reemplaza availability[] completo en una sola operación atómica
 *     → Usado por AvailabilityService.replaceAvailabilityTemplate
 */

// TODO: Implementar en Phase 2

const BaseRepository = require('./base.repository');
const TeacherProfile = require('../models/teacherProfile.model');

class TeacherProfileRepository extends BaseRepository {
  constructor() {
    super(TeacherProfile);
  }
}

module.exports = new TeacherProfileRepository();
