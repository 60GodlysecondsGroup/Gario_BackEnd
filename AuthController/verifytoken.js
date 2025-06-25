const jwt = require('jsonwebtoken')
const {SECRET_KEY} = require("../keys.js")

function verifyToken(req, res, next){
    //Enviar el token a través del header
    var token = req.headers['x-access-token'];
    //Manejo de error, Sí no hay token: retornará status 401
    if(!token) return res.status(401).send({auth:false, message: 'Token No Enviado'});
    //Si hay token, verificar su validez
    jwt.verify(token, SECRET_KEY, async(err, decoded)=>{
        //Manejo de error sí, la key no coincide
        if(err) return res.status(401).send({auth:false, message:'Token Invalido o Expirado'});
        //Sí todo sale bien, se envían los datos en formato JSON
        req.user = decoded;
        next();
    })
}

module.exports = verifyToken;