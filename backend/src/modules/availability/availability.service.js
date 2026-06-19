'use strict';

/**
 * modules/availability/availability.service.js
 *
 * Métodos:
 *
 *   getAvailabilityTemplate(actorRole, actorId, teacherId)
 *     → Admin: cualquier teacher
 *     → Teacher: solo propio
 *     → Student: solo el de su assignedTeacherId
 *
 *   replaceAvailabilityTemplate(actorRole, actorId, teacherId, slots)
 *     Validaciones (en servicio, no en validator):
 *       - No duplicados: mismo dayOfWeek + startTime
 *       - No solapamientos en mismo día
 *       - Máximo 20 slots
 *       - startTime < endTime
 *     → Reemplaza TeacherProfile.availability completo
 *     Nota: No cancela reservas existentes
 *
 *   getAvailableSlots(actorRole, actorId, teacherId, dateFrom, dateTo)
 *     1. Obtiene plantilla (con scope check)
 *     2. SlotExpander.expand(availability, dateFrom, dateTo)
 *     3. ClassBookingRepository.findByDateRange para reservas activas
 *     4. SlotExpander.markOccupied(daySlots, activeBookings)
 *     → DaySlots[] con available: true/false por slot
 */

// TODO: Implementar en Phase 7

module.exports = {
  getAvailabilityTemplate: async () => {},
  replaceAvailabilityTemplate: async () => {},
  getAvailableSlots: async () => {},
};
