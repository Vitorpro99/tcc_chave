module.exports = {sequelize, Sequelize} => {
    const setor = this.sequelize.define("setor", {
        nome: {type: this.Sequelize.STRING},
        veiculos: {type:this.Sequelize.STRING},
        //gestor

    },
{
    freezeTableName: true
});
    return setor;
}