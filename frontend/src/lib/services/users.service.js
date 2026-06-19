import { api } from '@/lib/api';

export const usersService = {
  getUsers(token) {
    return api.get('/users', token);
  },

  getUserById(id, token) {
    return api.get(`/users/${id}`, token);
  },

  createUser(data, token) {
    return api.post('/users', data, token);
  },

  updateUser(id, data, token) {
    return api.patch(`/users/${id}`, data, token);
  },

  activateUser(id, token) {
    return api.patch(`/users/${id}/activate`, {}, token);
  },

  deactivateUser(id, token) {
    return api.patch(`/users/${id}/deactivate`, {}, token);
  },
};
