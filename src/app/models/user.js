const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const { hashSync } = require('bcrypt');
const userSchema = new mongoose.Schema({
    local: {
        user: String,
        password: String
    }
});

userSchema.method.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.method.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);