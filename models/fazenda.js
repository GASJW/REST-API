const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Fazenda = sequelize.define(
  "Fazenda",
  {
    idFazenda: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    descFazenda: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    CNPJ: {
      type: DataTypes.STRING(14),
      allowNull: false,
    },
    hasFazenda: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    CreatedDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
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
  },
  {
    tableName: "tblFazenda",
    timestamps: false,
  }
);

module.exports = Fazenda;
