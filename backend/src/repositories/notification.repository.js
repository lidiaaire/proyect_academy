'use strict';

const BaseRepository   = require('./base.repository');
const Notification     = require('../models/notification.model');

class NotificationRepository extends BaseRepository {
  constructor() {
    super(Notification);
  }

  async findByUser(userId) {
    return this.model
      .find({ user: userId })
      .sort({ createdAtNotification: -1 });
  }

  async findUnreadByUser(userId) {
    return this.model
      .find({ user: userId, isRead: false })
      .sort({ createdAtNotification: -1 });
  }

  async markAsRead(id) {
    return this.model.findByIdAndUpdate(
      id,
      { $set: { isRead: true } },
      { new: true },
    );
  }

  async markAllAsRead(userId) {
    return this.model.updateMany(
      { user: userId, isRead: false },
      { $set: { isRead: true } },
    );
  }
}

module.exports = new NotificationRepository();
