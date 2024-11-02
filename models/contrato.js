const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Cliente = require("./cliente");
const TipoContrato = require("./tipoContrato");
const StatusContrato = require("./statusContrato");

const Contrato = sequelize.define(
  "Contrato",
  {
    idContrato: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    numContrato: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    dtPrazoAssinatura: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    dtVencimento: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isActive: {
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
    idCliente: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    idTipoContrato: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    idStatusContrato: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "tblContrato",
    timestamps: false,
  }
);

Contrato.belongsTo(Cliente, { foreignKey: "idCliente" });
Contrato.belongsTo(TipoContrato, { foreignKey: "idTipoContrato" });
Contrato.belongsTo(StatusContrato, { foreignKey: "idStatusContrato" });

module.exports = Contrato;
