const mongoose = require('mongoose')
const Schema = mongoose.Schema

const passportLocalMongoose = require('passport-local-mongoose');

var Inventory = new Schema({
    "nombre": String,
    "descripcion": String,
    "marca": String,
    "modelo": String,
    "cantidad": Number,
    "precio_unitario": Number,
    "imagen": String,
    "tipo": {
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
    },
    "fecha_creacion": Date
  });

module.exports = mongoose.model('Inventory', Inventory)