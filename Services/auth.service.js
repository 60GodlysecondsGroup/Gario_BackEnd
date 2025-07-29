const connection = require("../DATABASE/Connect.js").promise();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

//Servicio de 'Hash', con el objetivo de cifrar la password
const Hashed = async(password)=>{
    return await bcrypt.hash(password, 8);
}

//Servicio de 'Comparar' Las Passwords
//psw --> Password Ingresada || pswdb --> Password de la DataBase
//Proceso: Cifra psw y luego la comparar con pswdb que ya está cifrada
const ComparePsw = async(psw, pswdb)=>{
    return await bcrypt.compare(psw, pswdb);
}

//Servicio de Registro de Usuarios en la Database
const SignUp = async(username, email, hashedpsw, edad)=>{
    const [result] = await connection.query(
        "CALL SignUp(?,?,?,?)",
        [username, email, hashedpsw, edad]
    );
    return result;
}

//Servicio de Busqueda y Obtención de Datos Según el Email Solicitado
const FindEmail = async(email)=>{
    const [result] = await connection.query(
        "CALL SearchEmail(?)",
        [email]
    );
    return result;
}

//Servicio de Registro del Refresh Token en la Database
const SaveRefreshToken = async(id_user, token)=>{
    return await connection.query(
        "CALL REGISTER_REFRESH_TOKEN(?,?)",
        [id_user, token]
    );
}

//Servicio de Creación del Token 
//Recomendación: Las llaves deben usar los nombres correspondientes de las columnas de la db
const GenerateToken = (user)=>{
    return jwt.sign({
        id_user: user.id_user, 
    },
    process.env.JWT_SECRET,
    {expiresIn:process.env.JWT_EXPIRES_IN});   
}

//Servicio de Creación de Refresh Token
const GenerateRefreshToken = (user)=>{
    return jwt.sign({
        id_user: user.id_user, 
    },
    process.env.JWT_SECRET,
    {expiresIn:'7d'});
}

module.exports = {
    Hashed,
    ComparePsw,
    SignUp,
    FindEmail,
    GenerateToken,
    SaveRefreshToken,
    GenerateRefreshToken
}