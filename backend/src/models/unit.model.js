'use strict';

/**
 * models/unit.model.js
 *
 * Responsabilidad: Esquema Mongoose del documento Unit.
 *
 * Campos:
 *   courseId          ObjectId  ref: Course  requerido
 *   title             String    requerido  3-100 chars
 *   description       String    opcional   max 500 chars
 *   order             Number    requerido  entero positivo  asignado por UnitService
 *   sequentialUnlock  Boolean   default: true
 *                     true  → cada lección requiere completar la anterior
 *                     false → todas las lecciones de la unidad accesibles desde el inicio
 *
 * Índices:
 *   { courseId: 1, order: 1 }  para obtener unidades de un curso ordenadas
 *
 * El campo 'order' lo gestiona UnitService. Nunca se envía en el body del request.
 */

const { Schema, model, Types } = require('mongoose');

const unitSchema = new Schema(
  {
    courseId: {
      type:     Types.ObjectId,
      ref:      'Course',
      required: true,
    },
    title: {
      type:      String,
      required:  true,
      trim:      true,
      minlength: 3,
      maxlength: 100,
    },
    description: {
      type:      String,
      trim:      true,
      maxlength: 500,
      default:   null,
    },
    order: {
      type:     Number,
      required: true,
      min:      1,
    },
    sequentialUnlock: {
      type:    Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

unitSchema.index({ courseId: 1, order: 1 });

module.exports = model('Unit', unitSchema);
