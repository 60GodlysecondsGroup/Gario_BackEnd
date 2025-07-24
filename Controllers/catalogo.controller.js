const CatalogoService = require("../Services/catalogo.service.js")

const CatalogoController = {
    // C = Categorias && M = Metodos
    FindGastosCM: async(req, res)=>{
        try {
            const [result] = await CatalogoService.FindGastosCategoriasMetodos();
            res.status(200).send(result);
        } catch (err) {return res.status(400).json({ error: err.sqlMessage });}
    },
    FindGastosTipos: async(req, res)=>{
        try {
            const [result] = await CatalogoService.FindGastosTipos();
            res.status(200).send(result)
        } catch (err) {return res.status(400).json({ error: err.sqlMessage });}
    },
    FindIngresosCM: async(req, res)=>{
        try {
            const [result] = await CatalogoService.FindIngresosCategoriasMetodos();
            res.status(200).send(result);
        } catch (err) {return res.status(400).json({ error: err.sqlMessage });}
    },
    FindIngresosTipos: async(req, res)=>{
        try {
            const [result] = await CatalogoService.FindIngresosTipos();
            res.status(200).send(result);
        } catch (err) {return res.status(400).json({ error: err.sqlMessage });}
    }
}

module.exports = CatalogoController;