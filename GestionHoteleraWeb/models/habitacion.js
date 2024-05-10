/* Esquema de las incidencias registradas en las habitaciones */

const mongoose = require("mongoose");

let incidenciaSchema = new mongoose.Schema({
    /* descripción de la incidencia: no funciona el aire acondicinado, etc */
    descripcion: {
        type: String,
        trim: true, 
        required: [true, 'Es necesario indicar una descripción de la incidencia']
    },
    /* fecha en la que se registra la incidencia */     
    inicio: {
        type: Date,
        required: true,
        default: Date.now
    }, 
    /* fecha en la que se resuelve la incidencia */
    fin: {
        type: Date, 
        required: false
    },
    imagen:{
        type: String
    }
});

/* Esquema y modelo que representa cada habitación del hotel.*/

let habitacionSchema = new mongoose.Schema({
    /* número de habitación */
    numero: {
        unique:true,
        type: Number,
        required: [true, 'Es necesario indicar el número de habitación'],
        min: [1, 'El número de habitación tiene que ser mayor que 0'],
        max: [50, 'El número de habitación tiene que ser menor que 50'],        
    },
    /* tipo de habitación */
    tipo: {
        type: String,
        required: [true, 'Es necesario indicar el tipo de habitación'],
        enum: ["individual", "doble", "familiar", "suite"]
    },        
    /* descripción de la habitación: número de camas, tipo de cama, si tiene terraza, si tiene vistas, televisor, etc */
    descripcion: {
        type: String,
       required: [true, 'Es necesario indicar una descripción de la habitación'],
        trim: true
    }, 
    /* fecha de la última limpieza */
    ultimaLimpieza: {
        type: Date,
        required: true,
        default: Date.now
    },    
    /* precio de la habitación por noche */
    precio: {
        type: Number,
        required: [true, 'Es necesario indicar el precio de la habitación'],
        min: [0, 'El precio mínimo debe ser mayor que 0'],
        max: [300, 'El precio máximo no puede exceder de 300']
    },
    imagen:{
        type:String
    },
    /* Array de incidencias producidas en la habitación */
    incidencias: [incidenciaSchema]
});

let Habitacion = mongoose.model('habitaciones', habitacionSchema);

module.exports = Habitacion;