module.exports = (app) => {
    const seguro = require("../controllers/seguro.controller.js");
    
    // IMPORTANTE: Adicionar segurança
    const { verifyToken } = require("../middleware/authJwt.js");

    var router = require("express").Router();

    // Rotas Protegidas
    router.post("/", [verifyToken], seguro.create);
    router.get("/", [verifyToken], seguro.findAll);
    router.get("/:id", [verifyToken], seguro.findOne);
    router.put("/:id", [verifyToken], seguro.update);
    router.delete("/:id", [verifyToken], seguro.delete);
    
    // router.delete("/", [verifyToken], seguro.deleteAll);

    app.use("/seguros", router);
};