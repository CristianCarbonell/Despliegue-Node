const jwt = require('jsonwebtoken');
const secreto = "recetaSecreta";

let generarToken = login => jwt.sign({login: login}, secreto, {expiresIn: "2 hours"});

let validarToken = token => {
    try {
        let resultado = jwt.verify(token, secreto);
        return resultado;
    } catch (e) {}
}

let protegerRuta = (req, res, next) => {
    let token = req.headers['authorization'];
    if (token && token.startsWith("Bearer "))
        token = token.slice(7);

    if (validarToken(token))
        next();
    else
        res.send({ok: false, error: "Usuario no autorizado"});
}
    
module.exports = {
    generarToken: generarToken,
    validarToken: validarToken,
    protegerRuta: protegerRuta
};