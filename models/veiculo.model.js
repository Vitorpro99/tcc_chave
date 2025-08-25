module.exports = {sequelize,Sequelize} => {
    const veiculo = this.sequelize.define( "veiculo",{
        marca: {type: this.Sequelize.STRING},
        modelo: {type: this.Sequelize.STRING},
        ano: {type: this.Sequelize.INTEGER},
        kilometragem: {type: this.Sequelize.FLOAT},
        // possuidor: {type: this.Sequelize}
        dataAquisicao: {type: this.Sequelize.DATEONLY}
    },
    {
        freezeTableName: true
    }
);
    return veiculo;
}