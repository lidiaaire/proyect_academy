'use strict';

/**
 * models/userAchievement.model.js
 *
 * Responsabilidad: Esquema Mongoose que almacena la relación entre
 * un usuario y un logro desbloqueado.
 *
 * Campos:
 *   user          ObjectId  ref: User         requerido
 *   achievement   ObjectId  ref: Achievement  requerido
 *   unlockedAt    Date      default: Date.now
 *   metadata      Mixed     default: {}
 *
 * Índices:
 *   { user: 1, achievement: 1 }  unique  — un usuario no puede tener el mismo logro dos veces
 */

const { Schema, model, Types } = require('mongoose');

const userAchievementSchema = new Schema(
  {
    user: {
      type:     Types.ObjectId,
      ref:      'User',
      required: true,
    },
    achievement: {
      type:     Types.ObjectId,
      ref:      'Achievement',
      required: true,
    },
    unlockedAt: {
      type:    Date,
      default: Date.now,
    },
    metadata: {
      type:    Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

userAchievementSchema.index({ user: 1, achievement: 1 }, { unique: true });

module.exports = model('UserAchievement', userAchievementSchema);
