const express = require("express");
const cors = require("cors");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const AuthController = require('./AuthController/authcontroller.js');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

//Uso de los endpoints de usuario
app.use('/user', AuthController);


// Escuchar en todas las interfaces
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor Corriendo en http://0.0.0.0:${PORT}`);
});