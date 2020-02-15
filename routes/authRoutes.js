const router = require('express').Router();
const { key } = require('../config/key.json');
const passport = require('passport');
const passportSetup = require('../passport');

const verifyKey = (req, res, next) => {
  if (req.query.key === key) {
    next();
  } else {
    res.redirect('/');
  }
};

router.get('/', verifyKey, (req, res) => {
  switch (req.query.email.split('@')[1]) {
    case 'gmail.com':
      res.redirect('/auth/google');
      break;
  }
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google'), (req, res) => {
  res.send('yeet')
});

module.exports = router;