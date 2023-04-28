module.exports = (app, passport) => {

    app.get('/', (req, res) => {
        res.render('index')
    });

    app.get('/index', (req, res) => {
        res.render('index', {
            message: req.flash('loginMessage')
        });
    });

    app.post('/index', passport.authenticate('local-login', {
        successRedirect: '/dashboard',
        failureRedirect: '/index',
        failureflash: true
    }));

    app.get('/dashboard', isLoggedIn, (req, res) => {
        res.render('dashboard', {
            user: req.user
        });
    });

    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });
};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/');
}