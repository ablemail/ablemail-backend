const { hostname, client } = require('../config/config.json');

const verifyHost = (req, res, next) => {
  if (req.hostname === hostname) {
    next();
  } else {
    res.redirect(client);
  }
};

module.exports = verifyHost;