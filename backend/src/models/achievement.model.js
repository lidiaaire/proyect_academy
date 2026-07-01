'use strict';

/**
 * models/achievement.model.js
 *
 * Responsabilidad: Esquema Mongoose del documento Achievement.
 * Define la estructura de datos de los logros del sistema de gamificación.
 *
 * Campos:
 *   name        String   requerido
 *   slug        String   requerido  único
 *   description String   requerido
 *   icon        String   requerido
 *   category    Enum     COURSE | LESSON | STREAK | PROGRESS | ASSESSMENT | PLATFORM
 *   points      Number   requerido  default: 10  min: 0
 *   rarity      Enum     COMMON | RARE | EPIC | LEGENDARY
 *   isActive    Boolean  default: true
 *
 * Índices:
 *   { slug: 1 }  unique
 */

const { Schema, model } = require('mongoose');

const CATEGORY = Object.freeze({
  COURSE:     'COURSE',
  LESSON:     'LESSON',
  STREAK:     'STREAK',
  PROGRESS:   'PROGRESS',
  ASSESSMENT: 'ASSESSMENT',
  PLATFORM:   'PLATFORM',
});

const RARITY = Object.freeze({
  COMMON:    'COMMON',
  RARE:      'RARE',
  EPIC:      'EPIC',
  LEGENDARY: 'LEGENDARY',
});

const achievementSchema = new Schema(
  {
    name: {
      type:      String,
      required:  true,
      trim:      true,
      maxlength: 100,
    },
    slug: {
      type:      String,
      required:  true,
      trim:      true,
      lowercase: true,
      maxlength: 100,
    },
    description: {
      type:      String,
      required:  true,
      trim:      true,
      maxlength: 500,
    },
    icon: {
      type:     String,
      required: true,
      trim:     true,
    },
    category: {
      type:     String,
      required: true,
      enum:     Object.values(CATEGORY),
    },
    points: {
      type:    Number,
      required: true,
      min:     0,
      default: 10,
    },
    rarity: {
      type:     String,
      required: true,
      enum:     Object.values(RARITY),
      default:  RARITY.COMMON,
    },
    isActive: {
      type:    Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

achievementSchema.index({ slug: 1 }, { unique: true });

module.exports = model('Achievement', achievementSchema);
module.exports.CATEGORY = CATEGORY;
module.exports.RARITY   = RARITY;
