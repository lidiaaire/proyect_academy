'use strict';

// modules/enrollments/enrollment.controller.js
// Métodos: list, getById, create, updateStatus

const asyncHandler         = require('../../utils/asyncHandler');
const EnrollmentService    = require('./enrollment.service');

const list = asyncHandler(async (req, res) => {
  const { role, userId } = req.user;
  const result = await EnrollmentService.listEnrollments(role, userId, req.query);
  res.status(200).json(result);
});

const getById = asyncHandler(async (req, res) => {
  const { role, userId } = req.user;
  const enrollment = await EnrollmentService.getEnrollmentById(role, userId, req.params.id);
  res.status(200).json({ enrollment });
});

const create = asyncHandler(async (req, res) => {
  const { studentId, courseId } = req.body;
  const enrollment = await EnrollmentService.createEnrollment(studentId, courseId);
  res.status(201).json({ enrollment });
});

const updateStatus = asyncHandler(async (req, res) => {
  const enrollment = await EnrollmentService.updateStatus(req.params.id, req.body.status);
  res.status(200).json({ enrollment });
});

module.exports = { list, getById, create, updateStatus };
