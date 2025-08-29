module.exports = (sequelize,Sequelize) =>{
    const manutencao = sequelize.define("mauntencao",{
        data: {type: Sequelize.DATEONLY},
        tipo: {type: Sequelize.STRING},
        valor: {type: Sequelize.DOUBLE},
        observacoes: {type: Sequelize.STRING},
        // veiculo:
    },
{
    freezeTableName:true
})
    return manutencao
}