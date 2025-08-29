module.exports = (sequelize,Sequelize) =>{
    const multa = sequelize.define("multa",{
        data: Sequelize.DATEONLY,
        valor: Sequelize.DOUBLE,
        descricao:Sequelize.STRING
    },
    {
        freezeTableName:true
    }
)
    return multa;
}