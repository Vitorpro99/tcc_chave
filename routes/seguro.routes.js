module.exports = (app) =>{
    const seguro = require("../controllers/seguro.controller.js");

    var router = require("express").Router();

    router.post("/",seguro.create);
    
    router.get("/",seguro.findAll);
    
    router.get("/:id",seguro.findOne);
    
    router.put("/:id",seguro.update);
    
    router.delete("/:id",seguro.delete);

    router.delete("/",seguro.deleteAll);

    app.use("/seguros",router);
};