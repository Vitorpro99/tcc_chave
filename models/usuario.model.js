module.exports = (sequelize,Sequelize) =>{
    const usuario = sequelize.define("usuario",
        {
            nome: {type: Sequelize.STRING},
            email: {type: Sequelize.STRING},
            numero_reg: {type: Sequelize.STRING},
            setor: {type: Sequelize.STRING},
            gestor: { type: Sequelize.STRING}
        },
        {
            freezeTableName: true
        }
    )
    return usuario;
}