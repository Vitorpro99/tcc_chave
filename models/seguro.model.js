module.exports = (sequelize, Sequelize) => {
    const Seguro = sequelize.define("seguro", {
        numeroApolice: { type: Sequelize.INTEGER },
        
        dataInicio: { type: Sequelize.DATE }, 
        dataFim: { type: Sequelize.DATE },

        valor: { type: Sequelize.DOUBLE }, 
        // -------------------------------------

        status: { type: Sequelize.STRING },
        franquia: { type: Sequelize.DOUBLE },
        tipoSeguro: { type: Sequelize.STRING },
        
        veiculoId: { type: Sequelize.INTEGER } 
    },
    {
        freezeTableName: true
    });
    return Seguro;
};