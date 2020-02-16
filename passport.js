const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const { google } = require('./config/apis.json');
const User = require('./models/user');

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => done(null, user));
});

const accessToken = new Promise(resolve => passport.use(new GoogleStrategy(google, (accessToken, refreshToken, profile, done) => {
  User.findOne({ googleID: profile.id }).then(currentUser => {
    if (currentUser) {
      done(null, currentUser);
    } else {
      new User({
        name: profile.displayName,
        googleID: profile.id,
        email: profile.emails[0].value
      }).save().then(newUser => done(null, newUser));
    }
  });
  resolve(accessToken);
})));

module.exports = accessToken;