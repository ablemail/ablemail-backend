const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const LocalStrategy = require('passport-local');
const { google } = require('../config/apis.json');
const User = require('../models/user');
const CryptoJS = require('crypto-js');
const { cipherKey } = require('../config/key.json');

const verifyPassword = (savedPass, password) => password === CryptoJS.AES.decrypt(savedPass, cipherKey).toString(CryptoJS.enc.Utf8);

passport.serializeUser((user, done) => done(null, user.user.id));

passport.deserializeUser((id, done) => User.findById(id).then(user => done(null, user)));

passport.use('google', new GoogleStrategy(google, (accessToken, refreshToken, profile, done) => {
  User.findOne({ email: profile.emails[0].value }).then(async currentUser => {
    if (currentUser) {
      if (!currentUser.name) {
        currentUser.name = profile.displayName;
        await User.findByIdAndUpdate(currentUser.id, currentUser, { useFindAndModify: false });
      }
      done(null, { user: currentUser, accessToken });
    } else {
      new User({
        name: profile.displayName,
        email: profile.emails[0].value
      }).save().then(newUser => done(null, newUser));
    }
  });
}));

passport.use('local', new LocalStrategy((username, password, done) => {
  User.findOne({ email: username }).then(user => {
    if (!user) return done(null, false);
    if (!verifyPassword(user.password, password)) return done(null, false);
    return done(null, { user });
  });
}));

module.exports = verifyPassword;