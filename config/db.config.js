// config/db.config.js

module.exports = {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    DB: process.env.DB_NAME,
    dialect: "postgres",
    
    // O Render geralmente usa a porta 5432
    port: process.env.DB_PORT || 5432, 
    
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },

    // Configuração de SSL Obrigatória para o Render
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false 
        }
    }
};