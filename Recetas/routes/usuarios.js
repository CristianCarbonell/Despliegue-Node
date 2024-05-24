const express = require('express');
let Usuario = require(__dirname + '/../models/Usuario');
const router = express.Router();

router.post('/',(req,res)=>{
    let nuevoUsuario = new Usuario({
        usuario: req.body.usuario,
        password: req.body.password
    });
    nuevoUsuario.save().then(resultado =>{
        res.status(200)
            .send({ok: true, resultado: resultado});
    }).catch(error => {
        res.status(400)
        .send({ok: false,
        error: "Error añadiendo usuario"});
    })
})

module.exports = router;