const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const FazendaLog = sequelize.define(
  "FazendaLog",
  {
    idLog: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idFazenda: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    descFazenda: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    CNPJ: {
      type: DataTypes.STRING(14),
      allowNull: false,
    },
    hasFazenda: {
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
    idVinculo: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    idCliente: {
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
    tableName: "tblFazendaLog",
    timestamps: false,
  }
);

module.exports = FazendaLog;
