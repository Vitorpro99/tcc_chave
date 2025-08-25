module.exports = {sequelize, Sequelize} => {
    const seguro = this.sequelize.define("seguro",{
        numeroApolice: {type: this.Sequelize.INTEGER},
        dataInicio: {type: this.Sequelize.DATEONLY},
        dataFim:{ type: this.Sequelize.DATEONLY},
        dataInicio: {type: this.Sequelize.DOUBLE},
        dataFim: {type: this.Sequelize.DOUBLE},
        status: {type: this.Sequelize.STRING},
        franquia: {type: this.Sequelize.DOUBLE},
        tipoSeguro:{ type: this.Sequelize.STRING}
    },
    {
        freezeTableName: true
    }
)
    return seguro;
}