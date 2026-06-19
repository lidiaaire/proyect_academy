'use strict';

/**
 * models/teacherProfile.model.js
 *
 * Responsabilidad: Esquema Mongoose del documento TeacherProfile.
 * Se crea automáticamente cuando se crea un User con role='teacher'.
 * NO tiene ruta de creación directa para ningún rol.
 *
 * Campos:
 *   userId        ObjectId  ref: User  requerido  único
 *   availability  Array de AvailabilitySlot (embebido)
 *     - dayOfWeek   Number   1-7 (ISO 8601: 1=lunes, 7=domingo)
 *     - startTime   String   'HH:mm'
 *     - endTime     String   'HH:mm'
 *
 * Índices:
 *   { userId: 1 }  unique
 *
 * Restricciones de negocio (validadas en AvailabilityService, no aquí):
 *   - No pueden existir dos slots con mismo dayOfWeek + startTime
 *   - Un slot no puede solaparse con otro del mismo día
 *   - Máximo 20 slots en total
 */

// TODO: Implementar en Phase 2

const { Schema, model } = require('mongoose');

const teacherProfileSchema = new Schema({}, { timestamps: true });

module.exports = model('TeacherProfile', teacherProfileSchema);
