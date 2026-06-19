import { api } from '@/lib/api';

const base = (courseId) => `/courses/${courseId}/units`;

export const unitsService = {
  getUnitsByCourse(courseId, token) {
    return api.get(base(courseId), token);
  },

  getUnitById(courseId, id, token) {
    return api.get(`${base(courseId)}/${id}`, token);
  },

  createUnit(courseId, data, token) {
    return api.post(base(courseId), data, token);
  },

  updateUnit(courseId, id, data, token) {
    return api.patch(`${base(courseId)}/${id}`, data, token);
  },

  deleteUnit(courseId, id, token) {
    return api.delete(`${base(courseId)}/${id}`, token);
  },
};
