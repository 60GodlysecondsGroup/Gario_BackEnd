const express = require('express');
const router = express.Router();
const verifyToken = require("../Middlewares/verifytoken.js");
const {ValidateDateArray, ValidateWeek, ValidateMonth} = require("../Middlewares/validate.date.js")
const MovementController = require("../Controllers/movimiento.controller.js");


//EndPoint para obtener datos acerca del Monto del user
router.get("/monto", verifyToken, MovementController.Monto)

//EndPoint para obtener los gastos totales del mes actual
router.get("/gastosultimomes", verifyToken, MovementController.GastosUltimoMes)

//EndPoint para obtener el ultimo ingreso Fijo, gasto Fijo y gasto Hormiga del usuario
router.get("/ultimosmovimientos", verifyToken, MovementController.UltimosMovimientos)

//EndPoint para ver los movimientos (gastos e ingresos Totales) de los ultimos 5 años
router.get("/lastfiveyears", verifyToken, MovementController.Year)

//EndPoint para ver los movimientos (gastos e ingresos Totales) de todos los meses del año vigente
router.get("/month", verifyToken, MovementController.Month)

//EndPoint para ver los movimientos (gastos e ingresos Totales) de las 4 semanas de un mes seleccionado
router.post("/week", verifyToken, ValidateMonth, MovementController.Week)

//EndPoint para ver los movimientos (gastos e ingresos Totales) de los días de una semana seleccionada
router.post("/day", verifyToken, ValidateWeek, MovementController.Day)

//EndPoint para Registrar un Gasto
router.post("/Gasto", verifyToken, ValidateDateArray, MovementController.Gasto)

//EndPoint para Registrar Ingresos
router.post("/Ingreso", verifyToken, ValidateDateArray, MovementController.Ingreso)

//Exportar todos los EndPoints
module.exports = router;