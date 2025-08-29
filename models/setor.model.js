module.exports = (sequelize, Sequelize) => {
    const setor = sequelize.define("setor", {
        nome: {type: Sequelize.STRING},
        veiculos: {type:Sequelize.STRING},
        //gestor

    },
{
    freezeTableName: true
});
    return setor;
}