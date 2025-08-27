module.exports = (sequelize,Sequelize) =>{
    const usuario = this.sequelize.define("usuario",
        {
            nome: {type: this.Sequelize.STRING},
            email: {type: this.Sequelize.STRING},
            numero_reg: {type: this.Sequelize.STRING},
            setor: {type: this.Sequelize.STRING},
            gestor: { type: this.Sequelize.STRING}
        },{
            freezeTableName: true
        }
    )
    return usuario;
}