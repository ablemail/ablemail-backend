const router = require('express').Router();
const passport = require('passport');
const verifyKey = require('../middleware/verifyKey');
const User = require('../models/user');
const CryptoJS = require('crypto-js');
const { client, keys } = require('../config/config.json');
const decodeQuery = require('../helper/decodeQuery');

const googleAuthRoutes = require('./google/googleAuthRoutes');

require('../helper/passport');

router.use('/google', googleAuthRoutes);

router.get('/signup', verifyKey, (req, res) => {
  const query = decodeQuery(req.query);
  User.findOne({ email: query.email }).then(async currentUser => {
    if (currentUser) {
      res.redirect(`${ client }signin/signup`);
    } else {
      new User({
        name: `${ query.first } ${ query.last }`,
        email: query.email,
        password: CryptoJS.AES.encrypt(query.pass, keys.cipherKey).toString()
      }).save().then(newUser => res.redirect(`${ client }/inbox/${ newUser.id }`));
    }
  });
});

router.post('/other', (req, res, next) => passport.authenticate('local', (err, user) => {
  if (err) return next(err);
  if (!user.user) return res.json({ message: 'failed to auth' });
  req.logIn(user, err => {
    if (err) return next(err);
    return res.json(req.user.user.id);
  });
})(req, res, next));

module.exports = router;