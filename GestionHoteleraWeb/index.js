/* Librerías */

const express = require("express");
const session = require('express-session');
const mongoose = require("mongoose");
const nunjucks = require('nunjucks');
const methodOverride = require('method-override');
const dotenv = require("dotenv");
const dateFilter = require('nunjucks-date-filter');

// Enrutadores
const habitaciones = require(__dirname + "/routes/habitaciones");
const limpiezas = require(__dirname + "/routes/limpiezas");
const auth = require(__dirname + '/routes/auth');

dotenv.config();

/* Conexión a la BD */
mongoose.connect(process.env.URLBD);

let app = express();

// Configuramos motor Nunjucks
let env = nunjucks.configure('views', {
    autoescape: true,
    express: app
});

// Asignación del motor de plantillas
app.set('view engine', 'njk');

// Añadimos el filtro de fecha a nuestro entorno de Nunjucks
env.addFilter('date', dateFilter);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
// Configuración de la sesión
app.use(session({
    secret: '1234',
    resave: true,
    saveUninitialized: false,
    expires: new Date(Date.now() + (30 * 60 * 1000))
  }));
// Middleware para procesar otras peticiones que no sean GET o POST
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      let method = req.body._method;
      delete req.body._method;
      return method;
    } 
}));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/public', express.static(__dirname + '/public'));
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});
app.use('/auth', auth);
app.use("/habitaciones", habitaciones);
app.use("/limpiezas", limpiezas);

// Ruta para redirigir a las habitaciones desde la raíz
app.get('/', (req, res) => {
  res.redirect('/habitaciones');
});

app.listen(process.env.PUERTO);

