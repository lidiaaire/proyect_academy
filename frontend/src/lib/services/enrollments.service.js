import { api } from '@/lib/api';

export const enrollmentsService = {
  getEnrollments(token) {
    return api.get('/enrollments', token);
  },

  getEnrollmentById(id, token) {
    return api.get(`/enrollments/${id}`, token);
  },

  createEnrollment(data, token) {
    return api.post('/enrollments', data, token);
  },

  activateEnrollment(id, token) {
    return api.patch(`/enrollments/${id}/activate`, {}, token);
  },

  suspendEnrollment(id, token) {
    return api.patch(`/enrollments/${id}/suspend`, {}, token);
  },
};
