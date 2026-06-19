'use strict';

/**
 * utils/slotExpander.js
 *
 * Responsabilidad: Expandir la plantilla semanal de disponibilidad de un
 * profesor en fechas concretas para un rango dado. Utilidad pura sin acceso a BD.
 *
 * Expone:
 *   expand(availability, dateFrom, dateTo)
 *     availability: AvailabilitySlot[] — plantilla semanal del TeacherProfile
 *     dateFrom/dateTo: string 'YYYY-MM-DD'
 *     → DaySlots[] — un elemento por día del rango que tenga slots en plantilla
 *       { date, dayOfWeek, slots: [{ startTime, endTime, available: true }] }
 *
 *   markOccupied(daySlots, existingBookings)
 *     existingBookings: ClassBooking[] con status pending | confirmed
 *     → DaySlots[] con available: false en slots ocupados
 *
 * Nota: dayOfWeek usa ISO 8601 (1=lunes, 7=domingo)
 */

// TODO: Implementar en Phase 7

const expand = (availability, dateFrom, dateTo) => [];
const markOccupied = (daySlots, existingBookings) => daySlots;

module.exports = { expand, markOccupied };
