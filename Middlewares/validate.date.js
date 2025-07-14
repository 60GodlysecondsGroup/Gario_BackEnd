//Funcion: Revision del Array donde Cada Fecha debe Cumplir con el Formato de fecha YYYY-mm-dd
function ValidateDateArray(req, res, next){

    const {fechas} = req.body;
    //Formato de Fechas Valido
    const formato_fecha = /^\d{4}-\d{2}-\d{2}$/;

    //Sí no es un Array O el Array está vacío
    if(!Array.isArray(fechas) || fechas.length === 0){
        return res.status(400).json({ mensaje: "Se requiere un arreglo de fechas" });
    }
    
    //Bucle para hacer Revisión de cada fecha
    for(const fecha of fechas){
        if (!formato_fecha.test(fecha)) {
            return res.status(400).json({ mensaje: `Formato inválido para la fecha ${fecha}` });
        }
    }

    next();
}

//Funcion: Revision donde la  Fecha debe Cumplir con el Formato de fecha YYYY-mm-dd
function ValidateMonth(req, res, next){
    
    //Recibir La Fecha (La DB recibe la fecha, toma el Mes y año)
    const {selectedMonth} = req.body;
    //Formato YYYY-mm-dd
    const formato_fecha = /^\d{4}-\d{2}-\d{2}$/;
    //Verificar que se haya enviado el formato adecuado
     if (!formato_fecha.test(selectedMonth)) {
    return res.status(400).json({ mensaje: "Formato de fecha inválido. Usa YYYY-MM-DD" });
    }

    next();
}

//Funcion: Revision donde la  Fecha debe Cumplir con el Formato de fecha YYYY-mm-dd
function ValidateWeek(req, res, next){

    const {selectedWeek} = req.body;
    //Formato YYYY-mm-dd
    const formato_fecha = /^\d{4}-\d{2}-\d{2}$/;
    //Verificar que se haya enviado el formato adecuado
     if (!formato_fecha.test(selectedWeek)) {
    return res.status(400).json({ mensaje: "Formato de fecha inválido. Usa YYYY-MM-DD" });
    }

    next();
}

module.exports = {
    ValidateDateArray,
    ValidateMonth,
    ValidateWeek
};