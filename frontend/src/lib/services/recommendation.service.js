import { api } from '@/lib/api';

export const recommendationService = {
  getMyRecommendations(token) {
    return api.get('/recommendations/me', token);
  },
};
