const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const MicrosoftStrategy = require('passport-microsoft').Strategy;

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const userProfile = {
        id: profile.id,
        email: profile.emails[0].value,
        displayName: profile.displayName,
        provider: 'google'
      };
      return done(null, userProfile);
    } catch (error) {
      return done(error, null);
    }
  }
));

// Microsoft OAuth Strategy
passport.use(new MicrosoftStrategy({
    clientID: process.env.MICROSOFT_CLIENT_ID,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
    callbackURL: process.env.MICROSOFT_CALLBACK_URL,
    scope: ['user.read']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const userProfile = {
        id: profile.id,
        email: profile.emails[0].value,
        displayName: profile.displayName,
        provider: 'microsoft'
      };
      return done(null, userProfile);
    } catch (error) {
      return done(error, null);
    }
  }
));

module.exports = passport;
