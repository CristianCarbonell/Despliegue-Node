const mongoose = require('mongoose');

let usuarioSchema = new mongoose.Schema({
    usuario: {
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
})

let Usuario = mongoose.model('usuarios', usuarioSchema);
module.exports = Usuario;