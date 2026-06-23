'use strict';

/**
 * models/lessonProgress.model.js
 *
 * Responsabilidad: Esquema Mongoose del documento LessonProgress.
 * Registra el estado de completado de UNA lección para UN student.
 *
 * Los documentos se crean automáticamente en bloque (insertMany) al crear
 * una Enrollment. NINGÚN actor los crea manualmente.
 *
 * Campos:
 *   enrollmentId  ObjectId  ref: Enrollment  requerido
 *   studentId     ObjectId  ref: User        requerido  (denormalizado para queries directas)
 *   lessonId      ObjectId  ref: Lesson      requerido
 *   unitId        ObjectId  ref: Unit        requerido  (denormalizado)
 *   courseId      ObjectId  ref: Course      requerido  (denormalizado)
 *   status        String    default: 'not_started'  enum: PROGRESS_STATUS
 *   completedAt   Date      null hasta que status cambie a 'completed'
 *
 * Índices:
 *   { enrollmentId: 1, lessonId: 1 }  unique  — un registro por lección por matrícula
 *   { studentId: 1, courseId: 1 }     — para calcular progreso de un student en un curso
 *   { studentId: 1, lessonId: 1 }     — para verificar si una lección está completada
 *
 * Invariantes:
 *   - status solo puede ir de 'not_started' a 'completed', NUNCA al revés
 *   - completedAt es inmutable una vez establecido
 *   - Los documentos NUNCA se eliminan (historial permanente)
 */

const { Schema, model, Types } = require('mongoose');
const { PROGRESS_STATUS } = require('../config/constants');

const lessonProgressSchema = new Schema(
  {
    enrollmentId: {
      type:     Types.ObjectId,
      ref:      'Enrollment',
      required: true,
    },
    studentId: {
      type:     Types.ObjectId,
      ref:      'User',
      required: true,
    },
    lessonId: {
      type:     Types.ObjectId,
      ref:      'Lesson',
      required: true,
    },
    unitId: {
      type:     Types.ObjectId,
      ref:      'Unit',
      required: true,
    },
    courseId: {
      type:     Types.ObjectId,
      ref:      'Course',
      required: true,
    },
    status: {
      type:    String,
      enum:    Object.values(PROGRESS_STATUS),
      default: PROGRESS_STATUS.NOT_STARTED,
    },
    completedAt: {
      type:    Date,
      default: null,
    },
  },
  { timestamps: true }
);

lessonProgressSchema.index({ enrollmentId: 1, lessonId: 1 }, { unique: true });
lessonProgressSchema.index({ studentId: 1, courseId: 1 });
lessonProgressSchema.index({ studentId: 1, lessonId: 1 });
lessonProgressSchema.index({ studentId: 1, completedAt: 1 });
lessonProgressSchema.index({ completedAt: 1 });

module.exports = model('LessonProgress', lessonProgressSchema);
