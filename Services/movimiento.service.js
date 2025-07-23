//Uso de Promesas (Con el Objetivo de Devolver resultados a los Controllers)
const connection = require("../DATABASE/Connect.js").promise();

//Uso de Funciones Asincronas
//Servicio De Registrar Ingresos
const RegisterIngreso = async(id_user, ingreso_tipo, ingreso_categoria, metodo_pago, cantidad, descripcion, fechas)=>{
    const [result] = await connection.query(
        "CALL RegisterIngreso(?,?,?,?,?,?,?)",
        [id_user, ingreso_tipo, ingreso_categoria, metodo_pago, cantidad, descripcion, JSON.stringify(fechas)]
    );
    return result;
};

//Servicio De Registrar Gastos
const RegisterGasto = async(id_user, gasto_tipo, gasto_categoria, metodo_pago, cantidad, descripcion, fechas)=>{
    const [result] = await connection.query(
        "CALL RegisterGasto(?,?,?,?,?,?,?)",
        //JSON.stringify() --> Convertir la Array [] a '[]' para ser aceptada en la db
        [id_user, gasto_tipo, gasto_categoria, metodo_pago, cantidad, descripcion, JSON.stringify(fechas)]
    );
    return result;
}

//Servicio de Buscar el Monto y detalles del Usuario
const SearchMontoUser = async(id_user)=>{
    const [result] = await connection.query(
        "CALL SearchMontoUser(?)",
        [id_user]
    );
    return result;
}

//Servicio de Buscar  gastos totales del mes actual
const SearchGastosMesActual = async(id_user)=>{
    const [result] = await connection.query(
        "CALL SearchGastosMesActual(?)",
        [id_user]
    );
    return result;
}

//Servicio de Buscar Ultimo: Gasto Fijo, Gasto Hormiga, Ingreso Fijo
const UltimosMovimientos = async(id_user)=>{
    const [result] = await connection.query(
        "CALL SearchUltimos3Movimientos(?)",
        [id_user]
    );
    return result;
}

//Servicio Para Consultar los Gastos e Ingresos Totales de los ultimos 5 años
const Year = async(id_user)=>{
    const [result] = await connection.query(
        "CALL movimientos_por_5anios(?)",
        [id_user]
    );
    return result;
}

//Servicio Para Consultar los Gastos e Ingresos Totales de los meses del Año Vigente
const Month = async(id_user)=>{
    const [result] = await connection.query(
        "CALL movimientos_por_mes(?)",
        [id_user]
    );
    return result;
}

//Servicio Para Consultar los Gastos e Ingresos Totales de Cada Semana De Un Mes Seleccionado
const Week = async(id_user, selectedMonth)=>{
    const [result] = await connection.query(
        "CALL movimientos_por_semana(?,?)",
        [id_user, selectedMonth]
    );
    return result;
}

//Servicio Para Consultar los Gastos e Ingresos Totales de Cada Dia de Una Semana Seleccionada
const Day = async(id_user, selectedWeek)=>{
    const [result] = await connection.query(
        "CALL movimientos_por_dia(?,?)",
        [id_user, selectedWeek]
    );
    return result;
}

const historial = async(ValorMin, ValorMax, FechaMin, FechaMax, id_user, TipoConsulta)=>{
    const [result] = await connection.query(
        "CALL search_historial(?,?,?,?,?,?)",
        [ValorMin, ValorMax, FechaMin, FechaMax, id_user, TipoConsulta]
    );
    return result;
}

module.exports = {
    RegisterIngreso,
    RegisterGasto,
    SearchMontoUser,
    SearchGastosMesActual,
    UltimosMovimientos,
    Year,
    Month,
    Week,
    Day,
    historial
}