const express = require("express");
const router = express.Router();
const statusContrato = require("../models/statusContrato"); // Importa o modelo criado

// Rota GET para "/statusContratos" - Obtém todos os Status do Contratos
router.get("/", async (req, res) => {
  try {
    const statusContratos = await statusContrato.findAll();
    res.json(statusContratos);
  } catch (error) {
    console.error("Erro ao buscar Status do Contratos:", error);
    res.status(500).json({ message: "Erro ao buscar Status do Contratos" });
  }
});

// Rota GET para "/statusContratos/:id" - Obtém um Status do Contrato pelo ID
router.get("/:id", async (req, res) => {
  try {
    const statusContrato = await statusContrato.findByPk(req.params.id);
    if (!statusContrato) {
      return res
        .status(404)
        .json({ message: "Status do Contrato não encontrado" });
    }
    res.json(statusContrato);
  } catch (error) {
    console.error("Erro ao buscar Status do Contrato:", error);
    res.status(500).json({ message: "Erro ao buscar Status do Contrato" });
  }
});

// Rota POST para "/statusContratos" - Adiciona um novo Status do Contrato
router.post("/", async (req, res) => {
  const { descStatusContrato, isActive } = req.body;

  try {
    const newStatusContrato = await statusContrato.create({
      descStatusContrato,
      isActive,
    });
    res.status(201).json(newStatusContrato);
  } catch (error) {
    console.error("Erro ao criar Status do Contrato:", error);
    res.status(400).json({ message: "Erro ao criar Status do Contrato" });
  }
});

// Rota PUT para "/statusContratos/:id" - Atualiza um Status do Contrato pelo ID
router.put("/:id", async (req, res) => {
  const { descStatusContrato, isActive } = req.body;

  try {
    const statusContrato = await statusContrato.findByPk(req.params.id);
    if (!statusContrato) {
      return res
        .status(404)
        .json({ message: "Status do Contrato não encontrado" });
    }

    statusContrato.descStatusContrato = descStatusContrato;
    statusContrato.isActive = isActive;

    await statusContrato.save();
    res.json(statusContrato);
  } catch (error) {
    console.error("Erro ao atualizar Status do Contrato:", error);
    res.status(400).json({ message: "Erro ao atualizar Status do Contrato" });
  }
});

// Rota DELETE para "/statusContratos/:id" - Deleta um Status do Contrato pelo ID
router.delete("/:id", async (req, res) => {
  try {
    const statusContrato = await statusContrato.findByPk(req.params.id);
    if (!statusContrato) {
      return res
        .status(404)
        .json({ message: "Status do Contrato não encontrado" });
    }

    await statusContrato.destroy();
    res.json({ message: "Status do Contrato deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar Status do Contrato:", error);
    res.status(500).json({ message: "Erro ao deletar Status do Contrato" });
  }
});

module.exports = router;
