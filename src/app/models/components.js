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
    "tipo": {
      "Case": Boolean,
      "Plates": Boolean,
      "PCB": Boolean,
      "Leds": Boolean,
      "Diodos": Boolean,
      "Estabilizadores": Boolean,
      "Switches": Boolean,
      "Teclas": Boolean,
      "Cables": Boolean,
      "Baterias": Boolean,
      "Microcontroladores": {
        "nombre": String
      }
    }
  });

module.exports = mongoose.model('Components', Components)