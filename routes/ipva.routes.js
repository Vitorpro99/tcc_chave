module.exports = (app) =>{
    const ipva = require("../controllers/ipva.controller.js");

    var router = require("express").Router();

    router.post("/",ipva.create);
    
    router.get("/",ipva.findAll);
    
    router.get("/:id",ipva.findOne);
    
    router.put("/:id",ipva.update);
    
    router.delete("/:id",ipva.delete);

    router.delete("/",ipva.deleteAll);

    app.use("/ipvas",router);
};