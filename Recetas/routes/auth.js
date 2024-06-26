const express = require('express');
const auth = require(__dirname + '/../auth/auth');
let Usuario = require(__dirname + '/../models/usuario');

let router = express.Router();


router.post('/login', (req, res) => {
    let usuario = req.body.usuario;
    let password = req.body.password;

    Usuario.findOne({usuario: usuario,password:password})
        .then(usuarioEncontrado =>{
        if(usuarioEncontrado){
            res.status(200)
                .send({ok: true, token: auth.generarToken(usuarioEncontrado.usuario,usuarioEncontrado.rol)});
        } else
            res.status(400)
            .send({ok: false,
            error: "Usuario o contraseña incorrectos"});
        }).catch(error => {
            res.status(400)
                .send({ok: false,
                error: "Error obteniendo usuario"})
    })
})

module.exports = router;
