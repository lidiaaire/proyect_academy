'use strict';

const Achievement          = require('../models/achievement.model');
const { CATEGORY, RARITY } = require('../models/achievement.model');
const { upsert }           = require('./helpers');

const ACHIEVEMENTS = [
  {
    name:        'Welcome to Elevate',
    slug:        'welcome_to_elevate',
    description: 'You joined the Elevate Your English Campus. Your journey starts here!',
    icon:        '🎉',
    category:    CATEGORY.PLATFORM,
    points:      10,
    rarity:      RARITY.COMMON,
    isActive:    true,
  },
  {
    name:        'Profile Completed',
    slug:        'profile_completed',
    description: 'You completed your learner profile. Let us personalize your experience.',
    icon:        '👤',
    category:    CATEGORY.PLATFORM,
    points:      15,
    rarity:      RARITY.COMMON,
    isActive:    true,
  },
  {
    name:        'First Lesson Completed',
    slug:        'first_lesson_completed',
    description: 'You completed your very first lesson. Keep going!',
    icon:        '📖',
    category:    CATEGORY.LESSON,
    points:      20,
    rarity:      RARITY.COMMON,
    isActive:    true,
  },
  {
    name:        'Five Lessons Completed',
    slug:        'five_lessons_completed',
    description: 'You have completed 5 lessons. You are building momentum!',
    icon:        '✋',
    category:    CATEGORY.LESSON,
    points:      40,
    rarity:      RARITY.COMMON,
    isActive:    true,
  },
  {
    name:        'Ten Lessons Completed',
    slug:        'ten_lessons_completed',
    description: 'Ten lessons done. You are a dedicated learner!',
    icon:        '🔟',
    category:    CATEGORY.LESSON,
    points:      80,
    rarity:      RARITY.RARE,
    isActive:    true,
  },
  {
    name:        'First Unit Completed',
    slug:        'first_unit_completed',
    description: 'You finished your first unit. One step closer to fluency.',
    icon:        '🏁',
    category:    CATEGORY.COURSE,
    points:      50,
    rarity:      RARITY.COMMON,
    isActive:    true,
  },
  {
    name:        'First Course Completed',
    slug:        'first_course_completed',
    description: 'You completed an entire course. Outstanding dedication!',
    icon:        '🎓',
    category:    CATEGORY.COURSE,
    points:      200,
    rarity:      RARITY.EPIC,
    isActive:    true,
  },
  {
    name:        'Seven Day Streak',
    slug:        'seven_day_streak',
    description: 'Seven days of consistent learning in a row. Incredible discipline!',
    icon:        '🔥',
    category:    CATEGORY.STREAK,
    points:      100,
    rarity:      RARITY.RARE,
    isActive:    true,
  },
  {
    name:        'Perfect Assessment',
    slug:        'perfect_assessment',
    description: 'You scored 100% on an assessment. Flawless performance!',
    icon:        '⭐',
    category:    CATEGORY.ASSESSMENT,
    points:      150,
    rarity:      RARITY.EPIC,
    isActive:    true,
  },
  {
    name:        'One Hundred Points',
    slug:        'one_hundred_points',
    description: 'You reached 100 total points. Your effort is paying off!',
    icon:        '💯',
    category:    CATEGORY.PROGRESS,
    points:      50,
    rarity:      RARITY.RARE,
    isActive:    true,
  },
];

module.exports = async () => {
  for (const data of ACHIEVEMENTS) {
    await upsert(Achievement, { slug: data.slug }, data);
  }
};

if (require.main === module) {
  require('../config/env');
  const { connectDB } = require('../config/database');
  const mongoose      = require('mongoose');
  connectDB()
    .then(() => module.exports())
    .then(() => mongoose.disconnect())
    .catch((err) => { console.error(err); process.exit(1); });
}
