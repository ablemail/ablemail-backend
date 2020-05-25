const router = require('express').Router();
const passport = require('passport');
const verifyHost = require('../middleware/verifyHost');
const User = require('../models/user');
const CryptoJS = require('crypto-js');
const { client, keys } = require('../config/config.json');
const decodeQuery = require('../helper/decodeQuery');
const cache = require('memory-cache');

const googleAuthRoutes = require('./google/googleAuthRoutes');

require('../helper/passport');

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
  if (!user) return res.json({ message: 'failed to auth' });
  req.login(user, err => {
    if (err) return next(err);
    return res.json(req.user.id);
  });
})(req, res, next));

router.get('/is-authed', verifyHost, (req, res) => res.json({ isAuthed: !!cache.get('user'), strategy: cache.get('strategy') }));

module.exports = router;