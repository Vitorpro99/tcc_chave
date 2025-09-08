module.exports = (sequelize,Sequelize) =>{
    const multa = sequelize.define("multa",{
        data: Sequelize.DATEONLY,
        valor: Sequelize.DOUBLE,
        descricao:Sequelize.STRING,
        veiculoId: {type: Sequelize.INTEGER},
        usuarioId: {type: Sequelize.INTEGER}
    },
    {
        freezeTableName:true
    }
)
    return multa;
}