module.exports = (sequelize, Sequelize) => {
    const seguro = sequelize.define("seguro",{
        numeroApolice: {type: Sequelize.INTEGER},
        dataInicio: {type: Sequelize.DATEONLY},
        dataFim:{ type: Sequelize.DATEONLY},
        dataInicio: {type: Sequelize.DOUBLE},
        dataFim: {type: Sequelize.DOUBLE},
        status: {type: Sequelize.STRING},
        franquia: {type: Sequelize.DOUBLE},
        tipoSeguro:{ type: Sequelize.STRING}
    },
    {
        freezeTableName: true
    }
)
    return seguro;
}