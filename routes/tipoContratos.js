const express = require("express");
const router = express.Router();
const TipoContrato = require("../models/tipoContrato");

// Rota GET para "/tipoContratos" - Obtém todos os tipos de contrato
router.get("/", async (req, res) => {
  try {
    const tiposContrato = await TipoContrato.findAll();
    res.json(tiposContrato);
  } catch (error) {
    console.error("Erro ao buscar tipos de contrato:", error);
    res.status(500).json({ message: "Erro ao buscar tipos de contrato" });
  }
});

// Rota GET para "/tipoContratos/:id" - Obtém um tipo de contrato pelo ID
router.get("/:id", async (req, res) => {
  try {
    const tipoContrato = await TipoContrato.findByPk(req.params.id);
    if (!tipoContrato) {
      return res
        .status(404)
        .json({ message: "Tipo de contrato não encontrado" });
    }
    res.json(tipoContrato);
  } catch (error) {
    console.error("Erro ao buscar tipo de contrato:", error);
    res.status(500).json({ message: "Erro ao buscar tipo de contrato" });
  }
});

// Rota POST para "/tipoContratos" - Adiciona um novo tipo de contrato
router.post("/", async (req, res) => {
  const { descTipoContrato, isActive } = req.body;

  try {
    const newTipoContrato = await TipoContrato.create({
      descTipoContrato,
      isActive,
    });
    res.status(201).json(newTipoContrato);
  } catch (error) {
    console.error("Erro ao criar tipo de contrato:", error);
    res.status(400).json({ message: "Erro ao criar tipo de contrato" });
  }
});

// Rota patch para "/tipoContratos/:id" - Atualiza um tipo de contrato pelo ID
router.patch("/:id", async (req, res) => {
  const { descTipoContrato, isActive } = req.body;

  try {
    const tipoContrato = await TipoContrato.findByPk(req.params.id);
    if (!tipoContrato) {
      return res
        .status(404)
        .json({ message: "Tipo de contrato não encontrado" });
    }

    tipoContrato.descTipoContrato = descTipoContrato;
    tipoContrato.isActive = isActive;

    await tipoContrato.save();
    res.json(tipoContrato);
  } catch (error) {
    console.error("Erro ao atualizar tipo de contrato:", error);
    res.status(400).json({ message: "Erro ao atualizar tipo de contrato" });
  }
});

// Rota DELETE para "/tipoContratos/:id" - Deleta um tipo de contrato pelo ID
router.delete("/:id", async (req, res) => {
  try {
    const tipoContrato = await TipoContrato.findByPk(req.params.id);
    if (!tipoContrato) {
      return res
        .status(404)
        .json({ message: "Tipo de contrato não encontrado" });
    }

    await tipoContrato.destroy();
    res.json({ message: "Tipo de contrato deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar tipo de contrato:", error);
    res.status(500).json({ message: "Erro ao deletar tipo de contrato" });
  }
});

module.exports = router;
