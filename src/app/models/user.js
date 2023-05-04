const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
	username: {
		type: String
	},
	password: {
		type: String
	}
})

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User)

//hash

/* const bcrypt = require('bcrypt-nodejs');
const { hashSync } = require('bcrypt');

userSchema.method.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.method.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
}; */