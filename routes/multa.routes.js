module.exports = (app) =>{
    const multa = require("../controllers/multa.controller.js");

    var router = require("express").Router();

    router.post("/",multa.create);
    
    router.get("/",multa.findAll);
    
    router.get("/:id",multa.findOne);
    
    router.put("/:id",multa.update);
    
    router.delete("/:id",multa.delete);

    router.delete("/",multa.deleteAll);

    app.use("/multas",router);
};