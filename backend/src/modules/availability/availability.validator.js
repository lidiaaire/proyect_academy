'use strict';

// modules/availability/availability.validator.js
//
// createAvailabilitySchema (POST /api/availability):
//   - dayOfWeek: requerido, entero 0-6 (coincide con el enum del modelo)
//   - startTime: requerido, 'HH:mm'
//   - endTime:   requerido, 'HH:mm'
//   (el orden startTime < endTime se valida en el service, no aquí)

const { body } = require('express-validator');

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

const createAvailabilitySchema = [
  body('dayOfWeek')
    .exists().withMessage('dayOfWeek es obligatorio')
    .bail()
    .isInt({ min: 0, max: 6 }).withMessage('dayOfWeek debe ser un entero entre 0 y 6')
    .toInt(),

  body('startTime')
    .exists().withMessage('startTime es obligatorio')
    .bail()
    .matches(TIME_REGEX).withMessage('startTime debe tener formato HH:mm'),

  body('endTime')
    .exists().withMessage('endTime es obligatorio')
    .bail()
    .matches(TIME_REGEX).withMessage('endTime debe tener formato HH:mm'),
];

module.exports = { createAvailabilitySchema };
