const Joi = require('joi')

const LogInSchema = Joi.object({
    email : Joi.string().email().required(),
    psw: Joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!.,%*#+?&])/).min(8).max(12).required(),
});

const SingUpSchema = Joi.object({
    username: Joi.string().alphanum().max(30).required(),
    email: Joi.string().email().required(),
    psw: Joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!.,%*#+?&])/).min(8).max(12).required(),
    edad: Joi.number().integer().min(6).max(100).required()
});


module.exports = {
    LogInSchema,
    SingUpSchema
}