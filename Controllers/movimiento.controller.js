const connection = require("../DATABASE/Connect.js");

const movements = {
    Monto: async(req, res)=>{
        connection.query("CALL SearchMontoUser(?)",[req.user.id_user], (err, resultado)=>{
        //Manejo de Errores, Fallo de servidor O respuesta vacía
        if(err) return res.status(500).json({ mensaje: "Error en el servidor" });
        if(resultado.length === 0) return res.status(401).json({ mensaje: "User sin Monto" });
        //Envío de datos    
        res.status(200).send(resultado[0])
    })
    },
    GastosUltimoMes: async(req, res)=>{
        connection.query("CALL SearchGastosMesActual(?)", [req.user.id_user], (err, resultado)=>{
        //Manejo de Errores, Fallo de servidor O respuesta vacía
        if(err) return res.status(500).json({ mensaje: "Error en el servidor" });
        //Envío de datos
        res.status(200).send(resultado[0])
    })
    },
    UltimosMovimientos: async(req, res)=>{
        connection.query("CALL SearchUltimos3Movimientos(?)", [req.user.id_user], (err, resultado)=>{
        //Manejo de Errores, Fallo de servidor O respuesta vacía
        if(err) return res.status(500).json({ mensaje: "Error en el servidor" });
        //Envío de datos
        res.status(200).send(resultado[0])
    })
    },
    Year: async(req, res)=>{
        connection.query("CALL movimientos_por_5anios(?)", [req.user.id_user], async(err, resultado)=>{
        //Manejo de Errores, Fallo de servidor O respuesta vacía
        if(err) return res.status(500).json({ mensaje: "Error en el servidor" });
        //Envío de datos
        res.status(200).send(resultado[0])
    })
    },
    Month: async(req, res)=>{
        connection.query("CALL movimientos_por_mes(?)", [req.user.id_user], async(err, resultado)=>{
        //Manejo de Errores, Fallo de servidor O respuesta vacía
        if(err) return res.status(500).json({ mensaje: "Error en el servidor" });
        //Envío de datos
        res.status(200).send(resultado[0])
    })
    },
    Week: async(req, res)=>{

        const {selectedMonth} = req.body;
 
        connection.query("CALL movimientos_por_semana(?,?)", [req.user.id_user, selectedMonth], async(err, resultado)=>{
        //Manejo de Errores, Fallo de servidor O respuesta vacía
        if(err) return res.status(500).json({ mensaje: "Error en el servidor" });
        
        if(resultado[0].length === 0) return res.status(401).json({ mensaje: "Mes Sin Movimientos Registrados" });
        //Envío de datos
        res.status(200).send(resultado[0])
    })
    },
    Day: async(req, res)=>{
        const {selectedWeek} = req.body;

        connection.query("CALL movimientos_por_dia(?,?)", [req.user.id_user, selectedWeek], async(err, resultado)=>{
        //Manejo de Errores, Fallo de servidor O respuesta vacía
        if(err) return res.status(500).json({ mensaje: "Error en el servidor" });
        
        if(resultado[0].length === 0) return res.status(401).json({ mensaje: "Semana Sin Movimientos Registrados" });
        //Envío de datos
        res.status(200).send(resultado[0])
    })
    },
    Ingreso: async(req, res)=>{
        const {ingreso_tipo, ingreso_categoria, cantidad, descripcion, fechas} = req.body;

        connection.query("CALL RegisterIngreso(?,?,?,?,?,?)",[req.user.id_user, ingreso_tipo, ingreso_categoria, cantidad, descripcion, JSON.stringify(fechas)], async (err, resultado)=>{
        //Manejo de Errores
        if (err) {
            // Status 400: Bad Request (fallo en datos enviados)
            return res.status(400).json({ error: err.sqlMessage });
        }

        //Status 201, Significa que ha sido Correcto la creación de un nuevo recurso
        res.status(201).json({mensaje: "Ingreso Registrado Correctamente"})
    })
    },
    Gasto: async(req, res)=>{
        
        const {gasto_tipo, gasto_categoria, cantidad, descripcion, fechas} = req.body; //El parametro fechas espera un valor tipo JSON_Array

        //JSON.stringify() --> Convertir la Array [] a '[]' para ser aceptada en la db
        connection.query("CALL RegisterGasto(?,?,?,?,?,?)", [req.user.id_user, gasto_tipo, gasto_categoria, cantidad, descripcion, JSON.stringify(fechas)], async (err, resultado)=>{
        //Manejo de Errores
        if(err){
            // Status 400: Bad Request (fallo en datos enviados)
            return res.status(400).json({ error: err.sqlMessage });
        };
        //Mensaje para verificar que el proceso fué Exitoso
        //Status 201, Significa que ha sido Correcto la creación de un nuevo recurso
        res.status(201).json({mensaje: "Gasto Registrado Correctamente"})
    })
    }
}

module.exports = movements;