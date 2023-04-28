const express = require('express');
const app = new express();

  const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyparser = require('body-parser');
const session = require('express-session');

const { url } = require('./config/database');

mongoose.connect(url, {
  useNewUrlParser: true
});

require('./config/passport')(passport);

//settings
app.set('port', process.env.PORT || 4000)
app.set('views', path.join(__dirname, 'views'));
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
require('./app/routes')(app, passport);

//static files
app.use(express.static(path.join(__dirname, 'public')));


app.listen(app.get('port'), () => {
    console.log('Aplicacion corriendo en puerto: ', app.get('port'));
})

module.exports = app;