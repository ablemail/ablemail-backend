const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const { google } = require('../config/apis.json');
const User = require('../models/user');

passport.serializeUser((user, done) => done(null, user.user.id));

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => done(null, user));
});

passport.use(new GoogleStrategy(google, (accessToken, refreshToken, profile, done) => {
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
      }).save().then(newUser => done(null, { user: newUser, accessToken }));
    }
  });
}));