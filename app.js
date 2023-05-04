var express = require("express"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	bodyParser = require("body-parser"),
	LocalStrategy = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose");
const User = require("./src/app/models/user");

const path = require('path');
var app = express();

mongoose.connect("mongodb+srv://SoyBastidas:SoyBastidas123@erp.a1ztdjx.mongodb.net/LoginDB?retryWrites=true&w=majority");

//view engine
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

/* app.set("view engine", "ejs"); */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("express-session")({
	secret: "Rusty is a dog", 
	resave: false,
	saveUninitialized: false
}));

//middlewares
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//static files
app.use(express.static(path.join(__dirname, 'src/public')));

//Routes
// Showing home page
app.get("/", function (req, res) {
	res.render("Login");
});

// Showing secret page
app.get("/dashboard", isLoggedIn, function (req, res) {
	res.render("dashboard");
});

app.get("/register", function (req, res) {
	res.render("register");
});

// Handling user signup
app.post("/register", async (req, res) => {
	const user = await User.create({
	username: req.body.username,
	password: req.body.password
	});
	
	return res.status(200).json(user);
});

//Showing login form
app.get("/login", function (req, res) {
	res.render("login");
});

//Handling user login
app.post("/login", async function(req, res){
	try {
		// check if the user exists
		const user = await User.findOne({ username: req.body.username });
		if (user) {
		//check if password matches
		const result = req.body.password === user.password;
		if (result) {
			res.render("dashboard");
		} else {
			res.status(400).json({ error: "Constraseña no coincide!" });
		}
		} else {
		res.status(400).json({ error: "Usuario no existe" });
		}
	} catch (error) {
		res.status(400).json({ error });
	}
});

//Handling user logout
app.get("/logout", function (req, res) {
	req.logout(function(err) {
		if (err) { return next(err); }
		res.redirect('/');
	});
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) return next();
	res.redirect("/login");
}

//Listen port
var port = process.env.PORT || 4000;
app.listen(port, function () {
	console.log("Servidor iniciado!");
});