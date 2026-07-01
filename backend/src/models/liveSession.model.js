const mongoose = require('mongoose');

const liveSessionSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      unique: true,
    },
    roomId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      maxlength: 100,
    },
    provider: {
      type: String,
      enum: ['JITSI', 'GOOGLE_MEET', 'ZOOM'],
      default: 'JITSI',
    },
    joinUrl: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['SCHEDULED', 'ACTIVE', 'FINISHED'],
      default: 'SCHEDULED',
    },
    startedAt: {
      type: Date,
      default: null,
    },
    endedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

liveSessionSchema.index({ booking: 1 }, { unique: true });
liveSessionSchema.index({ roomId: 1 }, { unique: true });
liveSessionSchema.index({ status: 1 });

module.exports = mongoose.model('LiveSession', liveSessionSchema);
