'use strict';

const asyncHandler          = require('../../utils/asyncHandler');
const AvailabilityService   = require('./availability.service');

const getMyAvailability = asyncHandler(async (req, res) => {
  const slots = await AvailabilityService.getMyAvailability(req.user.userId);
  const data  = slots.map(({ dayOfWeek, startTime, endTime, isActive }) => ({
    dayOfWeek,
    startTime,
    endTime,
    isActive,
  }));
  res.status(200).json({ availability: data });
});

const createAvailability = asyncHandler(async (req, res) => {
  const { dayOfWeek, startTime, endTime } = req.body;
  const slot = await AvailabilityService.createAvailability(
    req.user.userId,
    dayOfWeek,
    startTime,
    endTime,
  );
  res.status(201).json({ availability: slot });
});

module.exports = { getMyAvailability, createAvailability };
