'use strict';

/**
 * modules/units/unit.controller.js
 *
 * Métodos: list, getById, create, update, reorder, remove
 * Todos los params de curso vienen de req.params.courseId (mergeParams)
 */

const asyncHandler  = require('../../utils/asyncHandler');
const UnitService   = require('./unit.service');

const list = asyncHandler(async (req, res) => {
  const { role, userId } = req.user;
  const result = await UnitService.listUnits(role, userId, req.params.courseId);
  res.status(200).json(result);
});

const getById = asyncHandler(async (req, res) => {
  const { role, userId } = req.user;
  const unit = await UnitService.getUnitById(role, userId, req.params.courseId, req.params.id);
  res.status(200).json({ unit });
});

const create = asyncHandler(async (req, res) => {
  const unit = await UnitService.createUnit(req.params.courseId, req.body);
  res.status(201).json({ unit });
});

const update = asyncHandler(async (req, res) => {
  const unit = await UnitService.updateUnit(req.params.courseId, req.params.id, req.body);
  res.status(200).json({ unit });
});

const reorder = asyncHandler(async (req, res) => {
  await UnitService.reorderUnits(req.params.courseId, req.body.orderedIds);
  res.status(204).send();
});

const remove = asyncHandler(async (req, res) => {
  await UnitService.deleteUnit(req.params.courseId, req.params.id);
  res.status(204).send();
});

module.exports = { list, getById, create, update, reorder, remove };
