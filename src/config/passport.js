const localStrategy = require('passport-local').Strategy;

const user = require('../app/models/user');

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    }); 

    passport.deserializeUser(async function (id, done) {
        await user.findById(id, function(err, user){
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
    
    app.post("/login", async function(req, res){
        try {
            // validar si el usuario existe
            const user = await user.findOne({ username: req.body.username });
            if (user) {
              // validar si la contra hace match
              const result = req.body.password === user.password;
              // si es correcta regresar a home
              if (result) {
                res.render("index");
              } else {
                res.status(400).json({ error: "Contraseña incorrecta" });
              }
            } else {
              res.status(400).json({ error: "Usuario no existe" });
            }
          } catch (error) {
            res.status(400).json({ error });
          }
    });
}