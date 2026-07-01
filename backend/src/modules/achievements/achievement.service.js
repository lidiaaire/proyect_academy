'use strict';

/**
 * modules/achievements/achievement.service.js
 *
 * Responsabilidad: Lógica base del sistema de logros.
 *
 * Métodos:
 *
 *   unlockAchievement(userId, achievementSlug, metadata = {})
 *     → Busca el Achievement por slug.
 *     → Si no existe, devuelve null.
 *     → Si el usuario ya lo tiene, devuelve el registro existente.
 *     → Si es nuevo, crea y devuelve el UserAchievement con metadata.
 */

const Achievement                = require('../../models/achievement.model');
const UserAchievement            = require('../../models/userAchievement.model');
const UserRepository             = require('../../repositories/user.repository');
const UserAchievementRepository  = require('../../repositories/userAchievement.repository');
const { createNotification }     = require('../notifications/notification.service');

const unlockAchievement = async (userId, achievementSlug, metadata = {}) => {
  const achievement = await Achievement.findOne({ slug: achievementSlug, isActive: true });
  if (!achievement) return null;

  const existing = await UserAchievement.findOne({ user: userId, achievement: achievement._id });
  if (existing) return existing;

  const userAchievement = await UserAchievement.create({
    user:        userId,
    achievement: achievement._id,
    metadata,
  });

  await createNotification(
    userId,
    'ACHIEVEMENT',
    'Achievement unlocked',
    achievement.name,
    { achievementId: achievement._id, slug: achievement.slug },
  );

  const updatedUser = await UserRepository.incrementPoints(userId, achievement.points);

  if (updatedUser?.achievementPoints === 100) {
    await unlockAchievement(userId, 'one_hundred_points');
  }

  return userAchievement;
};

const getUserAchievements = async (userId) => {
  const docs = await UserAchievementRepository.findByUser(userId);
  return docs.map((ua) => ({
    name:        ua.achievement.name,
    slug:        ua.achievement.slug,
    description: ua.achievement.description,
    icon:        ua.achievement.icon,
    category:    ua.achievement.category,
    points:      ua.achievement.points,
    rarity:      ua.achievement.rarity,
    unlockedAt:  ua.unlockedAt,
  }));
};

module.exports = { unlockAchievement, getUserAchievements };
