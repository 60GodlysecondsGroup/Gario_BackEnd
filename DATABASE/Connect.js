const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "cr434953",
    database: "gario"
});

connection.connect(err => {
    if (err) throw err;
    console.log("Conexion Exitosa a MySQL");
});

//Exportar la Funcion de Conectar la database
module.exports = connection; 