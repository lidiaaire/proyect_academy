import { api } from '@/lib/api';

const base = (courseId, unitId) =>
  `/courses/${courseId}/units/${unitId}/assessment`;

export const assessmentsService = {
  getAssessment(courseId, unitId, token) {
    return api.get(base(courseId, unitId), token);
  },

  createAssessment(courseId, unitId, data, token) {
    return api.post(base(courseId, unitId), data, token);
  },

  updateAssessment(courseId, unitId, data, token) {
    return api.patch(base(courseId, unitId), data, token);
  },

  deleteAssessment(courseId, unitId, token) {
    return api.delete(base(courseId, unitId), token);
  },

  submitAttempt(courseId, unitId, data, token) {
    return api.post(`${base(courseId, unitId)}/attempts`, data, token);
  },

  listAttempts(courseId, unitId, token) {
    return api.get(`${base(courseId, unitId)}/attempts`, token);
  },
};
