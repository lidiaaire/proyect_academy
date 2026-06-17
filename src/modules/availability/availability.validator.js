'use strict';

// modules/availability/availability.validator.js
//
// replaceAvailabilitySchema:
//   - availability: requerido, array (puede ser vacío para limpiar plantilla)
//     - dayOfWeek:  requerido, entero 1-7 (ISO 8601)
//     - startTime:  requerido, 'HH:mm', múltiplo de 30 min
//     - endTime:    requerido, 'HH:mm', múltiplo de 30 min
//   - Máximo 20 elementos (validación en service)
//
// getSlotsSchema (query params):
//   - dateFrom: requerido, 'YYYY-MM-DD', no pasada
//   - dateTo:   requerido, 'YYYY-MM-DD', >= dateFrom, máximo 30 días de rango

// TODO: Implementar en Phase 7

const replaceAvailabilitySchema = [];
const getSlotsSchema = [];

module.exports = { replaceAvailabilitySchema, getSlotsSchema };
