module.exports = (app) =>{
    const veiculo = require("../controllers/veiculo.controller.js");

    var router = require("express").Router();

    router.post("/",veiculo.create);
    
    router.get("/",veiculo.findAll);
    
    router.get("/:id",veiculo.findOne);
    
    router.put("/:id",veiculo.update);
    
    router.delete("/:id",veiculo.delete);

    router.delete("/",veiculo.deleteAll);

    app.use("/api/veiculos",router);
};