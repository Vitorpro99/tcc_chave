module.exports = (app) =>{
    const manutencao = require("../controllers/manutencao.controller.js");

    var router = require("express").Router();

    router.post("/",manutencao.create);
    
    router.get("/",manutencao.findAll);
    
    router.get("/:id",manutencao.findOne);
    
    router.put("/:id",manutencao.update);
    
    router.delete("/:id",manutencao.delete);

    router.delete("/",manutencao.deleteAll);

    app.use("/manuntencoes",router);
};