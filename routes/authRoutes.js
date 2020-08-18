const router = require('express').Router();
const passport = require('passport');
const verifyHost = require('../middleware/verifyHost');
const User = require('../models/user');
const CryptoJS = require('crypto-js');
const decodeQuery = require('../helper/decodeQuery');

const PRODUCTION = process.env.NODE_ENV === 'production';

const { client, keys } = PRODUCTION ? {
  client: process.env.CLIENT,
  keys: { cipherKey: require('crypto-random-string')({ length: 100, type: 'url-safe' }) }
} : require('../config/config.json');

const googleAuthRoutes = require('./google/googleAuthRoutes');

router.use('/google', googleAuthRoutes);

router.get('/signup', verifyHost, (req, res) => {
  const query = decodeQuery(req.query);
  User.findOne({ email: query.email }).then(async currentUser => {
    if (currentUser) {
      res.redirect(`${ client }signin/signup`);
    } else {
      new User({
        name: `${ query.first } ${ query.last }`,
        email: query.email,
        password: CryptoJS.AES.encrypt(query.pass, keys.cipherKey).toString()
      }).save().then(() => res.redirect(`${ client }/inbox`));
    }
  });
});

router.post('/other', verifyHost, (req, res, next) => passport.authenticate('local', (err, user) => {
  if (err) return next(err);
  if (!user) return res.send('failed to auth');
  req.logIn(user, err => {
    if (err) return next(err);
    return res.end();
  });
})(req, res, next));

router.get('/is-authed', verifyHost, (req, res) => res.json({
  isAuthed: !!req.user,
  strategy: req.user && req.user.accessToken ? 'google' : 'other'
}));

module.exports = router;