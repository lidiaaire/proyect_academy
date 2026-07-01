'use strict';

function buildPaginatedResponse(items, total, page, limit) {
  return {
    items,
    total,
    page,
    pages: total === 0 ? 0 : Math.ceil(total / limit),
  };
}

module.exports = { buildPaginatedResponse };
