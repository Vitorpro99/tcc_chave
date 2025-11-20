module.exports = (app) => {
    const dashboard = require("../controllers/dashboard.controller.js");
    const { verifyToken } = require("../middleware/authJwt.js");

    var router = require("express").Router();

    router.get("/resumo", [verifyToken], dashboard.getResumo);

    app.use("/dashboard", router);
};