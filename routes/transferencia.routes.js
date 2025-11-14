module.exports = (app) => {
    // 1. Importa o controller
    const transferencia = require("../controllers/transferencia.controller.js");

    // DEBUG AQUI — AGORA funciona
    console.log("DEBUG transferencia:", transferencia);

    // 2. IMPORTA O MIDDLEWARE
    const { verifyToken } = require("../middleware/authJwt.js");

    // DEBUG
    console.log("DEBUG verifyToken:", verifyToken);

    var router = require("express").Router();

    router.post("/", [verifyToken], transferencia.create);
    router.get("/", [verifyToken], transferencia.findAll);
    router.put("/:id/status", [verifyToken], transferencia.updateStatus);

    app.use("/transferencias", router);
};
