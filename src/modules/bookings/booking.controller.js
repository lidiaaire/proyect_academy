'use strict';

// modules/bookings/booking.controller.js
// Métodos: list, getById, create, confirm, complete, cancel

// TODO: Implementar en Phase 7

const asyncHandler = require('../../utils/asyncHandler');

const list     = asyncHandler(async (req, res) => { res.status(501).json({ error: 'NOT_IMPLEMENTED' }); });
const getById  = asyncHandler(async (req, res) => { res.status(501).json({ error: 'NOT_IMPLEMENTED' }); });
const create   = asyncHandler(async (req, res) => { res.status(501).json({ error: 'NOT_IMPLEMENTED' }); });
const confirm  = asyncHandler(async (req, res) => { res.status(501).json({ error: 'NOT_IMPLEMENTED' }); });
const complete = asyncHandler(async (req, res) => { res.status(501).json({ error: 'NOT_IMPLEMENTED' }); });
const cancel   = asyncHandler(async (req, res) => { res.status(501).json({ error: 'NOT_IMPLEMENTED' }); });

module.exports = { list, getById, create, confirm, complete, cancel };
