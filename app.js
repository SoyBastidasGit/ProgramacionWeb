var express = require("express"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	bodyParser = require("body-parser"),
	LocalStrategy = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose");
const { session } = require("passport");
const User = require("./src/app/models/user");

const path = require('path');
var app = express();

var flagSession = false;

// Conexion a MongoDB
mongoose.connect("mongodb+srv://SoyBastidas:SoyBastidas123@erp.a1ztdjx.mongodb.net/LoginDB?retryWrites=true&w=majority");

//view engine
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("express-session")({
	secret: "mysecret", 
	resave: true,
	saveUninitialized: true
}));

//middlewares
passport.use(new LocalStrategy(User.authenticate()));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//static files
app.use(express.static(path.join(__dirname, 'src/public')));
app.use(express.static(path.join(__dirname, 'src/public/img')));

//Routes
// Muestra pagina principal 
app.get("/", function (req, res) {
	res.render("Login");
});

// Muestra principal despues de iniciar sesion
app.get("/principal", isLoggedIn, function (req, res) {
	res.render("principal");
});

// Registro
app.get("/register", function (req, res) {
	res.render("register");
});


app.post("/register", async (req, res) => {
	try {
		const user = await User.create({
			username: req.body.username,
			password: req.body.password
		});
		// Redirecciona a dashboard luego de registrarse correctamente
		res.redirect('/principal');
	} catch (err) {
		// Muestra error durante el proceso de registro de usuario
		res.status(500).send("A ocurrido un error con el registro de usuario.");
	}
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
			flagSession = true;
			res.redirect("principal");
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
app.post("/logout", function (req, res) {
	flagSession = false;
	req.logout(function(err) {
		if (err) { return next(err); }
		res.redirect('/login');
	});
});

//Dashboard
app.get("/RBDash", function (req, res) {
	res.render("RBdash");
});

//Inventory
app.get("/Inventory", function (req, res) {
	res.render("Inventory");
});

//Work-Order
app.get("/Work-Order", function (req, res) {
	res.render("Work-Order");
});

function isLoggedIn(req, res, next) {
	if (flagSession == true) {
		return next();
	} else {
		res.redirect("/login");
	}
}

//Listen port
var port = process.env.PORT || 4000;
app.listen(port, function () {
	console.log("Servidor iniciado!");
});