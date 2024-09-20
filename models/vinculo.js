const { Sequelize, DataTypes } = require("sequelize");

// Conexão com o banco de dados SQL Server
const sequelize = new Sequelize("database_name", "username", "password", {
  host: "10.0.2.15", // Coloque o IP ou hostname do seu SQL Server
  dialect: "mssql", // O dialeto que vamos usar para SQL Server
});

// Definindo o model do Vinculo
const Vinculo = sequelize.define("Vinculo", {
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userChannel: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
});

// Sincronizando o model com o banco de dados
(async () => {
  await sequelize.sync();
})();

module.exports = Vinculo;
