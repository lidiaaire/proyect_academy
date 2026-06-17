'use strict';

/**
 * repositories/lessonProgress.repository.js
 *
 * Responsabilidad: Acceso a datos para la entidad LessonProgress.
 *
 * Métodos adicionales:
 *
 *   bulkCreate(docs)
 *     → insertMany de N documentos en una sola operación
 *     → Llamado por ProgressService.initializeProgress al crear una Enrollment
 *     → NUNCA se llama individualmente — siempre en bloque
 *
 *   findByEnrollment(enrollmentId)
 *     → Todos los LessonProgress de una matrícula
 *     → Usado por ProgressService.getCourseProgress para calcular métricas
 *
 *   findByStudentAndLesson(studentId, lessonId)
 *     → Un documento específico o null
 *     → Usado por ProgressService.completeLesson
 *
 *   findByStudentAndCourse(studentId, courseId)
 *     → Todos los docs de un student en un curso (via courseId denormalizado)
 *     → Alternativa eficiente a findByEnrollment cuando no se tiene enrollmentId
 *
 *   countCompleted(enrollmentId)
 *     → Number — lecciones completadas en una matrícula
 */

const BaseRepository = require('./base.repository');
const LessonProgress = require('../models/lessonProgress.model');
const { PROGRESS_STATUS } = require('../config/constants');

class LessonProgressRepository extends BaseRepository {
  constructor() {
    super(LessonProgress);
  }

  async bulkCreate(docs) {
    return this.model.insertMany(docs, { ordered: false });
  }

  async findByEnrollment(enrollmentId) {
    return this.model.find({ enrollmentId });
  }

  async findByStudentAndLesson(studentId, lessonId) {
    return this.model.findOne({ studentId, lessonId });
  }

  async findByStudentAndCourse(studentId, courseId) {
    return this.model.find({ studentId, courseId });
  }

  async countCompleted(enrollmentId) {
    return this.model.countDocuments({ enrollmentId, status: PROGRESS_STATUS.COMPLETED });
  }

  async deleteAllByLesson(lessonId) {
    return this.model.deleteMany({ lessonId });
  }

  async markCompleted(studentId, lessonId) {
    return this.model.findOneAndUpdate(
      { studentId, lessonId, status: PROGRESS_STATUS.NOT_STARTED },
      { $set: { status: PROGRESS_STATUS.COMPLETED, completedAt: new Date() } },
      { new: true }
    );
  }
}

module.exports = new LessonProgressRepository();
