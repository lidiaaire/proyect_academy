'use strict';

const { Router }                  = require('express');
const TeacherAnalyticsController  = require('./teacher-analytics.controller');
const verifyToken                 = require('../../middlewares/verifyToken');
const requireRole                 = require('../../middlewares/requireRole');
const { ROLES }                   = require('../../config/constants');

const router      = Router();
const teacherOnly = requireRole(ROLES.TEACHER);

router.get('/assessment-breakdown',
  verifyToken,
  teacherOnly,
  TeacherAnalyticsController.getAssessmentBreakdown,
);

router.get('/students/:studentId/weekly-trend',
  verifyToken,
  teacherOnly,
  TeacherAnalyticsController.getWeeklyTrend,
);

module.exports = router;
