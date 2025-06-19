const express = require("express");
const cors = require("cors");
const multer = require('multer');
const cookieParser = require('cookie-parser'); //Desinstalar
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const connection = require("./DATABASE/Connect.js");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const {SECRET_KEY} = require("./keys.js")

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());


//EndPoint Para Registrarse
//Procedure & Bcrypt
app.post("/signup", async (req, res) => {
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
app.post("/login", async (req, res) => {
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
        const user = resultado[0]
        //el .compare, cifra la password recibida, y la compara con la password cifrada de la base de datos, para luego retornar un true o false que es guardado en la variable match 
        const match = await bcrypt.compare(psw, user.psw)
        //Si es diferente de True, Significa que la password es incorrecta, Status 401 'No Autorizado
        if(!match) {return res.status(401).json({ mensaje: "Contraseña incorrecta" }); }
        //Creación del Token 
        //Recomendación: Las llaves deben usar los nombres correspondientes de las columnas de la db
        const token = jwt.sign({id_user:user.id_user, name_user:user.name_user, email:user.email, edad:user.edad}, SECRET_KEY, {expiresIn:'1h'})
        //Eliminar de la variable user, el apartado 'psw'
        const {psw: _, ...publicuser} = user
        //Enviar el token y los datos del user
        res.json({
            token,
            user:publicuser
        })
    })
})


// Escuchar en todas las interfaces
app.listen(PORT, () => {
    console.log(`Servidor Corriendo en http://0.0.0.0:${PORT}`);
});