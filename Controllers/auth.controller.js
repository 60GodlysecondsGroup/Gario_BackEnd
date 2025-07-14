const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const connection = require("../DATABASE/Connect.js");
const {SECRET_KEY} = require("../keys.js")

const AuthController = {
    signup: async(req, res)=>{
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
    },

    login: async(req, res) => {
        //Datos a necesitar para el Login
        const {email, psw} = req.body;
        //El Email es irrepetible, por ello, al hacer esta query, ya se sabrá a cual user se está refiriendo
        connection.query("CALL SearchEmail(?)", [email], async (err, resultado) =>{
            //Manejo de Errores
            //Status 401, Email No Autorizado/No Encontrado 
            if (err) {
                return res.status(401).json({ mensaje: err.sqlMessage });
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
            const token = jwt.sign({id_user:user.id_user, username:user.username, email:user.email, age:user.age}, SECRET_KEY, {expiresIn:'1h'})
            //Enviar el token que contiene los datos del user
            res.status(200).send({ auth: true, token: token });
        })
    },

    logout: async(req, res)=>{
        res.status(200).send({ auth: false, token: null });
    },
    
    me: async(req, res)=>{
        res.status(200).json({ message: "Token válido", user_id: req.user.id_user });
    }
}

module.exports = AuthController;