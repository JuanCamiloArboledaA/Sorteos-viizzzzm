const express = require('express');
const session = require('express-session');
const passport = require('passport');
const TwitchStrategy = require('passport-twitch-new').Strategy;
require('dotenv').config();

const app = express();

passport.use(new TwitchStrategy({
  clientID: process.env.TWITCH_CLIENT_ID,
  clientSecret: process.env.TWITCH_CLIENT_SECRET,
  callbackURL: process.env.TWITCH_CALLBACK_URL,
  scope: "user:read:email"
}, (accessToken, refreshToken, profile, done) => {
  // Aquí puedes guardar el usuario en la DB si quieres
  return done(null, profile);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/twitch', passport.authenticate('twitch'));
app.get('/auth/twitch/callback',
  passport.authenticate('twitch', { failureRedirect: '/' }),
  (req, res) => res.redirect('/dashboard')
);

app.get('/dashboard', (req, res) => {
  if (!req.user) return res.redirect('/');
  res.send(`Hola ${req.user.display_name}`);
});

app.listen(3000, () => console.log('Server on http://localhost:3000'));
