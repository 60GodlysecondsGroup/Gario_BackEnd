const express = require('express');
const router = express.Router();
const verifyToken = require("../Middlewares/verifytoken.js");
const {ValidateDateArray, ValidateWeek, ValidateMonth} = require("../Middlewares/validate.date.js")
const movements = require("../Controllers/movimiento.controller.js");


//EndPoint para obtener datos acerca del Monto del user
router.get("/monto", verifyToken, movements.Monto)

//EndPoint para obtener los gastos totales del mes actual
router.get("/gastosultimomes", verifyToken, movements.GastosUltimoMes)

//EndPoint para obtener el ultimo ingreso Fijo, gasto Fijo y gasto Hormiga del usuario
router.get("/ultimosmovimientos", verifyToken, movements.UltimosMovimientos)

//EndPoint para ver los movimientos (gastos e ingresos Totales) de los ultimos 5 años
router.get("/lastfiveyears", verifyToken, movements.Year)

//EndPoint para ver los movimientos (gastos e ingresos Totales) de todos los meses del año vigente
router.get("/month", verifyToken, movements.Month)

//EndPoint para ver los movimientos (gastos e ingresos Totales) de las 4 semanas de un mes seleccionado
router.post("/week", verifyToken, ValidateMonth, movements.Week)

//EndPoint para ver los movimientos (gastos e ingresos Totales) de los días de una semana seleccionada
router.post("/day", verifyToken, ValidateWeek, movements.Day)

//EndPoint para Registrar un Gasto
router.post("/Gasto", verifyToken, ValidateDateArray, movements.Gasto)

//EndPoint para Registrar Ingresos
router.post("/Ingreso", verifyToken, ValidateDateArray, movements.Ingreso)

//Exportar todos los EndPoints
module.exports = router;