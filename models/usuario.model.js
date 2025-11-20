module.exports = (sequelize, Sequelize) => {
    const Usuario = sequelize.define("usuario", {
        nome: { type: Sequelize.STRING },
        senha: { type: Sequelize.STRING },
        email: { type: Sequelize.STRING },
        numero_reg: { type: Sequelize.INTEGER },

        setorId: { type: Sequelize.INTEGER },

        gestor: { type: Sequelize.BOOLEAN }, 
        admin: { type: Sequelize.BOOLEAN }  
    },
    {
        freezeTableName: true
    });
    return Usuario;
}