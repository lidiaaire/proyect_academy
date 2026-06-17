'use strict';

/**
 * modules/bookings/booking.service.js
 *
 * Métodos:
 *
 *   listBookings(actorRole, actorId, filters)
 *     → Scope por rol; filtros status, dateFrom, dateTo, teacherId (admin), studentId (admin)
 *     → Serializa sin teacherNotes para student
 *
 *   getBookingById(actorRole, actorId, bookingId)
 *     → ForbiddenError si no es propio (teacher/student)
 *     → Serializa sin teacherNotes para student
 *
 *   createBooking(actorRole, actorId, data)
 *     Precondiciones en orden:
 *       1. teacherId válido (role='teacher', isActive=true)
 *       2. Si student: User.assignedTeacherId === data.teacherId → ForbiddenError TEACHER_NOT_ASSIGNED
 *       3. date no es pasada
 *       4. Slot existe en TeacherProfile.availability
 *       5. No hay reserva activa en ese slot (ClassBookingRepository.findActiveInSlot)
 *     → Crea en status='pending'
 *     → MongoDB captura colisión 11000 → 409 SLOT_ALREADY_BOOKED
 *
 *   confirmBooking(actorId, bookingId)
 *     → status debe ser 'pending' → ConflictError
 *     → status='confirmed'
 *
 *   completeBooking(actorId, bookingId, teacherNotes?)
 *     → status debe ser 'confirmed'
 *     → date de la reserva <= hoy → UnprocessableError CLASS_NOT_YET_HELD
 *     → status='completed'
 *
 *   cancelBooking(actorRole, actorId, bookingId, reason?)
 *     → Estados terminales (completed, cancelled) → ConflictError
 *     → Student solo puede cancelar 'pending' → ForbiddenError STUDENT_CANNOT_CANCEL_CONFIRMED
 *     → reason obligatorio para teacher/admin
 *     → status='cancelled'
 */

// TODO: Implementar en Phase 7

module.exports = {
  listBookings: async () => {},
  getBookingById: async () => {},
  createBooking: async () => {},
  confirmBooking: async () => {},
  completeBooking: async () => {},
  cancelBooking: async () => {},
};
