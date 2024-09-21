const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ContratoLog = sequelize.define(
  "ContratoLog",
  {
    idLog: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idContrato: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    numContrato: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    dtPrazoAssinatura: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dtVencimento: {
      type: DataTypes.DATE,
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
    idCliente: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    idTipoContrato: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    idTipoContrato: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    DateStamp: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
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
    tableName: "tblContratoLog",
    timestamps: false,
  }
);

module.exports = ContratoLog;
