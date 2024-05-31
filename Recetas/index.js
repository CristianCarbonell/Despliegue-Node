/* Librerías */

const express = require('express');
const mongoose = require('mongoose');

const dotenv = require("dotenv")
dotenv.config();

// Enrutadores
const recetas = require(__dirname + '/routes/recetas');
const auth = require(__dirname + '/routes/auth');
const usuarios = require(__dirname + '/routes/usuarios');

// Conexión a la BD 
mongoose.connect(process.env.URLBD).then(()=>{
    console.log("Conexión correcta a la base de datos")
}).catch((error)=>{
    console.error("Error al conectar a la base de datos",error);
})

let app = express();

app.use(express.json());
app.use('/recetas', recetas);
app.use('/', auth);
app.use('/usuarios',usuarios);

app.get('/', (req, res) => {
    res.redirect('/recetas');
});

app.listen(process.env.PUERTO, () => {

    console.log(`El servidor esta corriendo en el puerto ${process.env.URLSERVER}:${process.env.PUERTO}`);
});


 //Con el puerto 0, se busca automáticamente el puerto que este disponible
 // Útil cuando hay conflicto de puertos y estamos en modo desarrollo

/*
let server = app.listen(0, () => {
    let port = server.address().port;
    console.log(`El servidor está corriendo en el puerto http://localhost:${port}`);
})
*/
