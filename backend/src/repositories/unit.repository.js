'use strict';

/**
 * repositories/unit.repository.js
 *
 * Responsabilidad: Acceso a datos para la entidad Unit.
 *
 * Métodos adicionales:
 *
 *   findByCourseId(courseId, options?)
 *     → Unidades del curso ordenadas por order ASC
 *
 *   getMaxOrder(courseId)
 *     → Number — order más alto existente en el curso (para calcular el siguiente)
 *
 *   reorder(courseId, orderedIds)
 *     → Actualiza order de todas las unidades en una sola operación bulk
 *     → orderedIds: string[] con todos los unitId en el nuevo orden
 *     → Usa bulkWrite para atomicidad
 */

const BaseRepository = require('./base.repository');
const Unit           = require('../models/unit.model');

class UnitRepository extends BaseRepository {
  constructor() {
    super(Unit);
  }

  async findByCourseId(courseId, options = {}) {
    const skip  = options.skip  ?? 0;
    const limit = options.limit ?? 100;
    const docs  = await this.model
      .find({ courseId })
      .sort({ order: 1 })
      .skip(skip)
      .limit(limit);
    const total = await this.model.countDocuments({ courseId });
    return { docs, total };
  }

  async getMaxOrder(courseId) {
    const unit = await this.model
      .findOne({ courseId })
      .sort({ order: -1 })
      .select('order');
    return unit ? unit.order : 0;
  }

  async reorder(courseId, orderedIds) {
    const ops = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id, courseId },
        update: { $set: { order: index + 1 } },
      },
    }));
    return this.model.bulkWrite(ops);
  }

  async deleteAllByCourse(courseId) {
    return this.model.deleteMany({ courseId });
  }
}

module.exports = new UnitRepository();
