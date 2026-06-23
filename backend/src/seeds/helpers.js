'use strict';

const upsert = (Model, filter, data) =>
  Model.findOneAndUpdate(filter, data, { upsert: true, new: true, setDefaultsOnInsert: true });

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
};

module.exports = { upsert, daysAgo };
