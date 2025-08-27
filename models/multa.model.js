module.exports = (sequelize,Sequelize) =>{
    const multa = this.Sequelize.define("multa",{
        data: this.Sequelize.DATEONLY,
        valor: this.Sequelize.DOUBLE,
        descricao:this.Sequelize.STRING
    },
    {
        freezeTableName:true
    }
)
    return multa;
}