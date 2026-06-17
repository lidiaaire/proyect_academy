'use strict';

/**
 * models/enrollment.model.js
 *
 * Responsabilidad: Esquema Mongoose del documento Enrollment.
 * Registra la matrícula de un Student en un Course.
 * Las matrículas son PERMANENTES — nunca se eliminan.
 *
 * Campos:
 *   studentId   ObjectId  ref: User    requerido
 *   courseId    ObjectId  ref: Course  requerido
 *   status      String    requerido    enum: ENROLLMENT_STATUS  default: 'active'
 *   enrolledAt  Date      default: Date.now
 *
 * Índices:
 *   { studentId: 1, courseId: 1 }  unique  — impide matrícula duplicada
 *   { studentId: 1 }               — para obtener cursos de un student
 *   { courseId: 1 }                — para obtener students de un curso
 *
 * Al crear una Enrollment, EnrollmentService dispara la creación de
 * todos los documentos LessonProgress correspondientes (via ProgressService).
 */

const { Schema, model, Types } = require('mongoose');
const { ENROLLMENT_STATUS } = require('../config/constants');

const enrollmentSchema = new Schema(
  {
    studentId: {
      type:     Types.ObjectId,
      ref:      'User',
      required: true,
    },
    courseId: {
      type:     Types.ObjectId,
      ref:      'Course',
      required: true,
    },
    status: {
      type:    String,
      enum:    Object.values(ENROLLMENT_STATUS),
      default: ENROLLMENT_STATUS.ACTIVE,
    },
    enrolledAt: {
      type:      Date,
      default:   Date.now,
      immutable: true,
    },
  },
  { timestamps: true }
);

enrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });
enrollmentSchema.index({ studentId: 1 });
enrollmentSchema.index({ courseId: 1 });

module.exports = model('Enrollment', enrollmentSchema);
