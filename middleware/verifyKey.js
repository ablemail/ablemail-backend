const { keys, client } = require('../config/config.json');

const verifyKey = (req, res, next) => {
  if (decodeURI(req.query.key) === keys.reqKey) {
    next();
  } else {
    res.redirect(client);
  }
};

module.exports = verifyKey;