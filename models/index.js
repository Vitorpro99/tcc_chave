const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(

    config.DB,
    config.USER,
    config.PASSWORD,
    config

);

const db = { };

db.Sequelize = Sequelize;

db.sequelize = sequelize;

db.veiculo  = require("./veiculo.model.js") (sequelize, Sequelize);
db.usuario  = require("./usuario.model.js") (sequelize, Sequelize);
db.setor    = require("./setor.model.js") (sequelize, Sequelize);; 
db.ipva     = require("./ipva.model.js") (sequelize, Sequelize);;
db.manutencao = require("./manutencao.model.js") (sequelize, Sequelize);;
db.multa    = require("./multa.model.js") (sequelize, Sequelize);;
db.seguro   = require("./seguro.model.js") (sequelize, Sequelize);
module.exports = db;


// Relação 1:1 entre Usuário e Setor
db.usuario.hasOne(db.setor, {
    as: 'setorResponsavel',
    foreignKey: 'usuarioId'
});
db.setor.belongsTo(db.usuario, {
    foreignKey: 'usuarioId'
});

// Relação 1:* entre Setor e Veículo
db.setor.hasMany(db.veiculo, {
    as: 'veiculosSetor',
    foreignKey: 'setorId'
});
db.veiculo.belongsTo(db.setor, {
    foreignKey: 'setorId'
});

// Relação 1:1 entre Veículo e IPVA
db.veiculo.hasOne(db.ipva, {
    as: 'ipvaVeiculo',
    foreignKey: 'veiculoId'
});

// Adicione um alias aqui para resolver a colisão.
db.ipva.belongsTo(db.veiculo, {
    as: 'veiculoAssociado', 
    foreignKey: 'veiculoId'
});

// Relação 1:* entre Veículo e Manutenção
db.veiculo.hasMany(db.manutencao, {
    as: 'manutencoes',
    foreignKey: 'veiculoId'
});
db.manutencao.belongsTo(db.veiculo, {
    foreignKey: 'veiculoId'
});

// Relação 1:1 entre Veículo e Seguro
db.veiculo.hasOne(db.seguro, {
    as: 'seguro',
    foreignKey: 'veiculoId'
});
db.seguro.belongsTo(db.veiculo, {
    foreignKey: 'veiculoId'
});

// Relação 1:* entre Veículo e Multa
db.veiculo.hasMany(db.multa, {
    as: 'multas',
    foreignKey: 'veiculoId'
});
db.multa.belongsTo(db.veiculo, {
    foreignKey: 'veiculoId'
});