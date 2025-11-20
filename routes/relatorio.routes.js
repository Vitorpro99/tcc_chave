module.exports = (app) => {
    const relatorio = require("../controllers/relatorio.controller.js");
    const { verifyToken } = require("../middleware/authJwt.js");

    var router = require("express").Router();

    // Rota: GET /relatorios/manutencoes?dataInicio=...&dataFim=...
    router.get("/manutencoes", [verifyToken], relatorio.getRelatorioManutencao);

    app.use("/relatorios", router);
};