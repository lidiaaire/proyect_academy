'use strict';

/**
 * repositories/assessment.repository.js
 *
 * Responsabilidad: Acceso a datos para la entidad Assessment.
 *
 * Métodos adicionales:
 *
 *   findByUnitId(unitId, includeCorrectAnswers?)
 *     → Assessment de la unidad o null
 *     → includeCorrectAnswers=false por defecto (para Student/Teacher)
 *     → includeCorrectAnswers=true solo cuando AssessmentService.submitAttempt
 *       necesita corregir las respuestas
 */

const BaseRepository = require('./base.repository');
const Assessment     = require('../models/assessment.model');

class AssessmentRepository extends BaseRepository {
  constructor() {
    super(Assessment);
  }

  async findByUnitId(unitId, includeCorrectAnswers = false) {
    const query = this.model.findOne({ unitId });
    if (includeCorrectAnswers) {
      query.select('+questions.correctIndex');
    }
    return query;
  }

  async deleteByUnitId(unitId) {
    return this.model.deleteOne({ unitId });
  }
}

module.exports = new AssessmentRepository();
