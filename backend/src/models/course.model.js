'use strict';

/**
 * models/course.model.js
 *
 * Responsabilidad: Esquema Mongoose del documento Course.
 *
 * Campos:
 *   title        String   requerido  3-100 chars  único
 *   description  String   requerido  10-2000 chars
 *   level        String   requerido  enum: CEFR_LEVELS (A1-C2)
 *   status       String   requerido  enum: COURSE_STATUS  default: 'draft'
 *   coverImage   String   opcional   URL
 *
 * Índices:
 *   { title: 1 }   unique
 *   { status: 1 }  para filtrar por estado eficientemente
 *
 * Transiciones de estado válidas (validadas en CourseService, no aquí):
 *   draft → published  (requiere ≥1 unidad con ≥1 lección)
 *   published → archived
 *   Ninguna otra transición es válida
 */

const { Schema, model } = require('mongoose');
const { COURSE_STATUS, CEFR_LEVELS } = require('../config/constants');

const courseSchema = new Schema(
  {
    title: {
      type:      String,
      required:  true,
      unique:    true,
      trim:      true,
      minlength: 3,
      maxlength: 100,
    },
    description: {
      type:      String,
      required:  true,
      trim:      true,
      minlength: 10,
      maxlength: 2000,
    },
    level: {
      type:     String,
      required: true,
      enum:     Object.values(CEFR_LEVELS),
    },
    status: {
      type:    String,
      enum:    Object.values(COURSE_STATUS),
      default: COURSE_STATUS.DRAFT,
    },
    coverImageUrl: {
      type:    String,
      default: null,
    },
  },
  { timestamps: true }
);

courseSchema.index({ status: 1 });
courseSchema.index({ level: 1 });

module.exports = model('Course', courseSchema);
