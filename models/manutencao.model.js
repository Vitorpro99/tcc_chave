module.exports = (sequelize,Sequelize) =>{
    const manutencao = sequelize.define("manutencao",{
        data: {type: Sequelize.DATEONLY},
        tipo: {type: Sequelize.STRING},
        valor: {type: Sequelize.DOUBLE},
        observacoes: {type: Sequelize.STRING},
        veiculoId: {type: Sequelize.INTEGER}
    },
{
    freezeTableName:true
})
    return manutencao
}