'use strict';

// modules/enrollments/enrollment.validator.js
// createEnrollmentSchema: studentId (ObjectId), courseId (ObjectId) — ambos requeridos
// updateStatusSchema: status (enum ENROLLMENT_STATUS, requerido)

const { body, param } = require('express-validator');
const { ENROLLMENT_STATUS } = require('../../config/constants');

const ALLOWED_STATUSES = [ENROLLMENT_STATUS.ACTIVE, ENROLLMENT_STATUS.SUSPENDED];

const idParamSchema = [
  param('id')
    .trim()
    .isMongoId().withMessage('El id debe ser un ObjectId de MongoDB válido'),
];

const createEnrollmentSchema = [
  body('studentId')
    .trim()
    .notEmpty().withMessage('studentId es obligatorio')
    .isMongoId().withMessage('studentId debe ser un ObjectId de MongoDB válido'),

  body('courseId')
    .trim()
    .notEmpty().withMessage('courseId es obligatorio')
    .isMongoId().withMessage('courseId debe ser un ObjectId de MongoDB válido'),
];

const updateStatusSchema = [
  body('status')
    .trim()
    .notEmpty().withMessage('El estado es obligatorio')
    .isIn(ALLOWED_STATUSES)
    .withMessage(`El estado debe ser uno de: ${ALLOWED_STATUSES.join(', ')} (completed lo asigna el sistema)`),
];

module.exports = { idParamSchema, createEnrollmentSchema, updateStatusSchema };
