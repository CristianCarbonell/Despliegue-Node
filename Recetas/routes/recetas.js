const express = require('express');
const auth = require(__dirname + '/../auth/auth.js');

let Receta = require(__dirname + '/../models/receta.js');
let router = express.Router();

// Servicio para listar todas las recetas

router.get('/', (req, res) => {
    Receta.find().then(resultado => {
        if(resultado.length === 0) {
            res.status(500).send({ok: false, error: "No se encontraron recetas"});
        } else {
            res.status(200).send({ok: true, resultado: resultado});
        }
    }).catch (error => {
        res.status(500).send({ok: false, error: "Error obteniendo recetas"});
    });
});


// Servicio para mostrar una receta a partir de su id.

router.get('/:id', (req, res) => {
    Receta.findById(req.params.id).then(resultado => {
        if(resultado)
            res.status(200)
               .send({ok: true, resultado: resultado});
        else
            res.status(400)
               .send({ok: false, 
                      error: "Receta no encontrada"});
    }).catch (error => {
        res.status(400)
           .send({ok: false, 
                  error: "Error obteniendo receta"});
    }); 
});

// Servicio para añadir una nueva receta

router.post('/',auth.protegerRuta('admin'), (req, res) => {
    let nuevaReceta = new Receta({
        titulo: req.body.titulo,
        comensales:req.body.comensales,
        preparacion:req.body.preparacion,
        coccion:req.body.coccion,
        descripcion:req.body.descripcion
    });

    nuevaReceta.save().then(resultado => {
        res.status(200)
           .send({ok: true, resultado: resultado});
    }).catch(error => {
        res.status(400)
           .send({ok: false, 
                  error: "Error insertando receta"});
    });
});

// Servicio para modificar una receta

router.put('/:id',auth.protegerRuta('admin'), (req, res) => {

    Receta.findByIdAndUpdate(req.params.id, {
        $set: {
            titulo: req.body.titulo,
            comensales:req.body.comensales,
            preparacion:req.body.preparacion,
            coccion:req.body.coccion,
            descripcion:req.body.descripcion,
        }
    }, {new: true}).then(resultado => {
        if(resultado)
        res.status(200)
           .send({ok: true, resultado: resultado});
        else
            res.status(400)
                .send({ok: false,
                    error:"No se encontró la receta para actualizar"});
    }).catch(error => {
        res.status(403)
           .send({ok: false, 
                  error:"Error modificando receta"});
    });
});


// Servicio para modificar los ingredientes de una receta a partir de su id.

router.post('/elementos/:id', auth.protegerRuta('admin'), (req, res) => {
    Receta.findByIdAndUpdate(req.params.id, {
        $push: {
            ingredientes: {
                nombre: req.body.nombre,
                cantidad: req.body.cantidad,
                unidad: req.body.unidad
            }
        }
    }, { new: true, runValidators: true }).then(resultado => {
        if(resultado)
        res.status(200).send({ok: true, resultado: resultado});
        else
            res.status(400).send({ok: false, error: "No se encontró la receta para añadir ingredientes"});
    }).catch(error => {
        res.status(403).send({ok: false, error: "Error modificando los ingredientes de la receta"});
    });
});


// Servicio para borra una receta

router.delete('/:id',auth.protegerRuta('admin'), (req, res) => {

    Receta.findByIdAndDelete(req.params.id)
    .then(resultado => {
        if(resultado)
        res.status(200)
           .send({ok: true, resultado: resultado});
        else
            res.status(400)
                .send({ok: false,
                    error:"No se encontró la receta para eliminar"});
    }).catch(error => {
        res.status(403)
           .send({ok: false, 
                  error:"Error eliminando receta"});
    });
});


module.exports = router;