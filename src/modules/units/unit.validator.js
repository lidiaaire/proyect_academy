'use strict';

/**
 * modules/units/unit.validator.js
 *
 * createUnitSchema: title (3-100), description (max 500, opcional), sequentialUnlock (bool, opcional)
 * updateUnitSchema: todos opcionales, al menos uno
 * reorderUnitsSchema: order (string[], requerido, no vacío)
 */

const { body, param } = require('express-validator');

const idParamSchema = [
  param('id')
    .trim()
    .isMongoId().withMessage('El id debe ser un ObjectId de MongoDB válido'),
];

const courseIdParamSchema = [
  param('courseId')
    .trim()
    .isMongoId().withMessage('El courseId debe ser un ObjectId de MongoDB válido'),
];

const createUnitSchema = [
  body('title')
    .trim()
    .notEmpty().withMessage('El título es obligatorio')
    .isLength({ min: 3, max: 100 }).withMessage('El título debe tener entre 3 y 100 caracteres'),

  body('description')
    .optional({ nullable: true })
    .if((value) => value !== null)
    .trim()
    .isLength({ max: 500 }).withMessage('La descripción no puede superar 500 caracteres'),

  body('sequentialUnlock')
    .optional()
    .isBoolean().withMessage('sequentialUnlock debe ser un booleano')
    .toBoolean(),

  body('order')
    .not().exists()
    .withMessage('El campo order es asignado automáticamente por el sistema'),
];

const updateUnitSchema = [
  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('El título no puede estar vacío')
    .isLength({ min: 3, max: 100 }).withMessage('El título debe tener entre 3 y 100 caracteres'),

  body('description')
    .optional({ nullable: true })
    .if((value) => value !== null)
    .trim()
    .isLength({ max: 500 }).withMessage('La descripción no puede superar 500 caracteres'),

  body('sequentialUnlock')
    .optional()
    .isBoolean().withMessage('sequentialUnlock debe ser un booleano')
    .toBoolean(),

  body('order')
    .not().exists()
    .withMessage('El campo order es asignado automáticamente por el sistema'),
];

const reorderUnitsSchema = [
  body('orderedIds')
    .isArray({ min: 1 }).withMessage('orderedIds debe ser un array no vacío')
    .custom((ids) => ids.every((id) => /^[a-f\d]{24}$/i.test(id)))
    .withMessage('Todos los elementos de orderedIds deben ser ObjectIds válidos'),
];

module.exports = { idParamSchema, courseIdParamSchema, createUnitSchema, updateUnitSchema, reorderUnitsSchema };
