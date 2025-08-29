module.exports = (sequelize,Sequelize) =>{
    const ipva = sequelize.define("ipva",{
        ano: {type: Sequelize.STRING},
        valor: {type: Sequelize.DOUBLE},
        descricao: {type: Sequelize.STRING},
        veiculo: {type: Sequelize.STRING}
    },
    {
        freezeTableName: true
    });
    return ipva;
}