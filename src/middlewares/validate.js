'use strict';

const { validationResult } = require('express-validator');
const { ValidationError }  = require('../utils/ApiError');

// Recibe un array de express-validator chains y devuelve un array de middlewares:
// [...chains, errorCollector]. Express los ejecuta en orden dentro del router.
const validate = (schema) => [
  ...schema,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const fields = errors.array().map((e) => ({ field: e.path, message: e.msg }));
      return next(new ValidationError('VALIDATION_ERROR', 'Datos de entrada inválidos', fields));
    }
    next();
  },
];

module.exports = validate;
