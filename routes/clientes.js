const express = require("express");
const router = express.Router();
const { Sequelize } = require("sequelize"); // Importa o Sequelize
const moment = require("moment");
const Cliente = require("../models/cliente"); // Importa o modelo criado
const ClienteLog = require("../models/clienteLog");
const sequelize = require("../config/database");

// Rota GET para "/clientes" - Obtém todos os clientes
router.get("/", async (req, res) => {
  try {
    const clientes = await Cliente.findAll();
    res.json(clientes);
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    res.status(500).json({ message: "Erro ao buscar clientes" });
  }
});

// Rota GET para "/clientes/:id" - Obtém um cliente pelo ID
router.get("/:id", async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (!cliente) {
      return res.status(404).json({ message: "Cliente não encontrado" });
    }
    res.json(cliente);
  } catch (error) {
    console.error("Erro ao buscar cliente:", error);
    res.status(500).json({ message: "Erro ao buscar cliente" });
  }
});

// Rota POST para "/clientes" - Adiciona um novo cliente
router.post("/", async (req, res) => {
  const { descCliente, isCNPJ, CNPJ, CPF, hasCPS, isActive, idConsultor } =
    req.body;

  const DateNow = Sequelize.fn("GETDATE");

  try {
    const newCliente = await Cliente.create({
      descCliente,
      isCNPJ,
      CNPJ,
      CPF,
      hasCPS,
      isActive,
      idConsultor,
      CreatedDate: DateNow,
    });

    await ClienteLog.create({
      idCliente: newCliente.idCliente,
      descCliente: newCliente.descCliente,
      isCNPJ: newCliente.isCNPJ,
      CNPJ: newCliente.CNPJ,
      CPF: newCliente.CPF,
      hasCPS: newCliente.hasCPS,
      isActive: newCliente.isActive,
      CreatedDate: DateNow,
      ModifiedDate: DateNow,
      idConsultor: newCliente.idConsultor,
      DateStamp: DateNow,
      ActionStamp: "C", // 'C' para Create
      //UserStamp: req.user.id, // Supondo que você tenha o ID do usuário na requisição
    });

    res.status(201).json(newCliente);
  } catch (error) {
    console.error("Erro ao criar cliente:", error);
    res.status(400).json({ message: "Erro ao criar cliente" });
  }
});

// Rota PATCH para "/clientes/:id" - Atualiza um cliente pelo ID
router.patch("/:id", async (req, res) => {
  const { descCliente, isCNPJ, CNPJ, CPF, hasCPS, isActive, idConsultor } =
    req.body;

  const DateNow = Sequelize.fn("GETDATE");

  const transaction = await sequelize.transaction();

  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (!cliente) {
      return res.status(404).json({ message: "Cliente não encontrado" });
    }

    // Atualiza os campos do cliente
    cliente.descCliente = descCliente;
    cliente.isCNPJ = isCNPJ;
    cliente.CNPJ = CNPJ;
    cliente.CPF = CPF;
    cliente.hasCPS = hasCPS;
    cliente.isActive = isActive;
    cliente.idConsultor = idConsultor;
    cliente.ModifiedDate = DateNow;

    await cliente.save({ transaction });

    // Guardar as informações do cliente antes de atualizar
    const clienteLogData = {
      idCliente: cliente.idCliente,
      descCliente: cliente.descCliente,
      isCNPJ: cliente.isCNPJ,
      CNPJ: cliente.CNPJ,
      CPF: cliente.CPF,
      hasCPS: cliente.hasCPS,
      isActive: cliente.isActive,
      CreatedDate: new Date(cliente.CreatedDate)
        .toISOString()
        .slice(0, 19)
        .replace("T", " "),
      ModifiedDate: DateNow,
      idConsultor: cliente.idConsultor,
      DateStamp: DateNow,
      ActionStamp: "U",
      UserStamp: req.user ? req.user.id : null, // Supondo que você tenha o ID do usuário no request
    };

    console.log(cliente.CreatedDate, clienteLogData.CreatedDate);

    await sequelize.query(
      `
      INSERT INTO tblClienteLog (idCliente, descCliente, isCNPJ, CNPJ, CPF, hasCPS, isActive, CreatedDate, ModifiedDate, idConsultor, DateStamp, ActionStamp, UserStamp)
      VALUES (:idCliente, :descCliente, :isCNPJ, :CNPJ, :CPF, :hasCPS, :isActive, :CreatedDate, GETDATE(), :idConsultor, GETDATE(), :ActionStamp, :UserStamp)
    `,
      {
        replacements: {
          idCliente: clienteLogData.idCliente,
          descCliente: clienteLogData.descCliente,
          isCNPJ: clienteLogData.isCNPJ,
          CNPJ: clienteLogData.CNPJ || null,
          CPF: clienteLogData.CPF || null,
          hasCPS: clienteLogData.hasCPS,
          isActive: clienteLogData.isActive,
          CreatedDate: clienteLogData.CreatedDate,
          idConsultor: clienteLogData.idConsultor,
          ActionStamp: clienteLogData.ActionStamp,
          UserStamp: clienteLogData.UserStamp || null,
        },
        transaction,
      }
    );

    await transaction.commit();
    res.json(cliente);
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    res.status(400).json({ message: "Erro ao atualizar cliente" });
  }
});

// Rota DELETE para "/clientes/:id" - Deleta um cliente pelo ID
router.delete("/:id", async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const cliente = await Cliente.findByPk(req.params.id, { transaction });
    if (!cliente) {
      await transaction.rollback();
      return res.status(404).json({ message: "Cliente não encontrado" });
    }

    // Guardar as informações do cliente antes de deletar
    const clienteLogData = {
      idCliente: cliente.idCliente,
      descCliente: cliente.descCliente,
      isCNPJ: cliente.isCNPJ,
      CNPJ: cliente.CNPJ,
      CPF: cliente.CPF,
      hasCPS: cliente.hasCPS,
      isActive: cliente.isActive,
      CreatedDate: new Date(cliente.CreatedDate)
        .toISOString()
        .slice(0, 19)
        .replace("T", " "),
      ModifiedDate: Sequelize.fn("GETDATE"),
      idConsultor: cliente.idConsultor,
      DateStamp: Sequelize.fn("GETDATE"),
      ActionStamp: "D",
      UserStamp: req.user ? req.user.id : null, // Supondo que você tenha o ID do usuário no request
    };

    // Insere o log usando parâmetros de consulta
    await sequelize.query(
      `
      INSERT INTO tblClienteLog (idCliente, descCliente, isCNPJ, CNPJ, CPF, hasCPS, isActive, CreatedDate, ModifiedDate, idConsultor, DateStamp, ActionStamp, UserStamp)
      VALUES (:idCliente, :descCliente, :isCNPJ, :CNPJ, :CPF, :hasCPS, :isActive, :CreatedDate, GETDATE(), :idConsultor, GETDATE(), :ActionStamp, :UserStamp)
    `,
      {
        replacements: {
          idCliente: clienteLogData.idCliente,
          descCliente: clienteLogData.descCliente,
          isCNPJ: clienteLogData.isCNPJ,
          CNPJ: clienteLogData.CNPJ || null,
          CPF: clienteLogData.CPF || null,
          hasCPS: clienteLogData.hasCPS,
          isActive: clienteLogData.isActive,
          CreatedDate: clienteLogData.CreatedDate,
          idConsultor: clienteLogData.idConsultor,
          ActionStamp: clienteLogData.ActionStamp,
          UserStamp: clienteLogData.UserStamp || null,
        },
        transaction,
      }
    );

    // Deleta o cliente
    await cliente.destroy({ transaction });

    await transaction.commit();

    res.json({ message: "Cliente deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar cliente:", error);
    res.status(500).json({ message: "Erro ao deletar cliente" });
  }
});

module.exports = router;
