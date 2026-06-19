import { api } from '@/lib/api';

const base = (courseId, unitId) =>
  `/courses/${courseId}/units/${unitId}/lessons`;

export const lessonsService = {
  getLessonsByUnit(courseId, unitId, token) {
    return api.get(base(courseId, unitId), token);
  },

  getLessonById(courseId, unitId, lessonId, token) {
    return api.get(`${base(courseId, unitId)}/${lessonId}`, token);
  },

  createLesson(courseId, unitId, data, token) {
    return api.post(base(courseId, unitId), data, token);
  },

  updateLesson(courseId, unitId, lessonId, data, token) {
    return api.patch(`${base(courseId, unitId)}/${lessonId}`, data, token);
  },

  deleteLesson(courseId, unitId, lessonId, token) {
    return api.delete(`${base(courseId, unitId)}/${lessonId}`, token);
  },
};
