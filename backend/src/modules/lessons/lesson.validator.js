'use strict';

/**
 * modules/lessons/lesson.validator.js
 *
 * createLessonSchema:
 *   - title:    requerido, 3-150 chars
 *   - type:     requerido, enum LESSON_TYPES
 *   - content:  condicional — requerido si type='text', max 50000 chars
 *   - videoUrl: condicional — requerido si type='video', URL válida
 *   - duration: requerido, entero 1-300
 *
 * updateLessonSchema: title, content, videoUrl, duration — todos opcionales
 *   (type NO está en este schema — es inmutable)
 *
 * reorderLessonsSchema: order (string[], requerido, no vacío)
 */

const { body, param } = require('express-validator');
const { LESSON_TYPES } = require('../../config/constants');

const LESSON_TYPE_VALUES = Object.values(LESSON_TYPES);

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

const unitIdParamSchema = [
  param('unitId')
    .trim()
    .isMongoId().withMessage('El unitId debe ser un ObjectId de MongoDB válido'),
];

const createLessonSchema = [
  body('title')
    .trim()
    .notEmpty().withMessage('El título es obligatorio')
    .isLength({ min: 3, max: 100 }).withMessage('El título debe tener entre 3 y 100 caracteres'),

  body('type')
    .trim()
    .notEmpty().withMessage('El tipo es obligatorio')
    .isIn(LESSON_TYPE_VALUES).withMessage(`El tipo debe ser uno de: ${LESSON_TYPE_VALUES.join(', ')}`),

  body('content')
    .optional({ nullable: true })
    .if((value) => value !== null)
    .trim()
    .isLength({ max: 50000 }).withMessage('El contenido no puede superar 50000 caracteres'),

  body('videoUrl')
    .optional({ nullable: true })
    .if((value) => value !== null)
    .trim()
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('videoUrl debe ser una URL válida (http o https)')
    .isLength({ max: 500 }).withMessage('videoUrl no puede superar 500 caracteres'),

  body('duration')
    .optional()
    .isInt({ min: 1, max: 300 }).withMessage('duration debe ser un entero entre 1 y 300')
    .toInt(),

  body('order')
    .not().exists().withMessage('El campo order es asignado automáticamente por el sistema'),
];

const updateLessonSchema = [
  body('type')
    .not().exists().withMessage('El tipo de lección es inmutable — elimina y recrea la lección para cambiarlo'),

  body('order')
    .not().exists().withMessage('El campo order es asignado automáticamente por el sistema'),

  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('El título no puede estar vacío')
    .isLength({ min: 3, max: 100 }).withMessage('El título debe tener entre 3 y 100 caracteres'),

  body('content')
    .optional({ nullable: true })
    .if((value) => value !== null)
    .trim()
    .isLength({ max: 50000 }).withMessage('El contenido no puede superar 50000 caracteres'),

  body('videoUrl')
    .optional({ nullable: true })
    .if((value) => value !== null)
    .trim()
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('videoUrl debe ser una URL válida (http o https)')
    .isLength({ max: 500 }).withMessage('videoUrl no puede superar 500 caracteres'),

  body('duration')
    .optional()
    .isInt({ min: 1, max: 300 }).withMessage('duration debe ser un entero entre 1 y 300')
    .toInt(),
];

const reorderLessonsSchema = [
  body('orderedIds')
    .isArray({ min: 1 }).withMessage('orderedIds debe ser un array no vacío')
    .custom((ids) => ids.every((id) => /^[a-f\d]{24}$/i.test(id)))
    .withMessage('Todos los elementos de orderedIds deben ser ObjectIds válidos'),
];

module.exports = {
  idParamSchema,
  courseIdParamSchema,
  unitIdParamSchema,
  createLessonSchema,
  updateLessonSchema,
  reorderLessonsSchema,
};
