const express = require('express');
const router = express.Router();
const verifyToken = require("../Middlewares/verifytoken.js");
const validate = require("../Middlewares/validate.js");
const {SingUpSchema,LogInSchema} = require("../Validations/auth.schema.js")
const AuthController = require("../Controllers/auth.controller.js");

//EndPoint Para Registrarse
router.post("/signup", validate(SingUpSchema), AuthController.signup);

//EndPoint para Iniciar Sesión
router.post("/login", validate(LogInSchema), AuthController.login)

//EndPoint de "Cerrar Sesión"
//Lo tenemos para llevar un registro cuando el user haga LogOut
//No limpia el token, la unica forma de hacerlo es mediante el frontend 
router.get("/logout", AuthController.logout)

//EndPoint para obtener datos personales del user
//Uso de la Función verificarToken, los datos del user son retornados dentro del request object (el "req" para los chavos)
router.get("/me", verifyToken, AuthController.me)


//Exportar todos los EndPoints
module.exports = router;