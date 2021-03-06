const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const LocalStrategy = require('passport-local');
const User = require('../models/user');
const verifyPassword = require('./verifyPassword');

const PRODUCTION = process.env.NODE_ENV === 'production';

const { google } = PRODUCTION ? {
  google: {
    clientID: process.env.GOOGLE_CLIENTID,
    clientSecret: process.env.GOOGLE_CLIENTSECRET,
    callbackURL: process.env.GOOGLE_CALLBACKURL
  }
} : require('../config/config.json');

passport.serializeUser(({ user, accessToken }, done) => done(null, { id: user.id, accessToken }));

passport.deserializeUser(({ id, accessToken }, done) => User.findById(id).then(user => done(null, { user, accessToken })));

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
      }).save().then(newUser => done(null, { newUser, accessToken }));
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