const localStrategy = require('passport-local').Strategy;

const User = require('../app/models/user');

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    }); 

    passport.deserializeUser(async function (id, done) {
        await User.findById(id, function(err, user){
            done(err, user);
        });
    });

//login
/*     passport.use('local-login', new localStrategy({
       usernameField: 'user',
       passwordField: 'password',
       passReqToCallback: true 
    },
    function (req, user, password, done) {
        User.findOne({'local.user': user}, function (err, user) {
            if (err) {return done(err); }
            if (!user) {
                return done(null, false, req.flash('loginMessage', 'El usuario no existe.'));
            }
            if (!user.validatePassword(password)) {
                return done(null, false, req.flash('loginMessage', 'El password no coincide.'));
            }
            return done(null, user);
        });
    })); */

    passport.use('local-login', new localStrategy({
        usernameField: 'user',
        passwordField: 'password',
        passReqToCallback: true
    },
    function (req, user, password, done) {
        User.findOne({'local.user': user}).exec()
            .then(user => {
                if (!user) {
                    return done(null, false, req.flash('loginMessage', 'El usuario no existe.'));
                }
                if (!user.validatePassword(password)) {
                    return done(null, false, req.flash('loginMessage', 'El password no coincide.'));
                }
                return done(null, user);
            })
            .catch(err => {
                return done(err);
            });
    }));
}