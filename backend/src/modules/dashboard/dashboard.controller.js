'use strict';

/**
 * modules/dashboard/dashboard.controller.js
 *
 * Métodos:
 *   getStudentDashboard     → DashboardService.getStudentDashboard(studentId)
 *   getTeacherDashboard     → DashboardService.getTeacherDashboard(teacherId)
 *   getTeacherStudentDetail → DashboardService.getTeacherStudentDetail(teacherId, studentId)
 *   getAdminDashboard       → DashboardService.getAdminDashboard()
 *   getAdminActivityFeed    → DashboardService.getAdminActivityFeed(days)
 *   getAdminAtRisk          → DashboardService.getAdminAtRisk()
 *
 * El actor siempre se extrae del JWT (req.user.userId, req.user.role).
 * Nunca del body ni de query params salvo ?days en getAdminActivityFeed.
 */

const asyncHandler       = require('../../utils/asyncHandler');
const DashboardService   = require('./dashboard.service');

const getStudentDashboard = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const dashboard = await DashboardService.getStudentDashboard(userId);
  res.status(200).json(dashboard);
});

const getTeacherDashboard = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const dashboard = await DashboardService.getTeacherDashboard(userId);
  res.status(200).json(dashboard);
});

const getTeacherStudentDetail = asyncHandler(async (req, res) => {
  const { userId }    = req.user;
  const { studentId } = req.params;
  const detail = await DashboardService.getTeacherStudentDetail(userId, studentId);
  res.status(200).json(detail);
});

const getAdminDashboard = asyncHandler(async (req, res) => {
  const dashboard = await DashboardService.getAdminDashboard();
  res.status(200).json(dashboard);
});

const getAdminActivityFeed = asyncHandler(async (req, res) => {
  const days = req.query.days ? parseInt(req.query.days, 10) : 30;
  const feed = await DashboardService.getAdminActivityFeed(days);
  res.status(200).json(feed);
});

const getAdminAtRisk = asyncHandler(async (req, res) => {
  const atRisk = await DashboardService.getAdminAtRisk();
  res.status(200).json(atRisk);
});

module.exports = {
  getStudentDashboard,
  getTeacherDashboard,
  getTeacherStudentDetail,
  getAdminDashboard,
  getAdminActivityFeed,
  getAdminAtRisk,
};
