'use strict';

const BaseRepository   = require('./base.repository');
const Availability     = require('../models/availability.model');

class AvailabilityRepository extends BaseRepository {
  constructor() {
    super(Availability);
  }

  async findByTeacher(teacherId) {
    return this.model.find({ teacher: teacherId });
  }

  async findActiveByTeacher(teacherId) {
    return this.model.find({ teacher: teacherId, isActive: true });
  }

  async findByTeacherAndDay(teacherId, dayOfWeek) {
    return this.model.find({ teacher: teacherId, dayOfWeek });
  }

  async findActiveByTeacherAndDay(teacherId, dayOfWeek) {
    return this.model.find({ teacher: teacherId, dayOfWeek, isActive: true });
  }

  async exists(teacherId, dayOfWeek, startTime, endTime) {
    return super.exists({ teacher: teacherId, dayOfWeek, startTime, endTime });
  }
}

module.exports = new AvailabilityRepository();
