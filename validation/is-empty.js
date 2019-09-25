const isEmpty = (value) =>
  value === null ||
  value === undefined ||
  (typeof value === 'object' && !Object.keys(value).length) ||
  (typeof value === 'string' && !value.trim().length);

module.exports = isEmpty;