'use strict';

const DEFAULT_PAGE  = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT     = 100;

const build = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    page,
    limit,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};

const toMongoOptions = (
  page      = DEFAULT_PAGE,
  limit     = DEFAULT_LIMIT,
  sortBy    = 'createdAt',
  sortOrder = 'desc',
) => {
  const sanitizedLimit = Math.min(parseInt(limit, 10)  || DEFAULT_LIMIT, MAX_LIMIT);
  const sanitizedPage  = Math.max(parseInt(page,  10)  || DEFAULT_PAGE,  1);

  return {
    skip:  (sanitizedPage - 1) * sanitizedLimit,
    limit: sanitizedLimit,
    sort:  { [sortBy]: sortOrder === 'asc' ? 1 : -1 },
  };
};

module.exports = { build, toMongoOptions, DEFAULT_PAGE, DEFAULT_LIMIT, MAX_LIMIT };
