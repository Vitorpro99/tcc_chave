module.exports = (sequelize, Sequelize) => {
    const transferencia = sequelize.define("transferencia", {
        // ID do setor que está a enviar (o dono atual)
        setorOrigemId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        setorDestinoId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        veiculoId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        usuarioSolicitanteId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        // O estado do pedido
        status: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'pendente'
        },
        dataResolucao: {
            type: Sequelize.DATE
        },
        motivo: {
            type: Sequelize.STRING,
            allowNull: false
        }
    },
    {
        freezeTableName: true
    });
    return transferencia;
};