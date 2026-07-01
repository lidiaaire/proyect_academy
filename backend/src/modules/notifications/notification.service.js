'use strict';

const notificationRepository             = require('../../repositories/notification.repository');
const { NotFoundError, ForbiddenError }  = require('../../utils/ApiError');

const createNotification = async (userId, type, title, message, metadata = {}) => {
  return notificationRepository.create({
    user:     userId,
    type,
    title,
    message,
    isRead:   false,
    metadata: metadata || {},
  });
};

const getMyNotifications = async (userId) => {
  const notifications = await notificationRepository.findByUser(userId);
  return notifications.map(n => ({
    _id:                    n._id,
    type:                   n.type,
    title:                  n.title,
    message:                n.message,
    isRead:                 n.isRead,
    metadata:               n.metadata,
    createdAtNotification:  n.createdAtNotification,
  }));
};

const markNotificationAsRead = async (userId, notificationId) => {
  const notification = await notificationRepository.findById(notificationId);
  if (!notification) {
    throw new NotFoundError('NOTIFICATION_NOT_FOUND', 'Notificación no encontrada');
  }

  if (notification.user.toString() !== userId.toString()) {
    throw new ForbiddenError('NOTIFICATION_FORBIDDEN', 'No tienes permiso para acceder a esta notificación');
  }

  if (notification.isRead) {
    return notification;
  }

  return notificationRepository.markAsRead(notificationId);
};

const markAllNotificationsAsRead = async (userId) => {
  await notificationRepository.markAllAsRead(userId);
  return { success: true };
};

module.exports = { createNotification, getMyNotifications, markNotificationAsRead, markAllNotificationsAsRead };
