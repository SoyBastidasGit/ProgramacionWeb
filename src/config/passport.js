const express = require("express");

const app = express();

const localStrategy = require('passport-local').Strategy;

const User = require('../app/models/user');

module.exports = async function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    }); 

    passport.deserializeUser(async function (id, done) {
        await User.findById(id, function(err, user){
            done(err, user);
        });
    });

//login
 /*    passport.use('local-login', new localStrategy({
       usernameField: 'user',
       passwordField: 'password',
       passReqToCallback: true 
    },
    function (req, user, password, done) {
        User.findOne({'local.user': user}, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, req.flash('loginMessage', 'El usuario no existe.'));
            }
            if (!user.validatePassword(password)) {
                return done(null, false, req.flash('loginMessage', 'El password no coincide.'));
            }
            return done(null, user);
        });
    })); */

    app.post("/login", async function(req, res){
        try {
            // check if the user exists
            const user = await User.findOne({ username: req.body.username });
            if (user) {
              //check if password matches
              const result = req.body.password === user.password;
              if (result) {
                res.render("Dashboard");
              } else {
                res.status(400).json({ error: "password doesn't match" });
              }
            } else {
              res.status(400).json({ error: "User doesn't exist" });
            }
          } catch (error) {
            res.status(400).json({ error });
          }
    });
}