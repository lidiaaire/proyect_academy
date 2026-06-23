'use strict';

const { Schema, model, Types } = require('mongoose');
const { ROLES } = require('../config/constants');

const userSchema = new Schema(
  {
    firstName: {
      type:      String,
      required:  true,
      trim:      true,
      minlength: 2,
      maxlength: 50,
    },
    lastName: {
      type:      String,
      required:  true,
      trim:      true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type:      String,
      required:  true,
      unique:    true,
      lowercase: true,
      trim:      true,
    },
    passwordHash: {
      type:     String,
      required: true,
      select:   false,
    },
    role: {
      type:    String,
      enum:    Object.values(ROLES),
      default: ROLES.STUDENT,
    },
    isActive: {
      type:    Boolean,
      default: true,
    },
    avatarUrl: {
      type:    String,
      default: null,
    },
    assignedTeacherId: {
      type:    Types.ObjectId,
      ref:     'User',
      default: null,
    },
    lastLoginAt: {
      type:    Date,
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ assignedTeacherId: 1 });

module.exports = model('User', userSchema);
