const express = require("express");
const router = express.Router();
const { Sequelize } = require("sequelize");
const Contrato = require("../models/contrato");
const ContratoLog = require("../models/contratoLog");
const sequelize = require("../config/database");

// Rota GET para "/contratos" - Obtém todos os contratos
router.get("/", async (req, res) => {
  try {
    const contratos = await Contrato.findAll();
    res.json(contratos);
  } catch (error) {
    console.error("Erro ao buscar contratos:", error);
    res.status(500).json({ message: "Erro ao buscar contratos" });
  }
});

// Rota GET para "/contratos/:id" - Obtém um contrato pelo ID
router.get("/:id", async (req, res) => {
  try {
    const contrato = await Contrato.findByPk(req.params.id);
    if (!contrato) {
      return res.status(404).json({ message: "Contrato não encontrado" });
    }
    res.json(contrato);
  } catch (error) {
    console.error("Erro ao buscar contrato:", error);
    res.status(500).json({ message: "Erro ao buscar contrato" });
  }
});

// Rota POST para "/contratos" - Adiciona um novo contrato
router.post("/", async (req, res) => {
  const {
    numContrato,
    dtPrazoAssinatura,
    dtVencimento,
    idCliente,
    idTipoContrato,
  } = req.body;
  const DateNow = Sequelize.fn("GETDATE");

  try {
    const newContrato = await Contrato.create({
      numContrato,
      dtPrazoAssinatura,
      dtVencimento,
      idCliente,
      idTipoContrato,
      CreatedDate: DateNow,
    });

    await ContratoLog.create({
      idContrato: newContrato.idContrato,
      numContrato: newContrato.numContrato,
      dtPrazoAssinatura: newContrato.dtPrazoAssinatura,
      dtVencimento: newContrato.dtVencimento,
      CreatedDate: DateNow,
      ModifiedDate: DateNow,
      idCliente: newContrato.idCliente,
      idTipoContrato: newContrato.idTipoContrato,
      DateStamp: DateNow,
      ActionStamp: "C",
      UserStamp: req.user ? req.user.id : null,
    });

    res.status(201).json(newContrato);
  } catch (error) {
    console.error("Erro ao criar contrato:", error);
    res.status(400).json({ message: "Erro ao criar contrato" });
  }
});

// Rota PATCH para "/contratos/:id" - Atualiza um contrato pelo ID
router.patch("/:id", async (req, res) => {
  const {
    numContrato,
    dtPrazoAssinatura,
    dtVencimento,
    idCliente,
    idTipoContrato,
  } = req.body;
  const DateNow = Sequelize.fn("GETDATE");
  const transaction = await sequelize.transaction();

  try {
    const contrato = await Contrato.findByPk(req.params.id);
    if (!contrato) {
      return res.status(404).json({ message: "Contrato não encontrado" });
    }

    contrato.numContrato = numContrato;
    contrato.dtPrazoAssinatura = dtPrazoAssinatura;
    contrato.dtVencimento = dtVencimento;
    contrato.idCliente = idCliente;
    contrato.idTipoContrato = idTipoContrato;
    contrato.ModifiedDate = DateNow;

    await contrato.save({ transaction });

    const contratoLogData = {
      idContrato: contrato.idContrato,
      numContrato: contrato.numContrato,
      dtPrazoAssinatura: contrato.dtPrazoAssinatura,
      dtVencimento: contrato.dtVencimento,
      CreatedDate: new Date(contrato.CreatedDate)
        .toISOString()
        .slice(0, 19)
        .replace("T", " "),
      ModifiedDate: DateNow,
      idCliente: contrato.idCliente,
      idTipoContrato: contrato.idTipoContrato,
      DateStamp: DateNow,
      ActionStamp: "U",
      UserStamp: req.user ? req.user.id : null,
    };

    await sequelize.query(
      `
      INSERT INTO tblContratoLog (idContrato, numContrato, dtPrazoAssinatura, dtVencimento, CreatedDate, ModifiedDate, idCliente, idTipoContrato, DateStamp, ActionStamp, UserStamp)
      VALUES (:idContrato, :numContrato, :dtPrazoAssinatura, :dtVencimento, :CreatedDate, GETDATE(), :idCliente, :idTipoContrato, GETDATE(), :ActionStamp, :UserStamp)
    `,
      {
        replacements: {
          idContrato: contratoLogData.idContrato,
          numContrato: contratoLogData.numContrato,
          dtPrazoAssinatura: contratoLogData.dtPrazoAssinatura,
          dtVencimento: contratoLogData.dtVencimento,
          CreatedDate: contratoLogData.CreatedDate,
          idCliente: contratoLogData.idCliente,
          idTipoContrato: contratoLogData.idTipoContrato,
          ActionStamp: contratoLogData.ActionStamp,
          UserStamp: contratoLogData.UserStamp || null,
        },
        transaction,
      }
    );

    await transaction.commit();
    res.json(contrato);
  } catch (error) {
    console.error("Erro ao atualizar contrato:", error);
    res.status(400).json({ message: "Erro ao atualizar contrato" });
  }
});

// Rota DELETE para "/contratos/:id" - Deleta um contrato pelo ID
router.delete("/:id", async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const contrato = await Contrato.findByPk(req.params.id, { transaction });
    if (!contrato) {
      await transaction.rollback();
      return res.status(404).json({ message: "Contrato não encontrado" });
    }

    const contratoLogData = {
      idContrato: contrato.idContrato,
      numContrato: contrato.numContrato,
      dtPrazoAssinatura: contrato.dtPrazoAssinatura,
      dtVencimento: contrato.dtVencimento,
      CreatedDate: new Date(contrato.CreatedDate)
        .toISOString()
        .slice(0, 19)
        .replace("T", " "),
      ModifiedDate: Sequelize.fn("GETDATE"),
      idCliente: contrato.idCliente,
      idTipoContrato: contrato.idTipoContrato,
      DateStamp: Sequelize.fn("GETDATE"),
      ActionStamp: "D",
      UserStamp: req.user ? req.user.id : null,
    };

    await sequelize.query(
      `
      INSERT INTO tblContratoLog (idContrato, numContrato, dtPrazoAssinatura, dtVencimento, CreatedDate, ModifiedDate, idCliente, idTipoContrato, DateStamp, ActionStamp, UserStamp)
      VALUES (:idContrato, :numContrato, :dtPrazoAssinatura, :dtVencimento, :CreatedDate, GETDATE(), :idCliente, :idTipoContrato, GETDATE(), :ActionStamp, :UserStamp)
    `,
      {
        replacements: {
          idContrato: contratoLogData.idContrato,
          numContrato: contratoLogData.numContrato,
          dtPrazoAssinatura: contratoLogData.dtPrazoAssinatura,
          dtVencimento: contratoLogData.dtVencimento,
          CreatedDate: contratoLogData.CreatedDate,
          idCliente: contratoLogData.idCliente,
          idTipoContrato: contratoLogData.idTipoContrato,
          ActionStamp: contratoLogData.ActionStamp,
          UserStamp: contratoLogData.UserStamp || null,
        },
        transaction,
      }
    );

    await contrato.destroy({ transaction });

    await transaction.commit();

    res.json({ message: "Contrato deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar contrato:", error);
    res.status(500).json({ message: "Erro ao deletar contrato" });
  }
});

module.exports = router;
