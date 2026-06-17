'use strict';

/**
 * modules/courses/course.validator.js
 *
 * createCourseSchema: title (3-100, único), description (10-2000), level (CEFR), coverImage (URL, opcional)
 * updateCourseSchema: todos opcionales, al menos uno requerido
 */

const { body, param, query } = require('express-validator');
const { CEFR_LEVELS } = require('../../config/constants');

const CEFR_VALUES = Object.values(CEFR_LEVELS);

const idParamSchema = [
  param('id')
    .trim()
    .isMongoId().withMessage('El id debe ser un ObjectId de MongoDB válido'),
];

const createCourseSchema = [
  body('title')
    .trim()
    .notEmpty().withMessage('El título es obligatorio')
    .isLength({ min: 3, max: 100 }).withMessage('El título debe tener entre 3 y 100 caracteres'),

  body('description')
    .trim()
    .notEmpty().withMessage('La descripción es obligatoria')
    .isLength({ min: 10, max: 2000 }).withMessage('La descripción debe tener entre 10 y 2000 caracteres'),

  body('level')
    .trim()
    .notEmpty().withMessage('El nivel es obligatorio')
    .isIn(CEFR_VALUES).withMessage(`El nivel debe ser uno de: ${CEFR_VALUES.join(', ')}`),

  body('coverImageUrl')
    .optional({ nullable: true })
    .if((value) => value !== null)
    .trim()
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('coverImageUrl debe ser una URL válida (http o https)')
    .isLength({ max: 500 }).withMessage('La URL no puede superar 500 caracteres'),
];

const updateCourseSchema = [
  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('El título no puede estar vacío')
    .isLength({ min: 3, max: 100 }).withMessage('El título debe tener entre 3 y 100 caracteres'),

  body('description')
    .optional()
    .trim()
    .notEmpty().withMessage('La descripción no puede estar vacía')
    .isLength({ min: 10, max: 2000 }).withMessage('La descripción debe tener entre 10 y 2000 caracteres'),

  body('level')
    .optional()
    .trim()
    .isIn(CEFR_VALUES).withMessage(`El nivel debe ser uno de: ${CEFR_VALUES.join(', ')}`),

  body('coverImageUrl')
    .optional({ nullable: true })
    .if((value) => value !== null)
    .trim()
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('coverImageUrl debe ser una URL válida (http o https)')
    .isLength({ max: 500 }).withMessage('La URL no puede superar 500 caracteres'),

  body('status')
    .not().exists()
    .withMessage('Usa los endpoints /publish o /archive para cambiar el estado del curso'),
];

const listCoursesSchema = [
  query('level')
    .optional()
    .trim()
    .isIn(CEFR_VALUES).withMessage(`El nivel debe ser uno de: ${CEFR_VALUES.join(', ')}`),

  query('page')
    .optional()
    .toInt()
    .isInt({ min: 1 }).withMessage('page debe ser un entero mayor o igual a 1'),

  query('limit')
    .optional()
    .toInt()
    .isInt({ min: 1, max: 100 }).withMessage('limit debe ser un entero entre 1 y 100'),

  query('sortBy')
    .optional()
    .trim()
    .isIn(['title', 'level', 'status', 'createdAt', 'updatedAt'])
    .withMessage('sortBy debe ser uno de: title, level, status, createdAt, updatedAt'),

  query('sortOrder')
    .optional()
    .trim()
    .isIn(['asc', 'desc']).withMessage('sortOrder debe ser "asc" o "desc"'),
];

module.exports = { idParamSchema, createCourseSchema, updateCourseSchema, listCoursesSchema };
