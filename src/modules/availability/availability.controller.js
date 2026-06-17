'use strict';

// modules/availability/availability.controller.js
// Métodos: getTemplate, replaceTemplate, getSlots

// TODO: Implementar en Phase 7

const asyncHandler = require('../../utils/asyncHandler');

const getTemplate     = asyncHandler(async (req, res) => { res.status(501).json({ error: 'NOT_IMPLEMENTED' }); });
const replaceTemplate = asyncHandler(async (req, res) => { res.status(501).json({ error: 'NOT_IMPLEMENTED' }); });
const getSlots        = asyncHandler(async (req, res) => { res.status(501).json({ error: 'NOT_IMPLEMENTED' }); });

module.exports = { getTemplate, replaceTemplate, getSlots };
