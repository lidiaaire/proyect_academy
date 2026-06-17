'use strict';

/**
 * models/lesson.model.js
 *
 * Responsabilidad: Esquema Mongoose del documento Lesson.
 *
 * Campos:
 *   unitId     ObjectId  ref: Unit    requerido
 *   courseId   ObjectId  ref: Course  requerido  (denormalizado para queries eficientes)
 *   title      String    requerido  3-150 chars
 *   type       String    requerido  enum: LESSON_TYPES ('video' | 'text')  inmutable tras creación
 *   content    String    condicional  requerido si type='text'  max 50000 chars
 *   videoUrl   String    condicional  requerido si type='video'  URL válida
 *   duration   Number    requerido  minutos  1-300
 *   order      Number    requerido  entero positivo  asignado por LessonService
 *
 * Índices:
 *   { unitId: 1, order: 1 }    para obtener lecciones de una unidad ordenadas
 *   { courseId: 1 }            para obtener todas las lecciones de un curso (usado en enrollment)
 *
 * Nota: 'type' es inmutable. Para cambiarlo hay que eliminar y recrear la lección.
 */

const { Schema, model, Types } = require('mongoose');
const { LESSON_TYPES } = require('../config/constants');

const lessonSchema = new Schema(
  {
    unitId: {
      type:      Types.ObjectId,
      ref:       'Unit',
      required:  true,
    },
    courseId: {
      type:      Types.ObjectId,
      ref:       'Course',
      required:  true,
    },
    title: {
      type:      String,
      required:  true,
      trim:      true,
      minlength: 3,
      maxlength: 100,
    },
    type: {
      type:      String,
      required:  true,
      enum:      Object.values(LESSON_TYPES),
      immutable: true,
    },
    content: {
      type:    String,
      maxlength: 50000,
      default: null,
    },
    videoUrl: {
      type:    String,
      maxlength: 500,
      default: null,
    },
    duration: {
      type:    Number,
      min:     1,
      max:     300,
      default: null,
    },
    order: {
      type:     Number,
      required: true,
      min:      1,
    },
  },
  { timestamps: true }
);

lessonSchema.index({ unitId: 1, order: 1 });
lessonSchema.index({ courseId: 1 });

module.exports = model('Lesson', lessonSchema);
