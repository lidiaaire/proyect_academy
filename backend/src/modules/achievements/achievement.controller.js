'use strict';

const asyncHandler       = require('../../utils/asyncHandler');
const AchievementService = require('./achievement.service');

const listUserAchievements = asyncHandler(async (req, res) => {
  const achievements = await AchievementService.getUserAchievements(req.user.userId);
  res.status(200).json({ achievements });
});

module.exports = { listUserAchievements };
