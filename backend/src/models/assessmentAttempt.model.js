'use strict';

/**
 * models/assessmentAttempt.model.js
 *
 * Responsabilidad: Esquema Mongoose del documento AssessmentAttempt.
 * Registra un intento de evaluación de un Student.
 *
 * Los documentos son ESTRICTAMENTE INMUTABLES una vez creados.
 * No existe operación Update ni Delete para ningún rol.
 *
 * Campos:
 *   assessmentId   ObjectId  ref: Assessment  requerido
 *   studentId      ObjectId  ref: User        requerido
 *   attemptNumber  Number    requerido        calculado por AssessmentService (count previo + 1)
 *   answers        Array de Answer (embebido)
 *     - questionId  ObjectId  requerido
 *     - selected    String    requerido    opción elegida por el student
 *     - isCorrect   Boolean   requerido    calculado en servidor
 *   score          Number    requerido    0-100 calculado en servidor  NUNCA enviado por el cliente
 *   passed         Boolean   requerido    score >= Assessment.passingScore
 *   submittedAt    Date      default: Date.now
 *
 * Índices:
 *   { assessmentId: 1, studentId: 1 }  — para contar intentos y buscar el mejor score
 *   { studentId: 1 }                   — para el historial del student
 *
 * CRÍTICO: score y passed se calculan SIEMPRE en el servidor (AssessmentService.submitAttempt).
 * El cliente NUNCA puede enviar estos campos.
 */

const { Schema, model, Types } = require('mongoose');

const answerSchema = new Schema(
  {
    questionId: {
      type:     Types.ObjectId,
      required: true,
    },
    selected: {
      type:     Number,
      required: true,
    },
    isCorrect: {
      type:     Boolean,
      required: true,
    },
  },
  { _id: false }
);

const assessmentAttemptSchema = new Schema(
  {
    assessmentId: {
      type:     Types.ObjectId,
      ref:      'Assessment',
      required: true,
    },
    studentId: {
      type:     Types.ObjectId,
      ref:      'User',
      required: true,
    },
    attemptNumber: {
      type:     Number,
      required: true,
      min:      1,
    },
    answers: {
      type:     [answerSchema],
      required: true,
      validate: (v) => v.length >= 1,
    },
    score: {
      type:     Number,
      required: true,
      min:      0,
      max:      100,
    },
    passed: {
      type:     Boolean,
      required: true,
    },
    submittedAt: {
      type:      Date,
      default:   Date.now,
      immutable: true,
    },
  },
  { timestamps: false }
);

assessmentAttemptSchema.index({ assessmentId: 1, studentId: 1 });
assessmentAttemptSchema.index({ studentId: 1 });
assessmentAttemptSchema.index({ studentId: 1, submittedAt: 1 });

module.exports = model('AssessmentAttempt', assessmentAttemptSchema);
