const mongoose = require('mongoose')
const Schema = mongoose.Schema

const passportLocalMongoose = require('passport-local-mongoose');

var Components = new Schema({
    "nombre": String,
    "descripcion": String,
    "marca": String,
    "modelo": String,
    "cantidad": Number,
    "precio_unitario": Number,
    "tipo": String
});

module.exports = mongoose.model('Components', Components)