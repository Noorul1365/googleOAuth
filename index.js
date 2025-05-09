require("dotenv").config();

const express = require("express");
const passport = require("passport");
const session = require("express-session");

const GoogleStrategy = require("passport-google-oauth20").Strategy;

const app = express();

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback",
      },
      (accessToken, refreshToken, profile, done) => {
        console.log(accessToken);
        console.log(refreshToken)
        console.log(profile);
        return done(null, profile);
      }
    )
);

app.get("/", (req, res) => {
    res.send("<a href='/auth/google'>Login with Google</a>");
});

app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
      res.redirect("/profile");
    }
);

app.get('/profile', (req, res) => {
    if (!req.isAuthenticated()) return res.redirect('/');
    res.send(`Welcome ${req.user.displayName}`);
});

app.get("/logout", (req, res) => {
    req.logout(() => {
      res.redirect("/");
    });
        });

app.listen(3000, () => {
    console.log(`Server is running at port 3000`);
});