const mysql = require("mysql2");

//Esto debe ir en variables de entorno
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Cr434953",
    database: "gario"
});

connection.connect(err => {
    if (err) throw err;
    console.log("Conexion Exitosa a MySQL");
});

//Exportar la Funcion de Conectar la database
module.exports = connection; 