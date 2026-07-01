import { api } from '@/lib/api';

export const notificationService = {
  getMyNotifications(token) {
    return api.get('/notifications/me', token);
  },

  markAsRead(id, token) {
    return api.patch(`/notifications/${id}/read`, {}, token);
  },

  markAllAsRead(token) {
    return api.patch('/notifications/read-all', {}, token);
  },
};
