import { api } from '@/lib/api';

export const achievementService = {
  getMyAchievements(token) {
    return api.get('/achievements/me', token);
  },
};
