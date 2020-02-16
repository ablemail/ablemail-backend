const { key } = require('../config/key.json');

const verifyKey = (req, res, next) => {
  if (req.query.key === key) {
    next();
  } else {
    res.redirect('/');
  }
};

module.exports = verifyKey;