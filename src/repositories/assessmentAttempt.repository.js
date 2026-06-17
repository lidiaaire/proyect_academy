'use strict';

/**
 * repositories/assessmentAttempt.repository.js
 *
 * Responsabilidad: Acceso a datos para la entidad AssessmentAttempt.
 * Solo lectura y creación — nunca update ni delete.
 *
 * Métodos adicionales:
 *
 *   findByStudentAndAssessment(studentId, assessmentId, options?)
 *     → Lista de intentos del student para ese assessment
 *     → Ordenados por attemptNumber ASC
 *
 *   countAttempts(studentId, assessmentId)
 *     → Number — total de intentos realizados
 *     → Usado antes de crear un nuevo intento para verificar el límite
 *
 *   findBestScore(studentId, assessmentId)
 *     → { score, passed } del intento con mayor score
 *     → Devuelve null si no hay intentos
 */

const BaseRepository    = require('./base.repository');
const AssessmentAttempt = require('../models/assessmentAttempt.model');

class AssessmentAttemptRepository extends BaseRepository {
  constructor() {
    super(AssessmentAttempt);
  }

  async findByStudentAndAssessment(studentId, assessmentId) {
    return this.model
      .find({ studentId, assessmentId })
      .sort({ attemptNumber: 1 });
  }

  async countAttempts(studentId, assessmentId) {
    return this.model.countDocuments({ studentId, assessmentId });
  }

  async deleteAllByAssessment(assessmentId) {
    return this.model.deleteMany({ assessmentId });
  }

  async findBestScore(studentId, assessmentId) {
    const best = await this.model
      .findOne({ studentId, assessmentId })
      .sort({ score: -1 })
      .select('score passed');
    return best ? { score: best.score, passed: best.passed } : null;
  }
}

module.exports = new AssessmentAttemptRepository();
