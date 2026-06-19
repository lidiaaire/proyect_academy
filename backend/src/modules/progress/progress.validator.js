'use strict';

// modules/progress/progress.validator.js
// completeLessonSchema: sin body — lessonId viene de req.params
// No hay otros schemas — las demás rutas son solo GET con params de ruta

const { param } = require('express-validator');

const lessonIdParamSchema = [
  param('lessonId')
    .trim()
    .isMongoId().withMessage('lessonId debe ser un ObjectId de MongoDB válido'),
];

const courseIdParamSchema = [
  param('courseId')
    .trim()
    .isMongoId().withMessage('courseId debe ser un ObjectId de MongoDB válido'),
];

const studentIdParamSchema = [
  param('studentId')
    .trim()
    .isMongoId().withMessage('studentId debe ser un ObjectId de MongoDB válido'),
];

module.exports = { lessonIdParamSchema, courseIdParamSchema, studentIdParamSchema };
