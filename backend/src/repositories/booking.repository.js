'use strict';

const BaseRepository = require('./base.repository');
const Booking        = require('../models/booking.model');

class BookingRepository extends BaseRepository {
  constructor() {
    super(Booking);
  }

  async findByStudent(studentId) {
    return this.model.find({ student: studentId });
  }

  async findByTeacher(teacherId) {
    return this.model.find({ teacher: teacherId });
  }

  async findByTeacherAndDate(teacherId, bookingDate) {
    return this.model.find({ teacher: teacherId, bookingDate });
  }

  async updateStatus(id, status) {
    return this.model.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true, runValidators: true },
    );
  }

  async exists(studentId, teacherId, bookingDate, startTime, endTime) {
    return super.exists({ student: studentId, teacher: teacherId, bookingDate, startTime, endTime });
  }
}

module.exports = new BookingRepository();
