const authservice = require("../Services/auth.service.js")

const AuthController = {
    signup: async(req, res)=>{
        try {
            //Datos a necesitar para hacer el registro
            const {username, email, psw, edad} = req.body;
            //Llamado al Servicio de Hash 
            const HashedPsw = await authservice.Hashed(psw);
            //Llamado al Servicio De Registro De Usuarios
            await authservice.SignUp(username, email, HashedPsw, edad);
            //Reporte de Proceso Exitoso
            res.status(201).json({mensaje: "Registro Exitoso"})

        } catch (err) { return res.status(400).json({error: err.sqlMessage})}
    },

    login: async(req, res) => {
        try {
            //Datos a Necesitar para hacer el LogIn
            const {email, psw} = req.body;
            //Obtener los Datos del User del Email Solicitado
            const [user] = await authservice.FindEmail(email);
            //Comparar Las Password
            const match = await authservice.ComparePsw(psw, user[0].psw);
            //Condicional Para saber sí las psw No Coincidieron
            if(!match){return res.status(401).json({ mensaje: "Contraseña incorrecta" });}
            //Generar Token del User Solicitado
            const token = authservice.GenerateToken(user[0]);
            //Reporte de Acceso Exitoso
            res.status(200).send({auth: true, token : token})

        } catch (err) { return res.status(400).json({error: err.sqlMessage})}
    },

    logout: async(req, res)=>{
        res.status(200).send({ auth: false, token: null });
    },
    
    me: async(req, res)=>{
        res.status(200).json({ message: "Token válido", user_id: req.user.id_user });
    }
}

module.exports = AuthController;