const mongoose = require('mongoose');

let usuarioSchema = new mongoose.Schema({
    usuario: {
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    rol:{
        type:String,
        enum:["normal","admin"]
    }
})

let Usuario = mongoose.model('usuarios', usuarioSchema);
module.exports = Usuario;