const movimientoservice = require("../Services/movimiento.service.js")

const MovementController = {
    Monto: async(req, res)=>{
        try {
            //Guardar en Un array los Resultados que Nos Arrojará la db
            const [resultado] = await movimientoservice.SearchMontoUser(req.user.id_user);
            //Mostrar el Primer Resultado de la Array
            res.status(200).send(resultado[0])

        } catch (err) {return res.status(400).json({ error: err.sqlMessage });}
    },
    GastosUltimoMes: async(req, res)=>{
        try {
            const [resultado] = await movimientoservice.SearchGastosMesActual(req.user.id_user);
            res.status(200).send(resultado[0])
        } catch (err) {return res.status(400).json({error: err.sqlMessage})}
    },
    UltimosMovimientos: async(req, res)=>{
        try {
            const [resultado] = await movimientoservice.UltimosMovimientos(req.user.id_user);
            //El array 'resultado' se enviará completo, debido a que la consulta otorga 3 respuestas
            res.status(200).send(resultado)
        } catch (err) {return res.status(400).json({error: err.sqlMessage})}
    },
    Year: async(req, res)=>{
        try {
            const [resultado] = await movimientoservice.Year(req.user.id_user);
            res.status(200).send(resultado)
        } catch (err) { return res.status(400).json({error: err.sqlMessage})}
    },
    Month: async(req, res)=>{
        try {
            const [resultado] = await movimientoservice.Month(req.user.id_user);
            res.status(200).send(resultado)
        } catch (err) { return res.status(400).json({error: err.sqlMessage})}
    },
    Week: async(req, res)=>{
        try {
            //Debe Llegar Una Fecha, y se extraerá su Mes
            const {selectedMonth} = req.body;

            const [resultado] = await movimientoservice.Week(req.user.id_user, selectedMonth);
            //Condicional Para Saber Si No Hay Registros Encontrados
            if(resultado.length === 0) return res.status(401).json({mensaje: "Mes Sin Movimientos Registrados"});
            res.status(200).send(resultado)
        } catch (err) { return res.status(400).json({error: err.sqlMessage})}
    },
    Day: async(req, res)=>{
        try {
            //Debe LLegar Una Fecha, y se extraerá el Numero de Semana Del Año
            const {selectedWeek} = req.body;

            const [resultado] = await movimientoservice.Day(req.user.id_user, selectedWeek);
            //Condicional Para Saber Si No Hay Registros Encontrados
            if(resultado.length === 0) return res.status(401).json({mensaje: "Semana Sin Movimientos Registrados"});
            res.status(200).send(resultado)
        } catch (err) { return res.status(400).json({error: err.sqlMessage})}
    },
    Ingreso: async(req, res)=>{
        try {
            //El parametro fechas espera un valor tipo JSON_Array
            const {ingreso_tipo, ingreso_categoria, cantidad, descripcion, fechas} = req.body;
            //Llamado al Servicio de Registrar Ingresos
            await movimientoservice.RegisterIngreso(req.user.id_user, ingreso_tipo, ingreso_categoria, cantidad, descripcion, fechas);

            //Mensaje para verificar que el proceso fué Exitoso
            //Status 201, Significa que ha sido Correcto la creación de un nuevo recurso
            res.status(201).json({mensaje: "Ingreso Registrado Correctamente"})
            
        } catch (err) {return res.status(400).json({ error: err.sqlMessage }); } // Status 400: Bad Request (fallo en datos enviados)
        
    },
    Gasto: async(req, res)=>{
        try {
            //El parametro fechas espera un valor tipo JSON_Array
            const {gasto_tipo, gasto_categoria, cantidad, descripcion, fechas} = req.body; 
            //Llamado al Servicio de Registrar Gastos
            await movimientoservice.RegisterGasto(req.user.id_user, gasto_tipo, gasto_categoria, cantidad, descripcion, fechas);
            
            //Mensaje para verificar que el proceso fué Exitoso
            //Status 201, Significa que ha sido Correcto la creación de un nuevo recurso
            res.status(201).json({mensaje: "Gasto Registrado Correctamente"})

        } catch (err) { return res.status(400).json({ error: err.sqlMessage }); } // Status 400: Bad Request (fallo en datos enviados)
    },
    Historial: async(req, res)=>{
        try {
            const {ValorMin, ValorMax, FechaMin, FechaMax, TipoConsulta} = req.body

            const [resultado] = await movimientoservice.historial(ValorMin, ValorMax, FechaMin, FechaMax, req.user.id_user, TipoConsulta);

            //Condicional Para Saber Si No Hay Registros Encontrados
            if(resultado.length === 0) return res.status(401).json({mensaje: "Sin Movimientos Registrados"});

            res.status(200).send(resultado)
        } catch (err) { return res.status(400).json({error: err.sqlMessage})}
    }
}

module.exports = MovementController;