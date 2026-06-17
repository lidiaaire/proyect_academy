'use strict';

/**
 * modules/courses/course.controller.js
 *
 * Métodos: list, getById, create, update, publish, archive, delete
 * Todos envueltos en asyncHandler.
 */

const asyncHandler    = require('../../utils/asyncHandler');
const CourseService   = require('./course.service');

const list = asyncHandler(async (req, res) => {
  const { role, userId } = req.user;
  const { level, page, limit, sortBy, sortOrder } = req.query;
  const result = await CourseService.listCourses(role, userId, { level }, { page, limit, sortBy, sortOrder });
  res.status(200).json(result);
});

const getById = asyncHandler(async (req, res) => {
  const { role, userId } = req.user;
  const course = await CourseService.getCourseById(role, userId, req.params.id);
  res.status(200).json({ course });
});

const create = asyncHandler(async (req, res) => {
  const course = await CourseService.createCourse(req.body);
  res.status(201).json({ course });
});

const update = asyncHandler(async (req, res) => {
  const course = await CourseService.updateCourse(req.params.id, req.body);
  res.status(200).json({ course });
});

const publish = asyncHandler(async (req, res) => {
  const course = await CourseService.publishCourse(req.params.id);
  res.status(200).json({ course });
});

const archive = asyncHandler(async (req, res) => {
  const course = await CourseService.archiveCourse(req.params.id);
  res.status(200).json({ course });
});

const remove = asyncHandler(async (req, res) => {
  await CourseService.deleteCourse(req.params.id);
  res.status(204).send();
});

module.exports = { list, getById, create, update, publish, archive, remove };
