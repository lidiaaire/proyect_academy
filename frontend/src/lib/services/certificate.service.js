import { api } from '@/lib/api';

export const certificateService = {
  getMyCertificates(token) {
    return api.get('/certificates/me', token);
  },
};
