const express = require("express");
const cors = require("cors");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const AuthRoutes = require('./Routes/auth.routes.js');
const movementsRoutes = require('./Routes/movimiento.routes.js');
const CatalogoRoutes = require('./Routes/catalogo.routes.js');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

//EndPoints de Autorizacion
app.use('/user', AuthRoutes);

//EndPoints de Movimientos
app.use('/movimientos', movementsRoutes);

//EndPoints de Catalogo
app.use('/catalogo', CatalogoRoutes);


// Escuchar en todas las interfaces
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor Corriendo en http://0.0.0.0:${PORT}`);
});