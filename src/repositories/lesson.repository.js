'use strict';

/**
 * repositories/lesson.repository.js
 *
 * Responsabilidad: Acceso a datos para la entidad Lesson.
 *
 * Métodos adicionales:
 *
 *   findByUnitId(unitId, options?)
 *     → Lecciones de la unidad ordenadas por order ASC
 *     → Sin content ni videoUrl (proyección reducida para listados)
 *
 *   findByUnitIdWithContent(unitId)
 *     → Lecciones con content y videoUrl incluidos
 *
 *   findByCourseId(courseId)
 *     → Todas las lecciones del curso (usado en initializeProgress al matricular)
 *     → Solo proyecta _id, unitId, order
 *
 *   getMaxOrder(unitId)
 *     → Number — order más alto en la unidad
 *
 *   reorder(unitId, orderedIds)
 *     → Actualiza order de todas las lecciones via bulkWrite
 */

const BaseRepository = require('./base.repository');
const Lesson         = require('../models/lesson.model');

class LessonRepository extends BaseRepository {
  constructor() {
    super(Lesson);
  }

  async findByUnitId(unitId, options = {}) {
    const skip  = options.skip  ?? 0;
    const limit = options.limit ?? 100;
    const docs  = await this.model
      .find({ unitId }, { content: 0, videoUrl: 0 })
      .sort({ order: 1 })
      .skip(skip)
      .limit(limit);
    const total = await this.model.countDocuments({ unitId });
    return { docs, total };
  }

  async findByUnitIdWithContent(unitId) {
    return this.model.find({ unitId }).sort({ order: 1 });
  }

  async findByCourseId(courseId) {
    return this.model
      .find({ courseId }, { _id: 1, unitId: 1, order: 1 })
      .sort({ order: 1 });
  }

  async getMaxOrder(unitId) {
    const lesson = await this.model
      .findOne({ unitId })
      .sort({ order: -1 })
      .select('order');
    return lesson ? lesson.order : 0;
  }

  async reorder(unitId, orderedIds) {
    const ops = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id, unitId },
        update: { $set: { order: index + 1 } },
      },
    }));
    return this.model.bulkWrite(ops);
  }

  async deleteAllByUnit(unitId) {
    return this.model.deleteMany({ unitId });
  }

  async deleteAllByCourse(courseId) {
    return this.model.deleteMany({ courseId });
  }
}

module.exports = new LessonRepository();
