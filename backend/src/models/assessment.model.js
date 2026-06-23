'use strict';

/**
 * models/assessment.model.js
 *
 * Responsabilidad: Esquema Mongoose del documento Assessment.
 * Existe máximo UNO por unidad.
 *
 * Campos:
 *   unitId        ObjectId  ref: Unit  requerido  único
 *   courseId      ObjectId  ref: Course  requerido  (denormalizado)
 *   maxAttempts   Number    requerido  default: 3  mínimo: 1
 *   passingScore  Number    requerido  0-100  porcentaje mínimo para pasar
 *   questions     Array de Question (embebido)
 *     - _id          ObjectId  auto
 *     - text         String    requerido
 *     - options      String[]  requerido  min 2 opciones
 *     - correctIndex Number    requerido  select: false  (NUNCA expuesto a Student/Teacher)
 *     - points       Number    requerido  default: 1  min: 1  peso de la pregunta en el score total
 *
 * Índices:
 *   { unitId: 1 }  unique  — garantiza 1 assessment por unidad
 *
 * CRÍTICO: correctAnswer tiene select: false. El servicio lo selecciona
 * explícitamente SOLO para calcular score en submitAttempt.
 */

const { Schema, model, Types } = require('mongoose');

const questionSchema = new Schema(
  {
    text: {
      type:      String,
      required:  true,
      trim:      true,
      maxlength: 500,
    },
    options: {
      type:     [String],
      required: true,
      validate: (v) => v.length >= 2 && v.length <= 4,
    },
    correctIndex: {
      type:     Number,
      required: true,
      select:   false,
    },
    points: {
      type:    Number,
      default: 1,
      min:     1,
    },
  },
  { _id: true }
);

const assessmentSchema = new Schema(
  {
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
    questions: {
      type:     [questionSchema],
      required: true,
      validate: (v) => v.length >= 1,
    },
    passingScore: {
      type:    Number,
      required: true,
      min:     1,
      max:     100,
      default: 70,
    },
    maxAttempts: {
      type:     Number,
      required: true,
      min:      1,
      default:  3,
    },
  },
  { timestamps: true }
);

assessmentSchema.index({ unitId: 1 }, { unique: true });
assessmentSchema.index({ courseId: 1 });

module.exports = model('Assessment', assessmentSchema);
