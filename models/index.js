const config = require("../config/db.config.js");
const Sequelize = require("sequelize");

let sequelize;

// --- MUDANÇA PRINCIPAL: LÓGICA DE CONEXÃO ---

// 1. Se existir a variável DATABASE_URL (Modo Render/Produção)
if (process.env.DATABASE_URL) {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: "postgres",
        protocol: "postgres",
        dialectOptions: {
            ssl: {
                require: true, // OBRIGA O USO DE SSL
                rejectUnauthorized: false // Aceita o certificado do Render sem reclamar
            }
        },
        logging: false // Limpa o terminal (opcional)
    });
} 
// 2. Caso contrário, usa a config local (Modo Desenvolvimento no seu PC)
else {
    sequelize = new Sequelize(
        config.DB,
        config.USER,
        config.PASSWORD,
        config
    );
}
// ---------------------------------------------

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
db.veiculo.belongsTo(db.setor, {
    as: 'setor', 
    foreignKey: 'setorId'
});

// --- 3. Veículo e IPVA ---
db.veiculo.hasMany(db.ipva, {
    as: 'ipvaVeiculo', 
    foreignKey: 'veiculoId'
});
db.ipva.belongsTo(db.veiculo, {
    as: 'veiculo',
    foreignKey: 'veiculoId'
});

// --- 4. Veículo e Manutenção ---
db.veiculo.hasMany(db.manutencao, {
    as: 'manutencoes',
    foreignKey: 'veiculoId'
});
db.manutencao.belongsTo(db.veiculo, {
    as: 'veiculo',
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
db.veiculo.hasMany(db.transferencia, { foreignKey: 'veiculoId' });
db.transferencia.belongsTo(db.veiculo, { foreignKey: 'veiculoId', as: 'veiculo' });

db.usuario.hasMany(db.transferencia, { foreignKey: 'usuarioSolicitanteId' });
db.transferencia.belongsTo(db.usuario, { foreignKey: 'usuarioSolicitanteId', as: 'solicitante' });

db.setor.hasMany(db.transferencia, { foreignKey: 'setorOrigemId' });
db.transferencia.belongsTo(db.setor, { foreignKey: 'setorOrigemId', as: 'setorOrigem' });

db.setor.hasMany(db.transferencia, { foreignKey: 'setorDestinoId' });
db.transferencia.belongsTo(db.setor, { foreignKey: 'setorDestinoId', as: 'setorDestino' });