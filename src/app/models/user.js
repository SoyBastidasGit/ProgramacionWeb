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


/* const bcrypt = require('bcrypt-nodejs');
const { hashSync } = require('bcrypt');

User.method.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

User.method.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
}; */


User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User)
