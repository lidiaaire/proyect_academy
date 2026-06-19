'use strict';

const { body, param } = require('express-validator');

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

const createAssessmentSchema = [
  body('unitId').not().exists().withMessage('unitId es asignado automáticamente por la ruta'),
  body('courseId').not().exists().withMessage('courseId es asignado automáticamente por la ruta'),

  body('title')
    .trim()
    .notEmpty().withMessage('El título es obligatorio')
    .isLength({ min: 3, max: 100 }).withMessage('El título debe tener entre 3 y 100 caracteres'),

  body('description')
    .optional({ nullable: true })
    .if((value) => value !== null)
    .trim()
    .isLength({ max: 500 }).withMessage('La descripción no puede superar 500 caracteres'),

  body('passingScore')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('passingScore debe ser un entero entre 1 y 100')
    .toInt(),

  body('maxAttempts')
    .optional()
    .isInt({ min: 1 }).withMessage('maxAttempts debe ser un entero mayor o igual a 1')
    .toInt(),

  body('questions')
    .isArray({ min: 1 }).withMessage('questions debe ser un array con al menos una pregunta'),

  body('questions.*.text')
    .trim()
    .notEmpty().withMessage('El texto de cada pregunta es obligatorio')
    .isLength({ max: 500 }).withMessage('El texto de la pregunta no puede superar 500 caracteres'),

  body('questions.*.options')
    .isArray({ min: 2, max: 4 }).withMessage('Cada pregunta debe tener entre 2 y 4 opciones'),

  body('questions.*.options.*')
    .trim()
    .notEmpty().withMessage('Las opciones no pueden estar vacías'),

  body('questions.*.correctIndex')
    .isInt({ min: 0 }).withMessage('correctIndex debe ser un entero mayor o igual a 0')
    .toInt()
    .custom((value, { req, path }) => {
      const match = path.match(/questions\[(\d+)\]/);
      if (!match) return true;
      const idx = parseInt(match[1], 10);
      const options = req.body.questions?.[idx]?.options;
      if (!Array.isArray(options)) return true;
      if (value >= options.length) {
        throw new Error('correctIndex debe ser un índice válido dentro del array options');
      }
      return true;
    }),
];

const updateAssessmentSchema = [
  body('unitId').not().exists().withMessage('unitId no puede modificarse'),
  body('courseId').not().exists().withMessage('courseId no puede modificarse'),

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

  body('passingScore')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('passingScore debe ser un entero entre 1 y 100')
    .toInt(),

  body('maxAttempts')
    .optional()
    .isInt({ min: 1 }).withMessage('maxAttempts debe ser un entero mayor o igual a 1')
    .toInt(),

  body('questions')
    .optional()
    .isArray({ min: 1 }).withMessage('questions debe ser un array con al menos una pregunta'),

  body('questions.*.text')
    .optional()
    .trim()
    .notEmpty().withMessage('El texto de cada pregunta es obligatorio')
    .isLength({ max: 500 }).withMessage('El texto de la pregunta no puede superar 500 caracteres'),

  body('questions.*.options')
    .optional()
    .isArray({ min: 2, max: 4 }).withMessage('Cada pregunta debe tener entre 2 y 4 opciones'),

  body('questions.*.options.*')
    .optional()
    .trim()
    .notEmpty().withMessage('Las opciones no pueden estar vacías'),

  body('questions.*.correctIndex')
    .optional()
    .isInt({ min: 0 }).withMessage('correctIndex debe ser un entero mayor o igual a 0')
    .toInt()
    .custom((value, { req, path }) => {
      const match = path.match(/questions\[(\d+)\]/);
      if (!match) return true;
      const idx = parseInt(match[1], 10);
      const options = req.body.questions?.[idx]?.options;
      if (!Array.isArray(options)) return true;
      if (value >= options.length) {
        throw new Error('correctIndex debe ser un índice válido dentro del array options');
      }
      return true;
    }),
];

const submitAttemptSchema = [
  body('answers')
    .isArray({ min: 1 }).withMessage('answers debe ser un array con al menos una respuesta'),

  body('answers.*')
    .isInt({ min: 0 }).withMessage('Cada respuesta debe ser un índice entero mayor o igual a 0')
    .toInt(),
];

module.exports = {
  courseIdParamSchema,
  unitIdParamSchema,
  createAssessmentSchema,
  updateAssessmentSchema,
  submitAttemptSchema,
};
