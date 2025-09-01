module.exports = (sequelize,Sequelize) => {
    const veiculo = sequelize.define( "veiculo",{
        marca: {type: Sequelize.STRING},
        modelo: {type: Sequelize.STRING},
        ano: {type: Sequelize.INTEGER},
        kilometragem: {type: Sequelize.FLOAT},
        // possuidor: {type: Sequelize}
        dataAquisicao: {type: Sequelize.DATEONLY},
        placa: {type: Sequelize.placa}
    },
    {
        freezeTableName: true
    }
);
    return veiculo;
}