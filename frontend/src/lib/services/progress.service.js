import { api } from '@/lib/api';

export const progressService = {
  getOverview(token) {
    return api.get('/progress/overview', token);
  },

  getCourseProgress(courseId, token) {
    return api.get(`/progress/courses/${courseId}`, token);
  },

  completeLesson(lessonId, token) {
    return api.patch(`/progress/lessons/${lessonId}/complete`, {}, token);
  },
};
