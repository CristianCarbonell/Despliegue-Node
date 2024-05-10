const multer = require('multer');

let storageHabitaciones = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads/habitaciones')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
});

let storageIncidencias = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads/incidencias')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
});

let uploadHabitaciones = multer({storage: storageHabitaciones});
let uploadIncidencias = multer({storage: storageIncidencias});

module.exports = {
    uploadHabitaciones: uploadHabitaciones,
    uploadIncidencias: uploadIncidencias
};
