const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const TipoContrato = sequelize.define(
  "TipoContrato",
  {
    idTipoContrato: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    descTipoContrato: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    tableName: "tblTipoContrato",
    timestamps: false,
  }
);

module.exports = TipoContrato;
