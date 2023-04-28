const express = require('express');
const app = express();

const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyparser = require('body-parser');
const session = require('express-session');
const LocalStrategy = require("passport-local");

const { url } = require('./src/config/database');

mongoose.connect(url, {
  useNewUrlParser: true
});

require('./src/config/passport')(passport);

//settings
app.set('port', process.env.PORT || 4000)
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

//middlewares
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyparser.urlencoded({extended: false}));
app.use(session({
  secret: 'SoyBastidas',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//routes
require('./src/app/routes')(app, passport);

//static files
app.use(express.static(path.join(__dirname, 'src/public')));

//Listen port
app.listen(app.get('port'), () => {
    console.log('Aplicacion corriendo en puerto: ', app.get('port'));
})

module.exports = app;