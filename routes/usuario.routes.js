module.exports = (app) =>{
    const usuario = require("../controllers/usuario.controller.js");

    var router = require("express").Router();

    router.post("/",usuario.create);
    
    router.get("/",usuario.findAll);
    
    router.get("/:id",usuario.findOne);
    
    router.put("/:id",usuario.update);
    
    router.delete("/:id",usuario.delete);

    router.delete("/",usuario.deleteAll);

    router.post("/login", usuario.login);

    app.use("/usuarios",router);
};