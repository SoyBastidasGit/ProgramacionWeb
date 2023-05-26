const mongoose = require('mongoose')
const Schema = mongoose.Schema

const passportLocalMongoose = require('passport-local-mongoose');

var Orders = new Schema({
    "folio": Number,
    "cliente": String,
    "fecha": Date,
    "Empaque": String,
    "case": Boolean,
    "plates": Boolean,
    "leds": Boolean,
    "diodos": Boolean,
    "estabilizadores": Boolean,
    "switches": Boolean,
    "teclas": Boolean,
    "cables": Boolean,
    "bateria": Boolean,
    "microcontrolador": Boolean,
    "extras": String
});

module.exports = mongoose.model('Orders', Orders)