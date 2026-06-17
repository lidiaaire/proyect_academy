'use strict';

const asyncHandler      = require('../../utils/asyncHandler');
const AssessmentService = require('./assessment.service');

const get = asyncHandler(async (req, res) => {
  const { role, userId } = req.user;
  const { courseId, unitId } = req.params;
  const assessment = await AssessmentService.getAssessment(role, userId, courseId, unitId);
  res.status(200).json({ assessment });
});

const create = asyncHandler(async (req, res) => {
  const { courseId, unitId } = req.params;
  const assessment = await AssessmentService.createAssessment(courseId, unitId, req.body);
  res.status(201).json({ assessment });
});

const update = asyncHandler(async (req, res) => {
  const { courseId, unitId } = req.params;
  const assessment = await AssessmentService.updateAssessment(courseId, unitId, req.body);
  res.status(200).json({ assessment });
});

const remove = asyncHandler(async (req, res) => {
  const { courseId, unitId } = req.params;
  await AssessmentService.deleteAssessment(courseId, unitId);
  res.status(204).send();
});

const submitAttempt = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { courseId, unitId } = req.params;
  const attempt = await AssessmentService.submitAttempt(userId, courseId, unitId, req.body.answers);
  res.status(201).json({ attempt });
});

const listAttempts = asyncHandler(async (req, res) => {
  const { role, userId } = req.user;
  const { courseId, unitId } = req.params;
  const attempts = await AssessmentService.listAttempts(role, userId, courseId, unitId);
  res.status(200).json({ attempts });
});

module.exports = { get, create, update, remove, submitAttempt, listAttempts };
