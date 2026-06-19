'use strict';

// modules/progress/progress.controller.js
// Métodos: completeLesson, getCourseProgress, getOverview,
//          getStudentCourseProgress, getStudentOverview

const asyncHandler      = require('../../utils/asyncHandler');
const ProgressService   = require('./progress.service');

const completeLesson = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const result = await ProgressService.completeLesson(userId, req.params.lessonId);
  res.status(200).json(result);
});

const getCourseProgress = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const progress = await ProgressService.getCourseProgress(userId, req.params.courseId);
  res.status(200).json({ progress });
});

const getOverview = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const overview = await ProgressService.getProgressOverview(userId);
  res.status(200).json({ overview });
});

const getStudentCourseProgress = asyncHandler(async (req, res) => {
  const { role, userId } = req.user;
  const { studentId, courseId } = req.params;
  const progress = await ProgressService.getStudentCourseProgress(role, userId, studentId, courseId);
  res.status(200).json({ progress });
});

const getStudentOverview = asyncHandler(async (req, res) => {
  const { role, userId } = req.user;
  const progress = await ProgressService.getStudentOverview(role, userId, req.params.studentId);
  res.status(200).json({ progress });
});

module.exports = { completeLesson, getCourseProgress, getOverview, getStudentCourseProgress, getStudentOverview };
