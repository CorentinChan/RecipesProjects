const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
require("dotenv").config();

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// --- Google Strategy ---
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      console.log("Google profile:", profile);
      return done(null, profile);
    }
  )
);

// --- Facebook Strategy ---
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "/auth/facebook/callback",
      profileFields: ["id", "displayName", "photos", "email"],
    },
    (accessToken, refreshToken, profile, done) => {
      console.log("Facebook profile:", profile);
      return done(null, profile);
    }
  )
);

const InstagramStrategy = require("passport-instagram").Strategy;

// --- Instagram Strategy ---
passport.use(
  new InstagramStrategy(
    {
      clientID: process.env.INSTAGRAM_CLIENT_ID,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
      callbackURL: "/auth/instagram/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      console.log("Instagram profile:", profile);
      return done(null, profile);
    }
  )
);

