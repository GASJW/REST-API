const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { Sequelize } = require("sequelize");
const Consultor = require("./consultor"); // Supondo que você tenha um modelo Consultor

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
      allowNull: true,
    },
    CPF: {
      type: DataTypes.STRING(11),
      allowNull: true,
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
      allowNull: true,
    },
  },
  {
    tableName: "tblCliente",
    timestamps: false,
  }
);

Cliente.belongsTo(Consultor, { foreignKey: "idConsultor" });

module.exports = Cliente;
