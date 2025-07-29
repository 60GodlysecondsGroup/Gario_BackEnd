const mysql = require("mysql2");
require('dotenv').config();
//Esto debe ir en variables de entorno
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect(err => {
    if (err) throw err;
    console.log("Conexion Exitosa a MySQL");
});

//Exportar la Funcion de Conectar la database
module.exports = connection; 