'use strict';

const availabilityRepository = require('../../repositories/availability.repository');
const { ConflictError, ValidationError } = require('../../utils/ApiError');

const overlaps = (aStart, aEnd, bStart, bEnd) => aStart < bEnd && aEnd > bStart;

const createAvailability = async (teacherId, dayOfWeek, startTime, endTime) => {
  if (startTime >= endTime) {
    throw new ValidationError('INVALID_TIME_RANGE', 'startTime debe ser anterior a endTime');
  }

  const existing = await availabilityRepository.exists(teacherId, dayOfWeek, startTime, endTime);
  if (existing) {
    return availabilityRepository.findOne({ teacher: teacherId, dayOfWeek, startTime, endTime });
  }

  const daySlots = await availabilityRepository.findByTeacherAndDay(teacherId, dayOfWeek);
  const conflict = daySlots.find(s => overlaps(startTime, endTime, s.startTime, s.endTime));
  if (conflict) {
    throw new ConflictError(
      'AVAILABILITY_OVERLAP',
      `El intervalo ${startTime}–${endTime} se solapa con un slot existente (${conflict.startTime}–${conflict.endTime})`,
    );
  }

  return availabilityRepository.create({
    teacher:  teacherId,
    dayOfWeek,
    startTime,
    endTime,
    isActive: true,
  });
};

const getMyAvailability = async (teacherId) => {
  const slots = await availabilityRepository.findActiveByTeacher(teacherId);
  return slots.sort((a, b) =>
    a.dayOfWeek !== b.dayOfWeek
      ? a.dayOfWeek - b.dayOfWeek
      : a.startTime.localeCompare(b.startTime)
  );
};

module.exports = { createAvailability, getMyAvailability };
