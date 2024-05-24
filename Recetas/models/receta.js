const mongoose = require('mongoose');

let  ingredienteSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        minlength: 2,
        trim: true
    },
    cantidad: {
        type: Number,
        required: true,
        min:1
    },
    unidad: {
        type:String,
        enum: ['gr', 'cucharadas', 'unidades'],
    }
});

let  recetaSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        minlength: 5,
        trim: true
    },
    comensales: {
        type: Number,
        required: true,
        min:1
    
    },
    preparacion: {
       type:Number,
       required:true,
       min:1
    },
    coccion: {
       type:Number,
       required:true,
       min:0
    },
    descripcion: {
        type:String,
        required:true
    },
    ingredientes: [ingredienteSchema]

});


let Receta = mongoose.model('recetas', recetaSchema);
module.exports = Receta;