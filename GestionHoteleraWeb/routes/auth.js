const express = require('express');

let router = express.Router();

const usuarios = [
    { usuario: 'Cristian', password: '12345' },
    { usuario: 'Valeria', password: 'val456' }
];

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', (req, res) => {
    let login = req.body.login;
    let password = req.body.password;
    let existeUsuario = usuarios.filter(usuario => usuario.usuario == login && usuario.password == password);
    if (existeUsuario.length > 0) {
        req.session.usuario = existeUsuario[0].usuario;
        res.redirect('/habitaciones');
    } else {
        res.render('login', {error: "Usuario o contraseña incorrectos"});
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;