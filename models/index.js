const { SELECT } = require("sequelize/lib/query-types");
const config = require("../config/db.config.js");

const Sequilize = require("sequelize");
const sequilize = new Sequelize(

    config.DB,
    config.USER,
    config.PASSWORD,
    config

);

const db = {};

db.Sequelize = Sequilize;

db.sequelize = sequelize;

db.veiculo = require("./veiculo.model.js") (sequelize, Sequelize);

module.exports = db;