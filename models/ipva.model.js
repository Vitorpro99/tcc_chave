module.exports = (sequelize,Sequelize) =>{
    const ipva = this.sequelize.define("ipva",{
        ano: {type: this.Sequelize.STRING},
        valor: {type: this.Sequelize.DOUBLE},
        descricao: {type: this.Sequelize.STRING},
        veiculo: {type: this.Sequelize.STRING}
    },
    {
        freezeTableName: true
    });
    return ipva;
}