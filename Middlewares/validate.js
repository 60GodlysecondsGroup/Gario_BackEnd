//Objetivo: Funcion que Obtiene los Schemas Joi, Valida sus Datos, Arroja Error Sí hay
function validate(schema){
    return function (req, res, next){
        const {error} = schema.validate(req.body);
        if(error) return res.status(400).json({Err: error.details[0].message});
        next();
    };
}

module.exports = validate;