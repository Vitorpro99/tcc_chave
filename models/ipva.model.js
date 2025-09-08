module.exports = (sequelize,Sequelize) =>{
    const ipva = sequelize.define("ipva",{
        ano: {type: Sequelize.STRING},
        valor: {type: Sequelize.DOUBLE},
        descricao: {type: Sequelize.STRING},
        veiculoId: {type: Sequelize.INTEGER}
    },
    {
        freezeTableName: true
    });
    return ipva;
}