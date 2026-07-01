'use strict';

// modules/bookings/booking.validator.js
//
// Auditoría de validación de entrada (revisado): POST /api/bookings (create)
// NO está montado en booking.routes.js — el controller `create` existe pero
// es código muerto, no hay endpoint vivo que use createBookingSchema. Por eso
// estos esquemas permanecen sin implementar: no hay contrato real que validar.
//
// confirm/cancel/complete no leen req.body, solo :id por params — y un :id
// inválido ya produce 400 INVALID_ID a través del CastError de Mongoose
// (ver middlewares/errorHandler.js), por lo que no falta validación ahí.

const createBookingSchema = [];
const completeBookingSchema = [];
const cancelBookingSchema = [];

module.exports = { createBookingSchema, completeBookingSchema, cancelBookingSchema };
