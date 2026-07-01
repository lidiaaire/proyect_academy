'use strict';

/**
 * modules/recommendations/recommendation.service.js
 *
 * Responsabilidad: Persistencia de recomendaciones de cursos.
 *
 * Métodos:
 *
 *   createRecommendation(studentId, courseId, reason, priority = 'MEDIUM')
 *     → Si ya existe una recomendación para ese estudiante y curso, la devuelve.
 *     → Si no existe, crea y devuelve la recomendación con status 'PENDING'.
 */

const RecommendationRepository = require('../../repositories/recommendation.repository');
const { STATUS, PRIORITY }     = require('../../models/recommendation.model');

const createRecommendation = async (studentId, courseId, reason, priority = PRIORITY.MEDIUM) => {
  const existing = await RecommendationRepository.findByStudentAndCourse(studentId, courseId);
  if (existing) return existing;

  return RecommendationRepository.create({
    student:  studentId,
    course:   courseId,
    reason,
    priority,
    status:   STATUS.PENDING,
  });
};

const getMyRecommendations = async (studentId) => {
  const docs = await RecommendationRepository.findByStudentWithCourse(studentId);
  return docs.map((r) => ({
    reason:                  r.reason,
    priority:                r.priority,
    status:                  r.status,
    createdAtRecommendation: r.createdAtRecommendation,
    course: {
      _id:         r.course._id,
      title:       r.course.title,
      level:       r.course.level,
      description: r.course.description,
    },
  }));
};

module.exports = { createRecommendation, getMyRecommendations };
