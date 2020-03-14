const decodeQuery = query => {
  const decoded = {};
  Object.keys(query).forEach(key => decoded[key] = decodeURIComponent(query[key]));
  return decoded;
};

module.exports = decodeQuery;