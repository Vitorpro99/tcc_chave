module.exports = (sequelize,Sequelize) =>{
    const usuario = sequelize.define("usuario",
        {
            nome: {type: Sequelize.STRING},
            senha: {type: Sequelize.STRING},
            email: {type: Sequelize.STRING},
            numero_reg: {type: Sequelize.INTEGER},
            setor: {type: Sequelize.STRING},
            gestor: { type: Sequelize.BOOLEAN}
        },
        {
            freezeTableName: true
        }
    )
    return usuario;
}