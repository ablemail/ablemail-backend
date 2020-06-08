const router = require('express').Router();
const passport = require('passport');
const User = require('../../models/user');
const CryptoJS = require('crypto-js');
const verifyHost = require('../../middleware/verifyHost');
const verifyPassword = require('../../helper/verifyPassword');
const { client, keys } = require('../../config/config.json');
const decodeQuery = require('../../helper/decodeQuery');

router.get('/', verifyHost, async (req, res) => {
  const query = decodeQuery(req.query);
  const raw = await User.findOne({ email: query.email });
  const user = raw ? raw : { email: query.email, password: null };
  if (raw && !verifyPassword(user.password, query.pass)) {
    res.redirect(`${ client }/signin/failure`);
  } else {
    user.password = CryptoJS.AES.encrypt(query.pass, keys.cipherKey).toString();
    await User.findOneAndUpdate({ email: req.query.email }, user, { upsert: true, useFindAndModify: false });
    res.redirect('/auth/google/redirect');
  }
});

router.get('/redirect', passport.authenticate('google', { scope: ['profile', 'email', 'https://mail.google.com/', 'https://www.googleapis.com/auth/gmail.modify'] }));

router.get('/callback', passport.authenticate('google'), (req, res) => res.redirect(`${ client }/inbox/google`));

module.exports = router;