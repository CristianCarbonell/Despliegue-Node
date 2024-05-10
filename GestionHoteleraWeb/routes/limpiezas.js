/* Librerías */
const express = require("express");
const moment = require('moment');
const auth = require(__dirname + '/../utils/auth.js');
let Habitacion = require(__dirname + "/../models/habitacion");
let Limpieza = require(__dirname + "/../models/limpieza");
let router = express.Router();

/* Listado de todas las limpiezas de una habitación */
router.get("/:id", (req, res) => {
  Limpieza.find({ habitacion: req.params.id }).sort('-fecha')
    .then((limpiezas) => {
      Habitacion.findById(req.params.id)
        .then((habitacion) => {
          if (!habitacion) {
            throw new Error("No se encontró la habitación");
          } else {
            res.render('limpiezas_listado', { limpiezas: limpiezas, habitacion: habitacion });
          }
        })
        .catch((err) => {
          res.render('error', { error: err.message });
        });
    })
    .catch((err) => {
      res.render('error', { error: err.message });
    });
});




/* Inserción de limpieza */
router.get('/nueva/:id',auth.autenticacion, (req, res) => {
  Habitacion.findById(req.params.id)
    .then((habitacion) => {
      if (!habitacion) {
        throw new Error("No se encontró la habitación");
      } else {
        let fechaActual = moment().format('YYYY-MM-DD');
        res.render('limpiezas_nueva', { habitacion: habitacion, fechaActual: fechaActual });
      }
    })
    .catch((err) => {
      res.render('error', { error: err.message });
    });
});


/* Añadir limpieza */
router.post('/:id', auth.autenticacion, (req, res) => {
  let limpieza = new Limpieza({
    habitacion: req.params.id,
    observaciones: req.body.observaciones,
    fecha: Date.now() 
  });

  limpieza.save()
    .then(resultado => {
      // Actualiza la fecha de la última limpieza de la habitación
      return Habitacion.findByIdAndUpdate(req.params.id, { ultimaLimpieza: Date.now() });
    })
    .then(resultado => {
      res.redirect(`/limpiezas/${req.params.id}`);
    })
    .catch(error => {
      res.render('error', { error: "Error añadiendo la limpieza" });
    });
});




module.exports = router;