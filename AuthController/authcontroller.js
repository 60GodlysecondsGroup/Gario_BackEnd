const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const connection = require("../DATABASE/Connect.js");
const {SECRET_KEY} = require("../keys.js")
const verifyToken = require("./verifytoken.js")

//EndPoint Para Registrarse
//Procedure & Bcrypt
router.post("/signup", async (req, res) => {
    //Datos a necesitar para hacer el registro
    const {name_user, email, psw, edad} = req.body;
    //Proceso de 'Hashear' la password
    const hashedpsw = await bcrypt.hash(psw,8)
    //Llamado del Procedure
    connection.query("CALL SignUp(?,?,?,?)", [name_user, email, hashedpsw, edad], (err, resultado) =>{
        //Manejo de Errores
        if(err){
            console.error(err);
            //Status 500 Significa que se presentó un error dentro del servidor
            return res.status(500).json({error : "Error"});
        };
        //Mensaje para verificar que el proceso fué Exitoso
        //Status 201, Significa que ha sido Correcto la creación de un nuevo recurso
        res.status(201).json({mensaje: "User Registrado Correctamente"})
    });
});

//EndPoint para Iniciar Sesión
//JWT & Bcrypt
router.post("/login", async (req, res) => {
    //Datos a necesitar para el Login
    const {email, psw} = req.body;
    //El Email es irrepetible, por ello, al hacer esta query, ya se sabrá a cual user se está refiriendo
    connection.query("CALL SearchEmail(?)", [email], async (err, resultado) =>{
        //Manejo de Errores
        //Status 401, Email No Autorizado/No Encontrado 
        if (err) {
            return res.status(401).json({ mensaje: err.sqlMessage });
        }
       
        //Guardar en la variable User, los datos del usuario
        const user = resultado[0][0]
        //el .compare, cifra la password recibida, y la compara con la password cifrada de la base de datos, para luego retornar un true o false que es guardado en la variable match 
        const match = await bcrypt.compare(psw, user.psw)
        //Si es diferente de True, Significa que la password es incorrecta, Status 401 'No Autorizado
        if(!match) {return res.status(401).json({ mensaje: "Contraseña incorrecta" }); }
        //Creación del Token 
        //Recomendación: Las llaves deben usar los nombres correspondientes de las columnas de la db
        //86400 == 24hrs
        const token = jwt.sign({id_user:user.id_user, username:user.username, email:user.email, age:user.age}, SECRET_KEY, {expiresIn:'1h'})
        //Enviar el token que contiene los datos del user
        res.status(200).send({ auth: true, token: token });
    })
})

//EndPoint de "Cerrar Sesión"
//Lo tenemos para llevar un registro cuando el user haga LogOut
//No limpia el token, la unica forma de hacerlo es mediante el frontend 
router.get("/logout", async(req, res)=>{
    res.status(200).send({ auth: false, token: null });
})

//EndPoint para obtener datos personales del user
//Uso de la Función verificarToken, los datos del user son retornados dentro del request object (el "req" para los chavos)
router.get("/me", verifyToken, async(req, res, next)=>{
    res.status(200).json({ message: "Token válido", user_id: req.user.id_user });
})

//EndPoint para obtener datos acerca del Monto del user
router.get("/me/monto", verifyToken, async(req, res, next)=>{
    connection.query("CALL SearchMontoUser(?)",[req.user.id_user], (err, resultado)=>{
        //Manejo de Errores, Fallo de servidor O respuesta vacía
        if(err) return res.status(500).json({ mensaje: "Error en el servidor" });
        if(resultado.length === 0) return res.status(401).json({ mensaje: "User sin Monto" });
        //Envío de datos    
        res.status(200).send(resultado[0])
    })
})

//EndPoint para obtener los gastos totales del mes actual
router.get("/me/monto/ultimomes", verifyToken, async(req, res, next)=>{
    connection.query("CALL SearchGastosMesActual(?)", [req.user.id_user], (err, resultado)=>{
        //Manejo de Errores, Fallo de servidor O respuesta vacía
        if(err) return res.status(500).json({ mensaje: "Error en el servidor" });
        //Envío de datos
        res.status(200).send(resultado[0])
    })
})

//EndPoint para obtener el ultimo ingreso Fijo, gasto Fijo y gasto Hormiga del usuario
router.get("/me/monto/ultimosmovimientos", verifyToken, async(req, res, next)=>{
    connection.query("CALL SearchUltimos3Movimientos(?)", [req.user.id_user], (err, resultado)=>{
        //Manejo de Errores, Fallo de servidor O respuesta vacía
        if(err) return res.status(500).json({ mensaje: "Error en el servidor" });
        //Envío de datos
        res.status(200).send(resultado[0])
    })
})

//EndPoint para Registrar un Gasto
router.post("/registerGasto", verifyToken, async(req, res, next)=>{
    
    const {gasto_tipo, gasto_categoria, cantidad, descripcion, fechas} = req.body; //El parametro fechas espera un valor tipo JSON_Array
    
    //Sí no es un Array O el Array está vacío
    if(!Array.isArray(fechas) || fechas.length === 0){
        return res.status(400).json({ mensaje: "Se requiere un arreglo de fechas" });
    }
    //Formato de Fechas Valido
    const formato_fecha = /^\d{4}-\d{2}-\d{2}$/;
    //Bucle para hacer Revisión de cada fecha
    for(const fecha of fechas){
        if (!formato_fecha.test(fecha)) {
            return res.status(400).json({ mensaje: `Formato inválido para la fecha ${fecha}` });
        }
    }

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
})

//EndPoint para Registrar Ingresos
router.post("/registerIngreso", verifyToken, async(req, res, next)=>{

    const {ingreso_tipo, ingreso_categoria, cantidad, descripcion, fechas} = req.body;

    //Sí no es un Array O el Array está vacío
    if(!Array.isArray(fechas) || fechas.length === 0){
        return res.status(400).json({ mensaje: "Se requiere un arreglo de fechas" });
    }
    //Formato de Fechas Valido
    const formato_fecha = /^\d{4}-\d{2}-\d{2}$/;
    //Bucle para hacer Revisión de cada fecha
    for(const fecha of fechas){
        if (!formato_fecha.test(fecha)) {
            return res.status(400).json({ mensaje: `Formato inválido para la fecha ${fecha}` });
        }
    }

    connection.query("CALL RegisterIngreso(?,?,?,?,?,?)",[req.user.id_user, ingreso_tipo, ingreso_categoria, cantidad, descripcion, JSON.stringify(fechas)], async (err, resultado)=>{
        //Manejo de Errores
        if (err) {
            // Status 400: Bad Request (fallo en datos enviados)
            return res.status(400).json({ error: err.sqlMessage });
        }

        //Status 201, Significa que ha sido Correcto la creación de un nuevo recurso
        res.status(201).json({mensaje: "Ingreso Registrado Correctamente"})
    })
})

//EndPoint para ver los movimientos (gastos e ingresos Totales) de los ultimos 5 años
router.get("/me/searchMovements/year", verifyToken, async(req, res, next)=>{

    connection.query("CALL movimientos_por_5anios(?)", [req.user.id_user], async(err, resultado)=>{
        //Manejo de Errores, Fallo de servidor O respuesta vacía
        if(err) return res.status(500).json({ mensaje: "Error en el servidor" });
        //Envío de datos
        res.status(200).send(resultado[0])
    })
})

//EndPoint para ver los movimientos (gastos e ingresos Totales) de todos los meses del año vigente
router.get("/me/searchMovements/month", verifyToken, async(req, res, next)=>{

    connection.query("CALL movimientos_por_mes(?)", [req.user.id_user], async(err, resultado)=>{
        //Manejo de Errores, Fallo de servidor O respuesta vacía
        if(err) return res.status(500).json({ mensaje: "Error en el servidor" });
        //Envío de datos
        res.status(200).send(resultado[0])
    })
})

//EndPoint para ver los movimientos (gastos e ingresos Totales) de las 4 semanas de un mes seleccionado
router.post("/me/searchMovements/week", verifyToken, async(req, res, next)=>{
    //Recibir La Fecha (La DB recibe la fecha, toma el Mes y año)
    const {selectedMonth} = req.body;
    //Formato YYYY-mm-dd
    const formato_fecha = /^\d{4}-\d{2}-\d{2}$/;
    //Verificar que se haya enviado el formato adecuado
     if (!formato_fecha.test(selectedMonth)) {
    return res.status(400).json({ mensaje: "Formato de fecha inválido. Usa YYYY-MM-DD" });
    }
 
    connection.query("CALL movimientos_por_semana(?,?)", [req.user.id_user, selectedMonth], async(err, resultado)=>{
        //Manejo de Errores, Fallo de servidor O respuesta vacía
        if(err) return res.status(500).json({ mensaje: "Error en el servidor" });
        
        if(resultado[0].length === 0) return res.status(401).json({ mensaje: "Mes Sin Movimientos Registrados" });
        //Envío de datos
        res.status(200).send(resultado[0])
    })
})

//EndPoint para ver los movimientos (gastos e ingresos Totales) de los días de una semana seleccionada
router.post("/me/searchMovements/day", verifyToken, async(req, res, next)=>{

    const {selectedWeek} = req.body;
    //Formato YYYY-mm-dd
    const formato_fecha = /^\d{4}-\d{2}-\d{2}$/;
    //Verificar que se haya enviado el formato adecuado
     if (!formato_fecha.test(selectedWeek)) {
    return res.status(400).json({ mensaje: "Formato de fecha inválido. Usa YYYY-MM-DD" });
    }

    connection.query("CALL movimientos_por_dia(?,?)", [req.user.id_user, selectedWeek], async(err, resultado)=>{
        //Manejo de Errores, Fallo de servidor O respuesta vacía
        if(err) return res.status(500).json({ mensaje: "Error en el servidor" });
        
        if(resultado[0].length === 0) return res.status(401).json({ mensaje: "Semana Sin Movimientos Registrados" });
        //Envío de datos
        res.status(200).send(resultado[0])
    })
})

//Exportar todos los EndPoints
module.exports = router;