'use strict';

/**
 * models/recommendation.model.js
 *
 * Responsabilidad: Esquema Mongoose del documento Recommendation.
 * Existe máximo UNO por combinación student + course.
 *
 * Campos:
 *   student                   ObjectId  ref: User    requerido
 *   course                    ObjectId  ref: Course  requerido
 *   reason                    String    requerido    trim  maxlength: 300
 *   priority                  Enum      LOW | MEDIUM | HIGH  default: MEDIUM
 *   status                    Enum      PENDING | ACCEPTED | DISMISSED  default: PENDING
 *   createdAtRecommendation   Date      default: Date.now
 *
 * Índices:
 *   { student: 1, course: 1 }  unique
 */

const { Schema, model, Types } = require('mongoose');

const PRIORITY = Object.freeze({
  LOW:    'LOW',
  MEDIUM: 'MEDIUM',
  HIGH:   'HIGH',
});

const STATUS = Object.freeze({
  PENDING:   'PENDING',
  ACCEPTED:  'ACCEPTED',
  DISMISSED: 'DISMISSED',
});

const recommendationSchema = new Schema(
  {
    student: {
      type:     Types.ObjectId,
      ref:      'User',
      required: true,
    },
    course: {
      type:     Types.ObjectId,
      ref:      'Course',
      required: true,
    },
    reason: {
      type:      String,
      required:  true,
      trim:      true,
      maxlength: 300,
    },
    priority: {
      type:    String,
      enum:    Object.values(PRIORITY),
      default: PRIORITY.MEDIUM,
    },
    status: {
      type:    String,
      enum:    Object.values(STATUS),
      default: STATUS.PENDING,
    },
    createdAtRecommendation: {
      type:    Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

recommendationSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = model('Recommendation', recommendationSchema);
module.exports.PRIORITY = PRIORITY;
module.exports.STATUS   = STATUS;
