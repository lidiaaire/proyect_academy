'use strict';

const bookingRepository      = require('../../repositories/booking.repository');
const availabilityRepository = require('../../repositories/availability.repository');
const { NotFoundError, ConflictError, ForbiddenError } = require('../../utils/ApiError');
const { createNotification } = require('../notifications/notification.service');
const { createLiveSession, getLiveSessionByBooking } = require('../liveSessions/liveSession.service');
const { ROLES } = require('../../config/constants');

const overlaps = (aStart, aEnd, bStart, bEnd) => aStart < bEnd && aEnd > bStart;

const createBooking = async (studentId, teacherId, courseId, bookingDate, startTime, endTime, notes = '') => {
  const existing = await bookingRepository.exists(studentId, teacherId, bookingDate, startTime, endTime);
  if (existing) {
    return bookingRepository.findOne({ student: studentId, teacher: teacherId, bookingDate, startTime, endTime });
  }

  const dayOfWeek = new Date(bookingDate).getDay();
  const slots     = await availabilityRepository.findActiveByTeacherAndDay(teacherId, dayOfWeek);
  const hasSlot   = slots.some(s => s.startTime <= startTime && s.endTime >= endTime);
  if (!hasSlot) {
    throw new NotFoundError('NO_AVAILABILITY', 'El profesor no tiene disponibilidad activa para ese horario');
  }

  const dayBookings = await bookingRepository.findByTeacherAndDate(teacherId, bookingDate);
  const conflict    = dayBookings.find(
    b => b.status !== 'CANCELLED' && overlaps(startTime, endTime, b.startTime, b.endTime)
  );
  if (conflict) {
    throw new ConflictError(
      'BOOKING_CONFLICT',
      `El profesor ya tiene una reserva en ese intervalo (${conflict.startTime}–${conflict.endTime})`,
    );
  }

  return bookingRepository.create({
    student:     studentId,
    teacher:     teacherId,
    course:      courseId,
    bookingDate,
    startTime,
    endTime,
    status:      'PENDING',
    notes:       notes || '',
  });
};

const confirmBooking = async (actorRole, actorId, bookingId) => {
  const booking = await bookingRepository.findById(bookingId);
  if (!booking) {
    throw new NotFoundError('BOOKING_NOT_FOUND', 'Reserva no encontrada');
  }
  if (actorRole !== ROLES.ADMIN && booking.teacher.toString() !== actorId.toString()) {
    throw new ForbiddenError('BOOKING_FORBIDDEN', 'No tienes permiso para confirmar esta reserva');
  }
  if (booking.status === 'CONFIRMED') {
    return booking;
  }
  const updated = await bookingRepository.updateStatus(bookingId, 'CONFIRMED');

  const existing = await getLiveSessionByBooking(bookingId);
  if (!existing) {
    await createLiveSession({
      booking:  booking._id,
      roomId:   `booking-${booking._id}`,
      provider: 'JITSI',
      joinUrl:  '',
      status:   'SCHEDULED',
    });
  }

  await createNotification(
    booking.student,
    'BOOKING',
    'Booking confirmed',
    'Your lesson booking has been confirmed.',
    {
      bookingId: booking._id,
      teacherId: booking.teacher,
      courseId:  booking.course,
    },
  );

  return updated;
};

const cancelBooking = async (actorRole, actorId, bookingId) => {
  const booking = await bookingRepository.findById(bookingId);
  if (!booking) {
    throw new NotFoundError('BOOKING_NOT_FOUND', 'Reserva no encontrada');
  }
  const isOwner =
    booking.student.toString() === actorId.toString() ||
    booking.teacher.toString() === actorId.toString();
  if (actorRole !== ROLES.ADMIN && !isOwner) {
    throw new ForbiddenError('BOOKING_FORBIDDEN', 'No tienes permiso para cancelar esta reserva');
  }
  if (booking.status === 'CANCELLED') {
    return booking;
  }
  return bookingRepository.updateStatus(bookingId, 'CANCELLED');
};

const completeBooking = async (actorRole, actorId, bookingId) => {
  const booking = await bookingRepository.findById(bookingId);
  if (!booking) {
    throw new NotFoundError('BOOKING_NOT_FOUND', 'Reserva no encontrada');
  }
  if (actorRole !== ROLES.ADMIN && booking.teacher.toString() !== actorId.toString()) {
    throw new ForbiddenError('BOOKING_FORBIDDEN', 'No tienes permiso para completar esta reserva');
  }
  if (booking.status === 'COMPLETED') {
    return booking;
  }
  return bookingRepository.updateStatus(bookingId, 'COMPLETED');
};

const getMyBookings = async (studentId) => {
  const Booking = require('../../models/booking.model');
  return Booking
    .find({ student: studentId })
    .select('bookingDate startTime endTime status notes')
    .populate('teacher', '_id firstName lastName')
    .populate('course',  '_id title level')
    .sort({ bookingDate: -1, startTime: -1 });
};

module.exports = {
  createBooking,
  confirmBooking,
  cancelBooking,
  completeBooking,
  getMyBookings,
  listBookings:   async () => {},
  getBookingById: async () => {},
};
