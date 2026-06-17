'use strict';

/**
 * repositories/classBooking.repository.js
 *
 * Responsabilidad: Acceso a datos para la entidad ClassBooking.
 *
 * Métodos adicionales:
 *
 *   findByTeacher(teacherId, filters, options?)
 *     → Reservas donde teacherId coincide, con filtros opcionales (status, dateRange)
 *
 *   findByStudent(studentId, filters, options?)
 *     → Reservas donde studentId coincide, con filtros opcionales
 *
 *   findActiveInSlot(teacherId, date, startTime)
 *     → Reserva en status pending|confirmed para ese slot o null
 *     → Usado por BookingService.createBooking para verificar conflictos
 *     → La última línea de defensa es el índice unique de MongoDB
 *
 *   findByDateRange(teacherId, dateFrom, dateTo)
 *     → Reservas del profesor en un rango de fechas
 *     → Usado por AvailabilityService.getAvailableSlots para marcar slots ocupados
 */

// TODO: Implementar en Phase 7

const BaseRepository = require('./base.repository');
const ClassBooking = require('../models/classBooking.model');

class ClassBookingRepository extends BaseRepository {
  constructor() {
    super(ClassBooking);
  }
}

module.exports = new ClassBookingRepository();
