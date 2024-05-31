const jwt = require('jsonwebtoken');
const secreto = process.env.SECRETO;

let generarToken = (login,rol) => jwt.sign({login: login,rol: rol}, secreto, {expiresIn: "2 hours"});

let validarToken = token => {
    try {
        let resultado = jwt.verify(token, secreto);
        return resultado;
    } catch (e) {}
}

let protegerRuta = rol => {
    return(req,res,next) => {
        let token = req.headers['authorization'];
        if(token){
            token = token.substring(7);
            let resultado = validarToken(token);
            // Comprobamos si no se requiere un rol específico (rol === "")
            // o si el rol del usuario coincide con el rol requerido (rol === resultado.rol).
            if (resultado && (rol === "" || rol === resultado.rol)) {
                next();
            } else
                res.status(403)
                    .send({ok: false, error: "Usuario no autorizado"});
        } else
            res.status(403)
                .send({ok: false, error: "Usuario no autorizado"});
    }};

    
module.exports = {
    generarToken: generarToken,
    validarToken: validarToken,
    protegerRuta: protegerRuta
};