const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Supondo que a conexão do Sequelize esteja neste arquivo

const Consultor = sequelize.define(
  "Consultor",
  {
    idConsultor: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nmConsultor: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    tableName: "tblConsultor", // Nome da tabela no banco de dados
    timestamps: false, // Desativa os campos de timestamp automáticos (createdAt, updatedAt)
  }
);

module.exports = Consultor;
