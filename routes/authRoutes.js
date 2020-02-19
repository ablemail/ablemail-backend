const router = require('express').Router();
const passport = require('passport');
const passportSetup = require('../passport');
const verifyKey = require('../middleware/verifyKey');
const User = require('../models/user');

router.get('/', verifyKey, async (req, res) => {
  switch (req.query.provider) {
    case 'google':
      const raw = await User.findOne({ email: req.query.email });
      const user = raw ? raw : { email: req.query.email };
      user.password = req.query.pass;
      await User.findOneAndUpdate({ email: req.query.email }, user, { upsert: true, useFindAndModify: false });
      res.redirect('/auth/google');
      break;
    default:
      res.redirect('http://localhost:3000');
  }
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email', 'https://mail.google.com/'] }));

router.get('/google/callback', passport.authenticate('google'), (req, res) => res.redirect(`http://localhost:3000/inbox/${ req.user.accessToken }`));

module.exports = router;