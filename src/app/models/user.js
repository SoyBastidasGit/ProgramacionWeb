const mongoose = require('mongoose')
const Schema = mongoose.Schema

const passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
	email: {
		type: String,
		unique: true
	  },
	password: {
		type: String
	  }
});

User.plugin(passportLocalMongoose, { usernameField: 'email', autoIndex: false });

module.exports = mongoose.model('User', User)