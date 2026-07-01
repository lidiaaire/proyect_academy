'use strict';

const asyncHandler           = require('../../utils/asyncHandler');
const notificationService    = require('./notification.service');

const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await notificationService.getMyNotifications(req.user.userId);
  res.status(200).json({ notifications });
});

const markAsRead = asyncHandler(async (req, res) => {
  const notification = await notificationService.markNotificationAsRead(req.user.userId, req.params.id);
  res.status(200).json({ notification });
});

const markAllAsRead = asyncHandler(async (req, res) => {
  const result = await notificationService.markAllNotificationsAsRead(req.user.userId);
  res.status(200).json(result);
});

module.exports = { getMyNotifications, markAsRead, markAllAsRead };
