const connection = require("../DATABASE/Connect.js").promise();

//Servicio Para Consultar los Tipos de Gastos Disponibles
const FindGastosTipos = async() =>{
    const [result] = await connection.query(
        "CALL FIND_GASTOS_TIPOS()"
    );
    return result;
}
//Servicio Para Consultar las Categorias de Gastos y los metodos de Pago
const FindGastosCategoriasMetodos = async() =>{
    const [result] = await connection.query(
        "CALL FIND_GASTOS_CATEGORIAS_METODOS()"
    );
    return result;
}

//Servicio Para Consultar los Tipos de Ingresos Disponibles
const FindIngresosTipos = async() =>{
    const [result] = await connection.query(
        "CALL FIND_INGRESOS_TIPOS()"
    );
    return result;
}

//Servicio Para Consultar las Categorias de Ingresos y Los Metodos de Pago
const FindIngresosCategoriasMetodos = async() =>{
    const [result] = await connection.query(
        "CALL FIND_INGRESOS_CATEGORIAS_METODOS()"
    );
    return result;
}

module.exports = {
    FindGastosTipos,
    FindGastosCategoriasMetodos,
    FindIngresosTipos,
    FindIngresosCategoriasMetodos
}