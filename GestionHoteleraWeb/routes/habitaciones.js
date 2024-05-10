/* Librerías */
const express = require("express");
const auth = require(__dirname + '/../utils/auth.js');
const upload = require(__dirname + '/../utils/uploads.js');
let Habitacion = require(__dirname + "/../models/habitacion");
let Limpieza = require(__dirname + "/../models/limpieza");

let router = express.Router();

/* Listado de todas las habitaciones */

router.get('/', (req, res) => {
  Habitacion.find().then(resultado => {
    res.render('habitaciones_listado', { habitaciones: resultado });
  }).catch(error => {
    res.render('error', { error: 'Error listando habitaciones' });
  });
});


/* Inserción de habitación */
router.get('/nueva',auth.autenticacion, (req, res) => {
  res.render('habitaciones_nueva');
});

router.get('/:id', (req, res) => {
  Habitacion.findById(req.params.id).then(resultado => {
    if (resultado)
      res.render('habitaciones_ficha', { habitacion: resultado });
    else
      res.render('error', { error: "Habitación no encontrada" });
  }).catch(error => {
  });
});


/* Inserción de habitación */
router.post('/', auth.autenticacion, upload.uploadHabitaciones.single('imagen'), async (req, res) => {
  try {
    // Verificar si ya existe una habitación con el mismo número
    let habitacionExistente = await Habitacion.findOne({ numero: req.body.numero });
    if (habitacionExistente) {
      // Si existe, preparar el mensaje de error
      let errores = {
        numero: 'Ya existe una habitación con ese número. Por favor, prueba con otro.'
      };
      // Renderizar la misma página con el mensaje de error
      res.render('habitaciones_nueva', { errores: errores, datos: req.body });
    } else {
      // Si no existe, proceder a crear la nueva habitación
      let nuevaHabitacion = new Habitacion({
        numero: req.body.numero,
        tipo: req.body.tipo,
        descripcion: req.body.descripcion,
        precio: req.body.precio
      });
      if (req.file)
        nuevaHabitacion.imagen = req.file.filename;

      await nuevaHabitacion.save();
      res.redirect(req.baseUrl);
    }
  } catch (error) {
    let errores = {
      general: 'Error insertando habitacion'
    };
    if (error.errors.numero) {
      errores.numero = error.errors.numero.message;
    };

    if (error.errors.tipo) {
      errores.tipo = error.errors.tipo.message;
    }

    if (error.errors.descripcion) {
      errores.descripcion = error.errors.descripcion.message;
    }

    if (error.errors.precio) {
      errores.precio = error.errors.precio.message;
    }

    res.render('habitaciones_nueva', { errores: errores, datos: req.body });
  }
});



/* Borrado de habitación */
router.delete('/:id', auth.autenticacion, (req, res) => {
  Habitacion.findByIdAndRemove(req.params.id).then(() => {
    // Después de borrar la habitación, borramos las limpiezas asociadas a esa habitación
    Limpieza.deleteMany({ habitacion: req.params.id }).then(() => {
      res.redirect(req.baseUrl);
    }).catch(error => {
      res.render('error', { error: "Error borrando limpiezas" });
    });
  }).catch(error => {
    res.render('error', { error: "Error borrando habitacion" });
  });
});


/* Añadir incidencia */
router.post("/:id/incidencias", upload.uploadIncidencias.single('imagen'), (req, res) => {
  nuevaIncidencia(req, res);
});

/* Actualizar incidencia */
router.put("/:idHab/incidencias/:idInc", (req, res) => {
  actualizarIncidencia(req, res);
});



async function nuevaIncidencia(req, res) {
  try {
    let habitacion = await Habitacion.findById(req.params.id);
    if (!habitacion) {
      console.error(`No se encontró la habitación con el id ${req.params.id}`);
      throw new Error("Error añadiendo la incidencia");
    }
    let incidencia = {
      descripcion: req.body.descripcion
    };
    if (req.file) {
      incidencia.imagen = req.file.filename;
    }
    habitacion.incidencias.push(incidencia);
    await habitacion.save();
    res.redirect(`/habitaciones/${habitacion._id}`);
  } catch (error) {
    console.error(`Error añadiendo la incidencia: ${error}`);
    res.render('error', { error: "Error añadiendo la incidencia" });
  }
}

/* Función asíncrona auxiliar para los pasos de actualizar fecha de incidencia */
async function actualizarIncidencia(req, res) {
  try {
    let habitacion = await Habitacion.findById(req.params.idHab);
    if (habitacion) {
      let incidencia = habitacion.incidencias.filter(i => i._id == req.params.idInc);
      if (incidencia.length > 0) {
        incidencia[0].fin = Date.now();
        await habitacion.save();
        res.redirect(`/habitaciones/${habitacion._id}`);
      }
      else
        throw new Error();
    }
    else
      throw new Error();
  }
  catch (error) {
    res.render('error', { error: "Incidencia no encontrada" });
  }
}


module.exports = router;