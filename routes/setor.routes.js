module.exports = (app) =>{
    const setor = require("../controllers/setor.controller.js");

    var router = require("express").Router();

    router.post("/",setor.create);
    
    router.get("/",setor.findAll);
    
    router.get("/:id",setor.findOne);
    
    router.put("/:id",setor.update);
    
    router.delete("/:id",setor.delete);

    router.delete("/",setor.deleteAll);

    app.use("/setores",router);
};