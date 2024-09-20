const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ClienteLog = sequelize.define(
  "ClienteLog",
  {
    idLog: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idCliente: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    descCliente: {
      type: DataTypes.STRING(100),
      allowNull: true,
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
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    CreatedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    ModifiedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    idConsultor: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    DateStamp: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    ActionStamp: {
      type: DataTypes.CHAR(1),
      allowNull: true,
    },
    UserStamp: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "tblClienteLog", // Nome da tabela no banco de dados
    timestamps: false, // Desativa os campos de timestamp automáticos (createdAt, updatedAt)
  }
);

module.exports = ClienteLog;
