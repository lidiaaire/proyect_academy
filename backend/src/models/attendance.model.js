const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    liveSession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LiveSession',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['PRESENT', 'ABSENT', 'LATE'],
      required: true,
      default: 'ABSENT',
    },
    joinedAt: {
      type: Date,
      default: null,
    },
    leftAt: {
      type: Date,
      default: null,
    },
    durationMinutes: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

attendanceSchema.index({ liveSession: 1 });
attendanceSchema.index({ student: 1 });
attendanceSchema.index({ liveSession: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
