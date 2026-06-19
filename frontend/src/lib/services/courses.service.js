import { api } from '@/lib/api';

export const coursesService = {
  getCourses(token) {
    return api.get('/courses', token);
  },

  getCourseById(id, token) {
    return api.get(`/courses/${id}`, token);
  },

  createCourse(data, token) {
    return api.post('/courses', data, token);
  },

  updateCourse(id, data, token) {
    return api.patch(`/courses/${id}`, data, token);
  },

  deleteCourse(id, token) {
    return api.delete(`/courses/${id}`, token);
  },

  publishCourse(id, token) {
    return api.patch(`/courses/${id}/publish`, {}, token);
  },

  archiveCourse(id, token) {
    return api.patch(`/courses/${id}/archive`, {}, token);
  },
};
