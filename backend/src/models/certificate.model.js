'use strict';

/**
 * models/certificate.model.js
 *
 * Responsabilidad: Esquema Mongoose del documento Certificate.
 * Existe máximo UNO por combinación student + course.
 *
 * Campos:
 *   student            ObjectId  ref: User    requerido
 *   course             ObjectId  ref: Course  requerido
 *   issueDate          Date      default: Date.now
 *   certificateNumber  String    requerido  único
 *   finalScore         Number    requerido  0-100
 *   pdfUrl             String    default: null
 *
 * Índices:
 *   { student: 1, course: 1 }  unique
 *   { certificateNumber: 1 }   unique  (implícito por campo)
 */

const { Schema, model, Types } = require('mongoose');

const certificateSchema = new Schema(
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
    issueDate: {
      type:    Date,
      default: Date.now,
    },
    certificateNumber: {
      type:     String,
      required: true,
      unique:   true,
      trim:     true,
    },
    finalScore: {
      type:     Number,
      required: true,
      min:      0,
      max:      100,
    },
    pdfUrl: {
      type:    String,
      default: null,
    },
  },
  { timestamps: true }
);

certificateSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = model('Certificate', certificateSchema);
