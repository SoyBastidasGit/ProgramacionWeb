const mongoose = require('mongoose')
const Schema = mongoose.Schema

const passportLocalMongoose = require('passport-local-mongoose');

var Orders = new Schema({
    "folio": Int16Array,
    "cliente": String,
    "fecha": Date,
    "Empaque": ,
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