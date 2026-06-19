'use strict';

/**
 * models/classBooking.model.js
 *
 * Responsabilidad: Esquema Mongoose del documento ClassBooking.
 * Las reservas son PERMANENTES — nunca se eliminan, solo se cancelan.
 *
 * Campos:
 *   studentId          ObjectId  ref: User  requerido
 *   teacherId          ObjectId  ref: User  requerido
 *   date               String    requerido  'YYYY-MM-DD'
 *   startTime          String    requerido  'HH:mm'
 *   endTime            String    requerido  'HH:mm'
 *   status             String    requerido  enum: BOOKING_STATUS  default: 'pending'
 *   cancellationReason String    opcional   presente cuando status='cancelled'
 *   teacherNotes       String    opcional   max 2000 chars  NUNCA expuesto al Student
 *
 * Índices:
 *   { teacherId: 1, date: 1, startTime: 1 }  unique
 *     → Garantiza a nivel de BD que no existen dos reservas activas
 *       para el mismo profesor en el mismo slot.
 *       La aplicación captura el error 11000 como 409 SLOT_ALREADY_BOOKED.
 *
 * Máquina de estados (validada en BookingService):
 *   pending → confirmed | cancelled
 *   confirmed → completed | cancelled
 *   completed → (terminal)
 *   cancelled → (terminal)
 *
 * teacherNotes: se filtra en BookingService antes de serializar la respuesta
 * cuando el actor es un Student.
 */

// TODO: Implementar en Phase 7

const { Schema, model } = require('mongoose');

const classBookingSchema = new Schema({}, { timestamps: true });

module.exports = model('ClassBooking', classBookingSchema);
