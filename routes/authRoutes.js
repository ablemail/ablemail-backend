const router = require('express').Router();
const passport = require('passport');
const verifyKey = require('../middleware/verifyKey');
const User = require('../models/user');
const CryptoJS = require('crypto-js');
const { cipherKey } = require('../config/key.json');
const verifyPassword = require('../helper/passport');

router.get('/', verifyKey, async (req, res) => {
  switch (req.query.provider) {
    case 'google':
      const raw = await User.findOne({ email: req.query.email });
      const user = raw ? raw : { email: req.query.email, password: null };
      if (raw && !verifyPassword(user.password, req.query.pass)) {
        res.redirect(`http://localhost:3000/signin/failure`);
      } else {
        user.password = CryptoJS.AES.encrypt(req.query.pass, cipherKey).toString();
        await User.findOneAndUpdate({ email: req.query.email }, user, { upsert: true, useFindAndModify: false });
        res.redirect('/auth/google');
      }
      break;
    default:
      break;
  }
});

router.get('/signup', verifyKey, (req, res) => {
  User.findOne({ email: req.query.email }).then(async currentUser => {
    if (currentUser) {
      res.redirect(`http://localhost:3000/signin/signup`);
    } else {
      new User({
        name: `${ req.query.first } ${ req.query.last }`,
        email: req.query.email,
        password: CryptoJS.AES.encrypt(req.query.pass, cipherKey).toString()
      }).save().then(newUser => res.redirect(`http://localhost:3000/inbox/${ newUser.id }`));
    }
  });
});

router.post('/other', (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) return next(err);
    if (!user.user) return res.json({ message: 'failed to auth' });
    req.logIn(user, err => {
      if (err) return next(err);
      return res.json(req.user.user.id);
    });
  })(req, res, next);
});


router.get('/google', passport.authenticate('google', { scope: ['profile', 'email', 'https://mail.google.com/'] }));

router.get('/google/callback', passport.authenticate('google'), (req, res) => res.redirect(`http://localhost:3000/inbox/google/${ req.user.accessToken }`));

module.exports = router;