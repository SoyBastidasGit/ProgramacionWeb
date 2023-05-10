var express = require("express"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	bodyParser = require("body-parser"),
	LocalStrategy = require("passport-local"),
 	passportLocalMongoose = require("passport-local-mongoose");
const User = require("./src/app/models/user");
const Components = require("./src/app/models/components");
const { encrypt, compare } = require('./src/app/models/bcrypt');

const path = require('path');
const { Script } = require("vm");
var app = express();

//Mantener sesion iniciada
var flagSession = false;

const session = require("express-session");
app.use(session({
	secret: "mysecret",
	saveUninitialized: true,
	resave: true,
  }));

mongoose.set('strictQuery', false);

// Conexion a MongoDB
mongoose.connect("mongodb+srv://SoyBastidas:SoyBastidas123@erp.a1ztdjx.mongodb.net/KeyboardTech?retryWrites=true&w=majority", {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

//Configuration
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

const emailRegex = /^\S+@\S+\.\S+$/; // expresión regular para validar un correo electrónico

app.post("/loaditem", async (req, res) => {
	try {
	} catch (err) { () => console.log(err) }
})

app.post("/register", async (req, res) => {
	try {
		const email = req.body.email;
		if (!emailRegex.test(email)) {
			// si el valor del campo "email" no es una dirección de correo electrónico válida
			res.locals.errorMsg = "¡Por favor ingrese una dirección de correo electrónico válida!";
			res.locals.iconMsg = "error";
			res.locals.iconColorMsg = "#FF0000";
			return res.status(400).render("register");
		}

		const passwordHash = await encrypt(req.body.password)

		const user = await User.create({
			email: email,
			password: passwordHash,
			nombre: req.body.nombre,
			tipo_empleado: req.body.tipo_empleado
		});
		// Redirecciona a dashboard luego de registrarse correctamente
		res.locals.errorMsg = "¡Usuario registrado con exito!";
		res.locals.iconMsg = "success";
		res.locals.iconColorMsg = "#008f39";
		res.status(400).render("login");
	} catch (err) {
		if (err.code === 11000) {
			// si el código de error es 11000 (duplicado de clave en índice único)
			res.locals.errorMsg = "¡El correo electrónico ya está registrado!";
			res.locals.iconMsg = "warning";
			res.locals.iconColorMsg = "#0000FF";
			return res.status(400).render("register");
		} else {
			// Muestra error durante el proceso de registro de usuario
			res.locals.errorMsg = "¡Hubo un error al registrar el usuario!";
			res.locals.iconMsg = "warning";
			res.locals.iconColorMsg = "#0000FF";
			return res.status(500).render("register");
		}
	}
});

//Showing login form
app.get("/login", function (req, res) {
	res.render("login");
});

//Handling user login
app.post("/login", async function (req, res) {
	try {
		const email = req.body.email;
		if (!emailRegex.test(email)) {
			// si el valor del campo "email" no es una dirección de correo electrónico válida
			res.locals.errorMsg = "¡Por favor ingrese una dirección de correo electrónico válida!";
			res.locals.iconMsg = "error";
			res.locals.iconColorMsg = "#FF0000";
			return res.status(400).render("login");
		}

		// check if the user exists
		const user = await User.findOne({ email: email });

		if (user) {
			//check if password matches
			const checkPassword = await compare(req.body.password, user.password)

			if (checkPassword) {
				flagSession = true;
				res.redirect("principal");
			} else {
				res.locals.errorMsg = "¡Contraseña no coincide!";
				res.locals.iconMsg = "error";
				res.locals.iconColorMsg = "#FF0000";
				res.status(400).render("login");
			}
		} else {
			res.locals.errorMsg = "¡Usuario no existe!";
			res.locals.iconMsg = "error";
			res.locals.iconColorMsg = "#FF0000";
			res.status(400).render("login");
		}
	} catch (error) {
		res.locals.errorMsg = "¡A ocurrido un error en el servidor!";
		res.locals.iconMsg = "error";
		res.locals.iconColorMsg = "#FF0000";
		res.status(400).render("login");
	}
});

app.get("/logout", isLoggedIn, function (req, res) {
	res.render("login");
});

//Handling user logout
app.post("/logout", isLoggedIn, function (req, res) {
	flagSession = false;
	req.logout(function (err) {
		if (err) { return next(err); }
		res.locals.errorMsg = "¡Cerraste Sesion!";
		res.locals.iconMsg = "warning";
		res.locals.iconColorMsg = "#0000FF";
		res.status(400).render("login");
	});
});

//Dashboard
app.get("/RBDash", isLoggedIn, function (req, res) {
	res.render("RBdash");
});

//Inventory
app.get("/Inventory", isLoggedIn, function (req, res) {
	res.render("Inventory");
});

//Work-Order
app.get("/Work-Order", isLoggedIn, function (req, res) {
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