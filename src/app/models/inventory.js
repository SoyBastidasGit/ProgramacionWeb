const mongoose = require('mongoose')
const Schema = mongoose.Schema

const passportLocalMongoose = require('passport-local-mongoose');

var Item = new Schema({
	// email: {
	// 	type: String,
	// 	unique: true
	//   },
	// password: {
	// 	type: String
	//   },
	// nombre: {
	// 	type: String
	//   },
	// tipo_empleado: {
	// 	type: String
	//   }
});

module.exports = mongoose.model('User', User)