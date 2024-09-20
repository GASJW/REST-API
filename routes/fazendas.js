const express = require("express");
const router = express.Router();
const { Sequelize } = require("sequelize");
const Fazenda = require("../models/fazenda");
const FazendaLog = require("../models/fazendaLog");
const sequelize = require("../config/database");

// Rota GET para "/fazendas" - Obtém todas as fazendas
router.get("/", async (req, res) => {
  try {
    const fazendas = await Fazenda.findAll();
    res.json(fazendas);
  } catch (error) {
    console.error("Erro ao buscar fazendas:", error);
    res.status(500).json({ message: "Erro ao buscar fazendas" });
  }
});

// Rota GET para "/fazendas/:id" - Obtém uma fazenda pelo ID
router.get("/:id", async (req, res) => {
  try {
    const fazenda = await Fazenda.findByPk(req.params.id);
    if (!fazenda) {
      return res.status(404).json({ message: "Fazenda não encontrada" });
    }
    res.json(fazenda);
  } catch (error) {
    console.error("Erro ao buscar fazenda:", error);
    res.status(500).json({ message: "Erro ao buscar fazenda" });
  }
});

// Rota POST para "/fazendas" - Adiciona uma nova fazenda
router.post("/", async (req, res) => {
  const { descFazenda, CNPJ, hasFazenda, idVinculo, idCliente } = req.body;
  const DateNow = Sequelize.fn("GETDATE");

  try {
    const newFazenda = await Fazenda.create({
      descFazenda,
      CNPJ,
      hasFazenda,
      idVinculo,
      idCliente,
      CreatedDate: DateNow,
    });

    await FazendaLog.create({
      idFazenda: newFazenda.idFazenda,
      descFazenda: newFazenda.descFazenda,
      CNPJ: newFazenda.CNPJ,
      hasFazenda: newFazenda.hasFazenda,
      CreatedDate: DateNow,
      ModifiedDate: DateNow,
      idVinculo: newFazenda.idVinculo,
      idCliente: newFazenda.idCliente,
      DateStamp: DateNow,
      ActionStamp: "C",
      UserStamp: req.user ? req.user.id : null,
    });

    res.status(201).json(newFazenda);
  } catch (error) {
    console.error("Erro ao criar fazenda:", error);
    res.status(400).json({ message: "Erro ao criar fazenda" });
  }
});

// Rota PATCH para "/fazendas/:id" - Atualiza uma fazenda pelo ID
router.patch("/:id", async (req, res) => {
  const { descFazenda, CNPJ, hasFazenda, idVinculo, idCliente } = req.body;
  const DateNow = Sequelize.fn("GETDATE");
  const transaction = await sequelize.transaction();

  try {
    const fazenda = await Fazenda.findByPk(req.params.id);
    if (!fazenda) {
      return res.status(404).json({ message: "Fazenda não encontrada" });
    }

    fazenda.descFazenda = descFazenda;
    fazenda.CNPJ = CNPJ;
    fazenda.hasFazenda = hasFazenda;
    fazenda.idVinculo = idVinculo;
    fazenda.idCliente = idCliente;
    fazenda.ModifiedDate = DateNow;

    await fazenda.save({ transaction });

    const fazendaLogData = {
      idFazenda: fazenda.idFazenda,
      descFazenda: fazenda.descFazenda,
      CNPJ: fazenda.CNPJ,
      hasFazenda: fazenda.hasFazenda,
      CreatedDate: new Date(fazenda.CreatedDate)
        .toISOString()
        .slice(0, 19)
        .replace("T", " "),
      ModifiedDate: DateNow,
      idVinculo: fazenda.idVinculo,
      idCliente: fazenda.idCliente,
      DateStamp: DateNow,
      ActionStamp: "U",
      UserStamp: req.user ? req.user.id : null,
    };

    await sequelize.query(
      `
      INSERT INTO tblFazendaLog (idFazenda, descFazenda, CNPJ, hasFazenda, CreatedDate, ModifiedDate, idVinculo, idCliente, DateStamp, ActionStamp, UserStamp)
      VALUES (:idFazenda, :descFazenda, :CNPJ, :hasFazenda, :CreatedDate, GETDATE(), :idVinculo, :idCliente, GETDATE(), :ActionStamp, :UserStamp)
    `,
      {
        replacements: {
          idFazenda: fazendaLogData.idFazenda,
          descFazenda: fazendaLogData.descFazenda,
          CNPJ: fazendaLogData.CNPJ,
          hasFazenda: fazendaLogData.hasFazenda,
          CreatedDate: fazendaLogData.CreatedDate,
          idVinculo: fazendaLogData.idVinculo,
          idCliente: fazendaLogData.idCliente,
          ActionStamp: fazendaLogData.ActionStamp,
          UserStamp: fazendaLogData.UserStamp || null,
        },
        transaction,
      }
    );

    await transaction.commit();
    res.json(fazenda);
  } catch (error) {
    console.error("Erro ao atualizar fazenda:", error);
    res.status(400).json({ message: "Erro ao atualizar fazenda" });
  }
});

// Rota DELETE para "/fazendas/:id" - Deleta uma fazenda pelo ID
router.delete("/:id", async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const fazenda = await Fazenda.findByPk(req.params.id, { transaction });
    if (!fazenda) {
      await transaction.rollback();
      return res.status(404).json({ message: "Fazenda não encontrada" });
    }

    const fazendaLogData = {
      idFazenda: fazenda.idFazenda,
      descFazenda: fazenda.descFazenda,
      CNPJ: fazenda.CNPJ,
      hasFazenda: fazenda.hasFazenda,
      CreatedDate: new Date(fazenda.CreatedDate)
        .toISOString()
        .slice(0, 19)
        .replace("T", " "),
      ModifiedDate: Sequelize.fn("GETDATE"),
      idVinculo: fazenda.idVinculo,
      idCliente: fazenda.idCliente,
      DateStamp: Sequelize.fn("GETDATE"),
      ActionStamp: "D",
      UserStamp: req.user ? req.user.id : null,
    };

    await sequelize.query(
      `
      INSERT INTO tblFazendaLog (idFazenda, descFazenda, CNPJ, hasFazenda, CreatedDate, ModifiedDate, idVinculo, idCliente, DateStamp, ActionStamp, UserStamp)
      VALUES (:idFazenda, :descFazenda, :CNPJ, :hasFazenda, :CreatedDate, GETDATE(), :idVinculo, :idCliente, GETDATE(), :ActionStamp, :UserStamp)
    `,
      {
        replacements: {
          idFazenda: fazendaLogData.idFazenda,
          descFazenda: fazendaLogData.descFazenda,
          CNPJ: fazendaLogData.CNPJ,
          hasFazenda: fazendaLogData.hasFazenda,
          CreatedDate: fazendaLogData.CreatedDate,
          idVinculo: fazendaLogData.idVinculo,
          idCliente: fazendaLogData.idCliente,
          ActionStamp: fazendaLogData.ActionStamp,
          UserStamp: fazendaLogData.UserStamp || null,
        },
        transaction,
      }
    );

    await fazenda.destroy({ transaction });

    await transaction.commit();

    res.json({ message: "Fazenda deletada com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar fazenda:", error);
    res.status(500).json({ message: "Erro ao deletar fazenda" });
  }
});

module.exports = router;
