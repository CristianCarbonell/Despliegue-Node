/* Librerías */

const express = require('express');
const mongoose = require('mongoose');

// Enrutadores
const recetas = require(__dirname + '/routes/recetas');
const auth = require(__dirname + '/routes/auth');
const usuarios = require(__dirname + '/routes/usuarios');

// Conexión a la BD 
mongoose.connect('mongodb://127.0.0.1:27017/recetas').then(()=>{
    console.log("Conexión correcta a la base de datos")
}).catch((error)=>{
    console.error("Error al conectar a la base de datos",error);
})

let app = express();

app.use(express.json());
app.use('/recetas', recetas);
app.use('/', auth);
app.use('/usuarios',usuarios);

app.listen(8080, () => {
    console.log("El servidor está corriendo en el puerto 8080");
});
