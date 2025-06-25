const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const connection = require("../DATABASE/Connect.js");
const {SECRET_KEY} = require("../keys.js")
const verifyToken = require("./verifytoken.js")

//EndPoint Para Registrarse
//Procedure & Bcrypt
router.post("/signup", async (req, res) => {
    //Datos a necesitar para hacer el registro
    const {name_user, email, psw, edad} = req.body;
    //Proceso de 'Hashear' la password
    const hashedpsw = await bcrypt.hash(psw,8)
    //Llamado del Procedure
    connection.query("CALL SignUp(?,?,?,?)", [name_user, email, hashedpsw, edad], (err, resultado) =>{
        //Manejo de Errores
        if(err){
            console.error(err);
            //Status 500 Significa que se presentó un error dentro del servidor
            return res.status(500).json({error : "Error"});
        };
        //Mensaje para verificar que el proceso fué Exitoso
        //Status 201, Significa que ha sido Correcto la creación de un nuevo recurso
        res.status(201).json({mensaje: "User Registrado Correctamente"})
    });
});

//EndPoint para Iniciar Sesión
//JWT & Bcrypt
router.post("/login", async (req, res) => {
    //Datos a necesitar para el Login
    const {email, psw} = req.body;
    //El Email es irrepetible, por ello, al hacer esta query, ya se sabrá a cual user se está refiriendo
    connection.query("CALL SearchEmail(?)", [email], async (err, resultado) =>{
        //Manejo de Errores
        //Status 500, Error del Servidor
        if (err) {
            console.error(err);
            return res.status(500).json({ mensaje: "Error en el servidor" });
        }
        //Status 401, Significa que no está Autorizado
        if (resultado.length === 0) {
            return res.status(401).json({ mensaje: "Email desconocido" });
        }
        //Guardar en la variable User, los datos del usuario
        const user = resultado[0][0]
        //el .compare, cifra la password recibida, y la compara con la password cifrada de la base de datos, para luego retornar un true o false que es guardado en la variable match 
        const match = await bcrypt.compare(psw, user.psw)
        //Si es diferente de True, Significa que la password es incorrecta, Status 401 'No Autorizado
        if(!match) {return res.status(401).json({ mensaje: "Contraseña incorrecta" }); }
        //Creación del Token 
        //Recomendación: Las llaves deben usar los nombres correspondientes de las columnas de la db
        //86400 == 24hrs
        const token = jwt.sign({id_user:user.id_user, username:user.username, email:user.email, age:user.age}, SECRET_KEY, {expiresIn:'86400'})
        //Enviar el token que contiene los datos del user
        res.status(200).send({ auth: true, token: token });
    })
})

//EndPoint de "Cerrar Sesión"
//Lo tenemos para llevar un registro cuando el user haga LogOut
//No limpia el token, la unica forma de hacerlo es mediante el frontend 
router.get("/logout", async(req, res)=>{
    res.status(200).send({ auth: false, token: null });
})

//EndPoint para obtener datos personales del user
//Uso de la Función verificarToken, los datos del user son retornados dentro del request object (el "req" para los chavos)
router.get("/me", verifyToken, async(req, res, next)=>{
    res.status(200).json({ message: "Token válido", user_id: req.user.id_user });
})

//EndPoint para obtener datos acerca del Monto del user
router.get("/me/monto", verifyToken, async(req, res, next)=>{
    connection.query("CALL SearchMontoUser(?)",[req.user.id_user], (err, resultado)=>{
        //Manejo de Errores, Fallo de servidor O respuesta vacía
        if(err) return res.status(500).json({ mensaje: "Error en el servidor" });
        if(resultado.length === 0) return res.status(401).json({ mensaje: "User sin Monto" });
        //Envío de datos
        res.status(200).send(resultado[0])
    })
})

//Exportar todos los EndPoints
module.exports = router;