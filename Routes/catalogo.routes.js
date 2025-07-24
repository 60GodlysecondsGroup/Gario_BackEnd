const express = require('express');
const router = express.Router();
const  CatalogoController = require("../Controllers/catalogo.controller.js")

//EndPoint Para Consultar Todos Los Tipos de Gastos
router.get("/tiposGastos", CatalogoController.FindGastosTipos)

//EndPoint Para Consultar Las Categorias de Gastos y Metodos de Pago
router.get("/CMGastos", CatalogoController.FindGastosCM)

//EndPoint Para Consultar Todos Los Tipos de Ingresos
router.get("/tiposIngresos", CatalogoController.FindIngresosTipos)

//EndPoint Para Consultar Las Categorias de Ingresos y Metodos de Pago
router.get("/CMIngresos", CatalogoController.FindIngresosCM)

module.exports = router;