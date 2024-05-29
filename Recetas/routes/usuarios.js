const express = require('express');
let Usuario = require(__dirname + '/../models/usuario');
const router = express.Router();

router.get('/', (req, res) => {
    Usuario.find().then((resultado) => {
        res.status(200)
            .send({ok: true,resultado:resultado})
    }).catch((error) => {
        res.status(400)
            .send({ok: false,
            error: "Error obteniendo usuarios"})
    })
})

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

router.put('/',(req,res)=>{
    Usuario.findByIdAndUpdate(req.params.id, {
    $set:{
        usuario: req.body.usuario,
        password: req.body.password
    }
    },{new: true}).then(resultado =>{
        res.status(200)
        .send({ok: true, resultado: resultado});
    }).catch(error => {
        res.status(400)
        .send({ok: false,
        error:"Error modificando usuario"})
    })
})

router.delete('/',(req,res)=>{
    Usuario.findByIdAndDelete(req.params.id)
    .then(resultado =>{
        res.status(200)
        .send({ok: true, resultado: resultado});
    }).catch(error => {
        res.status(400)
        .send({ok: false,
        error:"Error borrando usuario"});
    })
})

module.exports = router;
