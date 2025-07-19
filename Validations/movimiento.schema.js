const Joi = require("joi")

const IngresoSchema = Joi.object({
    ingreso_tipo: Joi.number().integer().required(),
    ingreso_categoria: Joi.number().integer().required(),
    cantidad: Joi.number().min(0.01).required(),
    descripcion: Joi.string().allow('').max(200),
    fechas: Joi.array().items(
        Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/)
    ).min(1).required()
});

const GastoSchema = Joi.object({
    gasto_tipo: Joi.number().integer().required(),
    gasto_categoria: Joi.number().integer().required(),
    cantidad: Joi.number().min(0.01).required(),
    descripcion: Joi.string().allow('').max(200),
    fechas: Joi.array().items(
        Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/)
    ).min(1).required()
});

const MonthSchema = Joi.object({
    selectedMonth: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required()
});

const WeekSchema = Joi.object({
    selectedWeek: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required()
});


module.exports = {
    IngresoSchema,
    GastoSchema,
    WeekSchema,
    MonthSchema
}