const PRODUCTION = process.env.NODE_ENV === 'production';

const { hostname, client } = PRODUCTION ? {
  hostname: process.env.HOSTNAME,
  client: process.env.CLIENT
} : require('../config/config.json');

const verifyHost = (req, res, next) => {
  if (req.hostname === hostname) {
    next();
  } else {
    res.redirect(client);
  }
};

module.exports = verifyHost;