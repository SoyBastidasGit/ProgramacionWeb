var express = require("express"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	bodyParser = require("body-parser"),
	LocalStrategy = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose");
const User = require("./src/app/models/user");
const Components = require("./src/app/models/components");
const Orders = require("./src/app/models/orders");
const { encrypt, compare } = require('./src/app/models/bcrypt');

const path = require('path');
const { Script } = require("vm");
var app = express();

mongoose.set('strictQuery', false);

// Conexion a MongoDB
const URI = 'mongodb+srv://SoyBastidas:SoyBastidas123@erp.a1ztdjx.mongodb.net/KeyboardTech?retryWrites=true&w=majority';
mongoose.connect(URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

//Configuration
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.use(bodyParser.json()); // analiza el cuerpo de la solicitud JSON
app.use(bodyParser.urlencoded({ extended: true }));

//Mantener sesion iniciada
const session = require("express-session");
const MongoStore = require('connect-mongo');
const components = require("./src/app/models/components");

app.use(session({
	secret: "mysecret",
	resave: true,
	saveUninitialized: true,
	store: MongoStore.create({
		mongoUrl: URI,
		autoReconnect: true
	})
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
app.get("/", isLoggedIn, function (req, res) {
	res.redirect("Principal");
});

// Muestra principal despues de iniciar sesion
app.get("/principal", isLoggedIn, function (req, res) {
	res.render("principal");
});

// Registro
app.get("/register", function (req, res) {
	if (req.session.user) {
		return res.redirect("/principal");
	}
	res.render("register");
});

const emailRegex = /^\S+@\S+\.\S+$/; // expresión regular para validar un correo electrónico

app.post("/register", async (req, res) => {
	try {
		const email = req.body.email;
		if (!emailRegex.test(email)) {
			// si el valor del campo "email" no es una dirección de correo electrónico válida
			res.status(200).json({ message: "¡Por favor ingrese una dirección de correo electrónico válida!" });
		}

		const passwordHash = await encrypt(req.body.password)

		const user = await User.create({
			email: email,
			password: passwordHash,
			nombre: req.body.nombre,
			tipo_empleado: req.body.tipo_empleado
		});
		res.status(200).json({ success: true, message: "¡Usuario registrado con exito!" });
	} catch (err) {
		if (err.code === 11000) {
			res.status(200).json({ message: "¡El correo electrónico ya está registrado!" });
		} else {
			res.status(200).json({ message: "¡Hubo un error al registrar el usuario!" });
		}
	}
});

//Showing login form
app.get("/login", function (req, res) {
	if (req.session.user) {
		return res.redirect("/principal");
	}
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
				req.session.user = req.body.email;
				res.status(200).json({ success: true });
			} else {
				res.status(200).json({ message: "¡Contraseña no coincide!" });
			}
		} else {
			res.status(200).json({ message: "¡Usuario no existe!" });
		}
	} catch (error) {
		res.status(200).json({ message: "¡A ocurrido un error en el servidor!" });
	}
});

app.get("/logout", isLoggedIn, function (req, res) {
	res.render("login");
});

//Handling user logout
app.post("/logout", isLoggedIn, function (req, res) {
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

//Formulario captura de inventario
app.post("/loaditem", async (req, res) => {
	try {
		//verifica si existe un item igual al que se intenta guardar y se actualiza
		const item = await Components.updateOne({
			modelo: req.body.ItemModel,
			tipo: req.body.ItemType
		}, {
			$inc: {
				cantidad: req.body.ItemQuantity
			}
		});

		if (item.modifiedCount === 0) {
			//guarda item en base de datos
			const item = await Components.create({
				nombre: req.body.ItemName,
				descripcion: req.body.ItemDesc,
				marca: req.body.ItemBrand,
				modelo: req.body.ItemModel,
				cantidad: req.body.ItemQuantity,
				precio_unitario: req.body.ItemPrice,
				tipo: req.body.ItemType
			});
			res.status(200).json({ success: true, message: "¡Componente registrado con exito!" });
		} else {
			res.status(200).json({ message: "¡Componente actualizado con exito!" });
		}
	} catch (err) {
		// Muestra error
		res.status(200).json({ message: "¡Hubo un error con el servidor!" });
	}
});

//Formulario captura de ordenes nuevas
app.post("/loadorder", async (req, res) => {
	try {
		//guarda order en base de datos
		const order = await Orders.create({
			folio: req.body.WOfolioId,
			cliente: req.body.WOclientId,
			fecha: req.body.WOdateId,
			empaque: req.body.WOempaqueId,
			case: req.body.WOcaseId,
			plates: req.body.WOplatesId,
			leds: req.body.WOledsId,
			diodos: req.body.WOdiodosId,
			estabilizadores: req.body.WOstabsId,
			switches: req.body.WOswitchesId,
			teclas: req.body.WOteclasId,
			cables: req.body.WOcablesId,
			bateria: req.body.WObateriaId,
			microcontrolador: req.body.WOmicroId,
			extras: req.body.WOextrasId,
			status: 'produccion'
		});
		res.status(200).json({ success: true, message: "Orden registrada con exito!" });
	} catch (err) {
		// Muestra error
		res.status(200).json({ message: "¡Hubo un error con el servidor!" });
	}
});

/* Obtiene lista de componentes*/
app.get('/componentsList', async (req, res) => {
	const components = await Components.find();
	const simplifiedComponents = components.map(component => {
		return {
			nombre: component.nombre,
			modelo: component.modelo,
			cantidad: component.cantidad,
			tipo: component.tipo
		};
	});
	res.json(simplifiedComponents);
});

/* Obtiene lista de ordenes */
app.get('/ordersList', async (req, res) => {
	const orders = await Orders.find();
	const simplifiedOrders = orders.map(order => {
		return {
			folio: order.folio,
			cliente: order.cliente,
			fecha: order.fecha,
			empaque: order.empaque,
			case: order.case,
			plates: order.plates,
			leds: order.leds,
			diodos: order.diodos,
			estabilizadores: order.estabilizadores,
			switches: order.switches,
			teclas: order.teclas,
			cables: order.cables,
			bateria: order.bateria,
			microcontrolador: order.microcontrolador,
			extras: order.extras,
			status: order.status
		};
	});
	res.json(simplifiedOrders);
});

//Order
app.get("/Order", isLoggedIn, function (req, res) {
	res.render("order");
});

//Actualizar order
app.post("/orderUpdate", async (req, res) => {
	try {
		//verifica si existe un item igual al que se intenta actualizar
		const order = await Orders.updateOne({
			folio: req.body.folioCell
		}, {
			$set: {
				empaque: req.body.empaqueInput,
				case: req.body.caseInput,
				plates: req.body.platesInput,
				leds: req.body.ledsInput,
				diodos: req.body.diodosInput,
				estabilizadores: req.body.estabilizadoresInput,
				switches: req.body.switchesInput,
				teclas: req.body.teclasInput,
				cables: req.body.cablesInput,
				batería: req.body.bateriaInput,
				microcontrolador: req.body.microcontroladorInput,
				extras: req.body.extrasInput,
				status: req.body.statusInput
			}
		});
		res.status(200).json({ success: true, message: "Orden actualizada con exito!" });
	} catch (err) {
		// Muestra error
		console.log(err);
		res.status(200).json({ message: "¡Hubo un error con el servidor!" });
	}
});

//Funciones
function isLoggedIn(req, res, next) {
	if (req.session.user) {
		next();
	} else {
		res.redirect('/login');
	}
}

//Listen port
var port = process.env.PORT || 4000;
app.listen(port, function () {
	console.log("Servidor iniciado!");
});