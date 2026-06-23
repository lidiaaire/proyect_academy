'use strict';

/**
 * modules/dashboard/dashboard.routes.js
 * Montado bajo /api/dashboard
 *
 *   GET  /api/dashboard/student                          → getStudentDashboard    [student]
 *   GET  /api/dashboard/teacher                          → getTeacherDashboard    [teacher]
 *   GET  /api/dashboard/teacher/students/:studentId      → getTeacherStudentDetail [teacher]
 *   GET  /api/dashboard/admin                            → getAdminDashboard      [admin]
 *   GET  /api/dashboard/admin/activity                   → getAdminActivityFeed   [admin]
 *   GET  /api/dashboard/admin/at-risk                    → getAdminAtRisk         [admin]
 */

const { Router }             = require('express');
const DashboardController    = require('./dashboard.controller');
const verifyToken            = require('../../middlewares/verifyToken');
const requireRole            = require('../../middlewares/requireRole');
const { ROLES }              = require('../../config/constants');

const router = Router();

const studentOnly    = requireRole(ROLES.STUDENT);
const teacherOnly    = requireRole(ROLES.TEACHER);
const adminOnly      = requireRole(ROLES.ADMIN);

// --- Student ---

router.get('/student',
  verifyToken,
  studentOnly,
  DashboardController.getStudentDashboard,
);

// --- Teacher ---

router.get('/teacher',
  verifyToken,
  teacherOnly,
  DashboardController.getTeacherDashboard,
);

router.get('/teacher/students/:studentId',
  verifyToken,
  teacherOnly,
  DashboardController.getTeacherStudentDetail,
);

// --- Admin ---

router.get('/admin',
  verifyToken,
  adminOnly,
  DashboardController.getAdminDashboard,
);

router.get('/admin/activity',
  verifyToken,
  adminOnly,
  DashboardController.getAdminActivityFeed,
);

router.get('/admin/at-risk',
  verifyToken,
  adminOnly,
  DashboardController.getAdminAtRisk,
);

module.exports = router;
