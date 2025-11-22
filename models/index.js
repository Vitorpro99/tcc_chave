const config = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD,
    config
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Importação dos Modelos
db.veiculo  = require("./veiculo.model.js")(sequelize, Sequelize);
db.usuario  = require("./usuario.model.js")(sequelize, Sequelize);
db.setor    = require("./setor.model.js")(sequelize, Sequelize);
db.ipva     = require("./ipva.model.js")(sequelize, Sequelize);
db.manutencao = require("./manutencao.model.js")(sequelize, Sequelize);
db.multa    = require("./multa.model.js")(sequelize, Sequelize);
db.seguro   = require("./seguro.model.js")(sequelize, Sequelize);
db.transferencia = require("./transferencia.model.js")(sequelize, Sequelize);

module.exports = db;

// ==========================================
// DEFINIÇÃO DAS RELAÇÕES
// ==========================================

// --- 1. Usuário e Setor ---
db.setor.hasMany(db.usuario, {
    as: 'funcionarios',
    foreignKey: 'setorId'
});
db.usuario.belongsTo(db.setor, {
    as: 'setorTrabalho',
    foreignKey: 'setorId'
});

// --- 2. Veículo e Setor ---
db.setor.hasMany(db.veiculo, {
    as: 'veiculosSetor',
    foreignKey: 'setorId'
});
// CORREÇÃO IMPORTANTE: Adicionado as: 'setor' para bater com o Controller
db.veiculo.belongsTo(db.setor, {
    as: 'setor', // <--- ESTA LINHA É OBRIGATÓRIA
    foreignKey: 'setorId'
});

// --- 3. Veículo e IPVA (1:N) ---
// Um veículo tem muitos IPVAs (histórico)
db.veiculo.hasMany(db.ipva, {
    as: 'ipvaVeiculo', 
    foreignKey: 'veiculoId'
});
db.ipva.belongsTo(db.veiculo, {
    as: 'veiculo', // Simplificado
    foreignKey: 'veiculoId'
});

// --- 4. Veículo e Manutenção ---
db.veiculo.hasMany(db.manutencao, {
    as: 'manutencoes',
    foreignKey: 'veiculoId'
});
db.manutencao.belongsTo(db.veiculo, {
    as: 'veiculo', // É útil ter o inverso também
    foreignKey: 'veiculoId'
});

// --- 5. Veículo e Seguro ---
db.veiculo.hasOne(db.seguro, {
    as: 'seguro',
    foreignKey: 'veiculoId'
});
db.seguro.belongsTo(db.veiculo, {
    as: 'veiculo',
    foreignKey: 'veiculoId'
});

// --- 6. Veículo e Multa ---
db.veiculo.hasMany(db.multa, {
    as: 'multas',
    foreignKey: 'veiculoId'
});
db.multa.belongsTo(db.veiculo, {
    as: 'veiculo',
    foreignKey: 'veiculoId'
});

// --- 7. Transferências ---
// Veículo
db.veiculo.hasMany(db.transferencia, { foreignKey: 'veiculoId' });
db.transferencia.belongsTo(db.veiculo, { foreignKey: 'veiculoId', as: 'veiculo' });

// Solicitante (Usuário)
db.usuario.hasMany(db.transferencia, { foreignKey: 'usuarioSolicitanteId' });
db.transferencia.belongsTo(db.usuario, { foreignKey: 'usuarioSolicitanteId', as: 'solicitante' });

// Setor Origem
db.setor.hasMany(db.transferencia, { foreignKey: 'setorOrigemId' });
db.transferencia.belongsTo(db.setor, { foreignKey: 'setorOrigemId', as: 'setorOrigem' });

// Setor Destino
db.setor.hasMany(db.transferencia, { foreignKey: 'setorDestinoId' });
db.transferencia.belongsTo(db.setor, { foreignKey: 'setorDestinoId', as: 'setorDestino' });