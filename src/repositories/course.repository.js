'use strict';

/**
 * repositories/course.repository.js
 *
 * Responsabilidad: Acceso a datos para la entidad Course.
 *
 * Métodos adicionales:
 *
 *   findPublished(options?)
 *     → Cursos con status='published' paginados
 *     → Usado por CourseService para Teacher y Student
 *
 *   findByStatus(status, options?)
 *     → Cursos filtrados por status (admin)
 */

const BaseRepository = require('./base.repository');
const Course         = require('../models/course.model');
const { COURSE_STATUS } = require('../config/constants');

class CourseRepository extends BaseRepository {
  constructor() {
    super(Course);
  }

  async findPublished(options = {}) {
    return super.findAll({ status: COURSE_STATUS.PUBLISHED }, options);
  }

  async findByStatus(status, options = {}) {
    return super.findAll({ status }, options);
  }

  async findAll(filters = {}, options = {}) {
    const query = {};
    if (filters.status !== undefined) query.status = filters.status;
    if (filters.level  !== undefined) query.level  = filters.level;
    return super.findAll(query, options);
  }

  async existsByTitle(title, excludeId = null) {
    const filter = { title: { $regex: new RegExp(`^${title}$`, 'i') } };
    if (excludeId) filter._id = { $ne: excludeId };
    return (await this.model.exists(filter)) !== null;
  }
}

module.exports = new CourseRepository();
