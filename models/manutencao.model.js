module.exports = {sequelize,Sequelize} =>{
    const manutencao = this.sequelize.define("mauntencao",{
        data: {type: this.Sequelize.DATEONLY},
        tipo: {type: this.Sequelize.STRING},
        valor: {type: this.Sequelize.DOUBLE},
        observacoes: {type: this.Sequelize.STRING},
        // veiculo:
    },
{
    freezeTableName:true
})
    return manutencao
}