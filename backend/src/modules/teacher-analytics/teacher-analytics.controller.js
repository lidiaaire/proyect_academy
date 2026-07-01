'use strict';

const asyncHandler              = require('../../utils/asyncHandler');
const TeacherAnalyticsService   = require('./teacher-analytics.service');

const getAssessmentBreakdown = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const breakdown  = await TeacherAnalyticsService.getAssessmentBreakdown(userId);
  res.status(200).json(breakdown);
});

const getWeeklyTrend = asyncHandler(async (req, res) => {
  const { userId }    = req.user;
  const { studentId } = req.params;
  const trend = await TeacherAnalyticsService.getWeeklyTrend(userId, studentId);
  res.status(200).json(trend);
});

module.exports = { getAssessmentBreakdown, getWeeklyTrend };
