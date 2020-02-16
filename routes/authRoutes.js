const router = require('express').Router();
const passport = require('passport');
const passportSetup = require('../passport');
const verifyKey = require('../middleware/verifyKey');

router.get('/', verifyKey, (req, res) => {
  switch (req.query.provider) {
    case 'google':
      res.redirect('/auth/google');
      break;
    default:
      res.redirect('http://localhost:3000');
  }
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email', 'https://mail.google.com/'] }));

const user = new Promise(resolve => router.get('/google/callback', passport.authenticate('google'), (req, res) => {
  resolve(req.user);
  res.redirect('http://localhost:3000/inbox');
}));

module.exports = { authRoutes: router, user };