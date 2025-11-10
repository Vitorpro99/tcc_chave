module.exports = (app) =>{
    const setor = require("../controllers/transferencia.controller.js");

    const transferencia = require("../controllers/transferencia.controller.js");

    var router = require("express").Router();

    router.post("/", [verifyToken], transferencia.create);
    
    router.get("/", [verifyToken], transferencia.findAll);
    
    router.get("/:id",transferencia.findOne);
    
    router.put("/:id",transferencia.update);
    
    router.delete("/:id",transferencia.delete);

    router.delete("/",transferencia.deleteAll);

    app.use("/transferencias ",router);
};