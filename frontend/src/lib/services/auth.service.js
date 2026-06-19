import { api } from '@/lib/api';

export const authService = {
  login(credentials) {
    return api.post('/auth/login', credentials);
  },

  logout(token) {
    return api.post('/auth/logout', undefined, token);
  },

  me(token) {
    return api.get('/auth/me', token);
  },

  changePassword(data, token) {
    return api.patch('/auth/change-password', data, token);
  },
};
