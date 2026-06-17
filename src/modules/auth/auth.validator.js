'use strict';

const { body } = require('express-validator');

const loginSchema = [
  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('El formato del email no es válido')
    .normalizeEmail({ gmail_remove_dots: false }),

  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria'),
];

const changePasswordSchema = [
  body('currentPassword')
    .notEmpty().withMessage('La contraseña actual es obligatoria'),

  body('newPassword')
    .notEmpty().withMessage('La nueva contraseña es obligatoria')
    .isLength({ min: 8 }).withMessage('La nueva contraseña debe tener al menos 8 caracteres')
    .isLength({ max: 72 }).withMessage('La nueva contraseña no puede superar 72 caracteres')
    .matches(/[A-Z]/).withMessage('La nueva contraseña debe contener al menos una mayúscula')
    .matches(/[0-9]/).withMessage('La nueva contraseña debe contener al menos un número'),

  body('confirmPassword')
    .notEmpty().withMessage('La confirmación de contraseña es obligatoria')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Las contraseñas no coinciden');
      }
      return true;
    }),
];

module.exports = { loginSchema, changePasswordSchema };
