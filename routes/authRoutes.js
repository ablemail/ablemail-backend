const router = require('express').Router();
const passport = require('passport');
const passportSetup = require('../helper/passport');
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
      User.findOne({ email: req.query.email }).then( currentUser => {
        if (currentUser) {
          res.json({ id: currentUser.id });
        } else {
          new User({
            name: `${ req.query.first } ${ req.query.last }`,
            email: req.query.email,
            password: req.query.pass
          }).save().then(newUser => res.json({ id: newUser.id }));
        }
      });
  }
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email', 'https://mail.google.com/'] }));

router.get('/google/callback', passport.authenticate('google'), (req, res) => res.redirect(`http://localhost:3000/inbox/google/${ req.user.accessToken }`));

module.exports = router;