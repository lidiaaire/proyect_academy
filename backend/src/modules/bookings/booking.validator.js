'use strict';

// modules/bookings/booking.validator.js
//
// createBookingSchema:
//   - teacherId:  requerido, ObjectId válido
//   - date:       requerido, 'YYYY-MM-DD', no pasada
//   - startTime:  requerido, 'HH:mm'
//   - endTime:    requerido, 'HH:mm', > startTime
//
// completeBookingSchema:
//   - teacherNotes: opcional, max 2000 chars
//
// cancelBookingSchema:
//   - cancellationReason: opcional (se valida obligatorio según rol en el service)

// TODO: Implementar en Phase 7

const createBookingSchema = [];
const completeBookingSchema = [];
const cancelBookingSchema = [];

module.exports = { createBookingSchema, completeBookingSchema, cancelBookingSchema };
