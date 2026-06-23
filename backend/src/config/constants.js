'use strict';

/**
 * config/constants.js
 *
 * Responsabilidad: Centralizar todos los enums y constantes de la aplicación.
 * Ningún archivo usa strings literales para roles, estados o tipos —
 * siempre importa desde aquí.
 *
 * Exporta:
 *   ROLES          → { ADMIN, TEACHER, STUDENT }
 *   COURSE_STATUS  → { DRAFT, PUBLISHED, ARCHIVED }
 *   BOOKING_STATUS → { PENDING, CONFIRMED, COMPLETED, CANCELLED }
 *   LESSON_TYPES   → { VIDEO, TEXT, QUIZ }
 *   CEFR_LEVELS    → { A1, A2, B1, B2, C1, C2 }
 *   ENROLLMENT_STATUS → { ACTIVE, SUSPENDED, COMPLETED }
 *   PROGRESS_STATUS   → { NOT_STARTED, COMPLETED }
 */

// TODO: Implementar en Phase 0

const ROLES = Object.freeze({
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
});

const COURSE_STATUS = Object.freeze({
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
});

const BOOKING_STATUS = Object.freeze({
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
});

const LESSON_TYPES = Object.freeze({
  VIDEO: 'video',
  TEXT:  'text',
  QUIZ:  'quiz',
});

const CEFR_LEVELS = Object.freeze({
  A1: 'A1',
  A2: 'A2',
  B1: 'B1',
  B2: 'B2',
  C1: 'C1',
  C2: 'C2',
});

const ENROLLMENT_STATUS = Object.freeze({
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  COMPLETED: 'completed',
});

const PROGRESS_STATUS = Object.freeze({
  NOT_STARTED: 'not_started',
  COMPLETED: 'completed',
});

const AT_RISK_DAYS = 7;
const AT_RISK_PROGRESS_THRESHOLD = 50;

const SKILL_RADAR_SOURCE = Object.freeze({
  PRELIMINARY: 'preliminary',
  LIVE:        'skill_radar',
});

const GROWTH_WINDOWS = Object.freeze({
  DAYS_7:  7,
  DAYS_30: 30,
});

const ACTIVITY_FEED_MAX_DAYS = 90;

module.exports = {
  ROLES,
  COURSE_STATUS,
  BOOKING_STATUS,
  LESSON_TYPES,
  CEFR_LEVELS,
  ENROLLMENT_STATUS,
  PROGRESS_STATUS,
  AT_RISK_DAYS,
  AT_RISK_PROGRESS_THRESHOLD,
  SKILL_RADAR_SOURCE,
  GROWTH_WINDOWS,
  ACTIVITY_FEED_MAX_DAYS,
};
