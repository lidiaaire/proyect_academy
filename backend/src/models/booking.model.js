'use strict';

const mongoose = require('mongoose');

const BOOKING_STATUS = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];

const bookingSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    bookingDate: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):[0-5]\d$/,
    },
    endTime: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):[0-5]\d$/,
    },
    status: {
      type: String,
      enum: BOOKING_STATUS,
      default: 'PENDING',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

bookingSchema.index(
  { teacher: 1, bookingDate: 1, startTime: 1, endTime: 1 },
  { name: 'idx_teacher_date_time' }
);

module.exports = mongoose.model('Booking', bookingSchema);
