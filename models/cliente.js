const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Supondo que a conexão do Sequelize esteja neste arquivo
const { Sequelize } = require("sequelize"); // Importa o Sequelize

const Cliente = sequelize.define(
  "Cliente",
  {
    idCliente: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    descCliente: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    isCNPJ: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    CNPJ: {
      type: DataTypes.STRING(14),
      allowNull: false,
    },
    CPF: {
      type: DataTypes.STRING(11),
      allowNull: false,
    },
    hasCPS: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    CreatedDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn("GETDATE"),
    },
    ModifiedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    idConsultor: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "tblCliente", // Nome da tabela no banco de dados
    timestamps: false, // Desativa os campos de timestamp automáticos (createdAt, updatedAt)
  }
);

module.exports = Cliente;
