'use strict';

const BaseRepository  = require('./base.repository');
const UserAchievement = require('../models/userAchievement.model');

class UserAchievementRepository extends BaseRepository {
  constructor() {
    super(UserAchievement);
  }

  async findByUser(userId) {
    return this.model
      .find({ user: userId })
      .populate('achievement', 'name slug description icon category points rarity')
      .sort({ unlockedAt: -1 })
      .lean();
  }
}

module.exports = new UserAchievementRepository();
