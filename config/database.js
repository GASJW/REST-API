const { Sequelize } = require("sequelize");
require("dotenv").config();

// Configurando a conexão do Sequelize com variáveis de ambiente do arquivo .env
const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_SERVER,
    dialect: "mssql", // Usando SQL Server
    dialectOptions: {
      options: {
        encrypt: false, // Defina como true se o servidor exigir criptografia
      },
    },
  }
);

module.exports = sequelize;
