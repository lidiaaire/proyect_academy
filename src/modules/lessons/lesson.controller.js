'use strict';

/**
 * modules/lessons/lesson.controller.js
 *
 * Métodos: list, getById, create, update, reorder, remove
 * courseId y unitId disponibles via mergeParams de los routers padre
 */

const asyncHandler    = require('../../utils/asyncHandler');
const LessonService   = require('./lesson.service');

const list = asyncHandler(async (req, res) => {
  const { role, userId } = req.user;
  const { courseId, unitId } = req.params;
  const result = await LessonService.listLessons(role, userId, courseId, unitId);
  res.status(200).json(result);
});

const getById = asyncHandler(async (req, res) => {
  const { role, userId } = req.user;
  const { courseId, unitId, id } = req.params;
  const lesson = await LessonService.getLessonById(role, userId, courseId, unitId, id);
  res.status(200).json({ lesson });
});

const create = asyncHandler(async (req, res) => {
  const { courseId, unitId } = req.params;
  const lesson = await LessonService.createLesson(courseId, unitId, req.body);
  res.status(201).json({ lesson });
});

const update = asyncHandler(async (req, res) => {
  const { courseId, unitId, id } = req.params;
  const lesson = await LessonService.updateLesson(courseId, unitId, id, req.body);
  res.status(200).json({ lesson });
});

const reorder = asyncHandler(async (req, res) => {
  const { courseId, unitId } = req.params;
  await LessonService.reorderLessons(courseId, unitId, req.body.orderedIds);
  res.status(204).send();
});

const remove = asyncHandler(async (req, res) => {
  const { courseId, unitId, id } = req.params;
  await LessonService.deleteLesson(courseId, unitId, id);
  res.status(204).send();
});

module.exports = { list, getById, create, update, reorder, remove };
