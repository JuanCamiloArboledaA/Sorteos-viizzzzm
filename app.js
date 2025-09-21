const express = require('express');
const session = require('express-session');
const passport = require('passport');
const TwitchStrategy = require('passport-twitch-new').Strategy;
require('dotenv').config();

const app = express();

// Sessions (Vercel is stateless: cookie-only demo; for prod use a persistent store)
app.use(session({
  secret: process.env.SESSION_SECRET || 'change-me',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: 'auto', sameSite: 'lax' }
}));

passport.use(new TwitchStrategy({
  clientID: process.env.TWITCH_CLIENT_ID,
  clientSecret: process.env.TWITCH_CLIENT_SECRET,
  callbackURL: process.env.TWITCH_CALLBACK_URL,
  scope: "user:read:email"
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (_req, res) => res.send('OK - sorteos viizzzm'));

app.get('/auth/twitch', passport.authenticate('twitch'));

app.get('/auth/twitch/callback',
  passport.authenticate('twitch', { failureRedirect: '/' }),
  (req, res) => res.redirect('/dashboard')
);

app.get('/dashboard', (req, res) => {
  if (!req.user) return res.redirect('/');
  res.send(`Hola ${req.user.display_name}`);
});

module.exports = app;