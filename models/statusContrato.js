const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const StatusContrato = sequelize.define(
  "StatusContrato",
  {
    idStatusContrato: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    descStatusContrato: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    tableName: "tblStatusContrato",
    timestamps: false,
  }
);

module.exports = StatusContrato;
