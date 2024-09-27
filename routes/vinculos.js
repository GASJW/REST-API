const express = require("express");
const router = express.Router();
const Vinculo = require("../models/vinculo"); // Importa o modelo criado

// Rota GET para "/vinculos" - Obtém todos os vínculos
router.get("/", async (req, res) => {
  try {
    const vinculos = await Vinculo.findAll();
    res.json(vinculos);
  } catch (error) {
    console.error("Erro ao buscar vínculos:", error);
    res.status(500).json({ message: "Erro ao buscar vínculos" });
  }
});

// Rota GET para "/vinculos/:id" - Obtém um vínculo pelo ID
router.get("/:id", async (req, res) => {
  try {
    const vinculo = await Vinculo.findByPk(req.params.id);
    if (!vinculo) {
      return res.status(404).json({ message: "Vínculo não encontrado" });
    }
    res.json(vinculo);
  } catch (error) {
    console.error("Erro ao buscar vínculo:", error);
    res.status(500).json({ message: "Erro ao buscar vínculo" });
  }
});

// Rota POST para "/vinculos" - Adiciona um novo vínculo
router.post("/", async (req, res) => {
  const { descVinculo, isActive } = req.body;

  try {
    const newVinculo = await Vinculo.create({
      descVinculo,
      isActive,
    });
    res.status(201).json(newVinculo);
  } catch (error) {
    console.error("Erro ao criar vínculo:", error);
    res.status(400).json({ message: "Erro ao criar vínculo" });
  }
});

// Rota patch para "/vinculos/:id" - Atualiza um vínculo pelo ID
router.patch("/:id", async (req, res) => {
  const { descVinculo, isActive } = req.body;

  try {
    const vinculo = await Vinculo.findByPk(req.params.id);
    if (!vinculo) {
      return res.status(404).json({ message: "Vínculo não encontrado" });
    }

    vinculo.descVinculo = descVinculo;
    vinculo.isActive = isActive;

    await vinculo.save();
    res.json(vinculo);
  } catch (error) {
    console.error("Erro ao atualizar vínculo:", error);
    res.status(400).json({ message: "Erro ao atualizar vínculo" });
  }
});

// Rota DELETE para "/vinculos/:id" - Deleta um vínculo pelo ID
router.delete("/:id", async (req, res) => {
  try {
    const vinculo = await Vinculo.findByPk(req.params.id);
    if (!vinculo) {
      return res.status(404).json({ message: "Vínculo não encontrado" });
    }

    await vinculo.destroy();
    res.json({ message: "Vínculo deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar vínculo:", error);
    res.status(500).json({ message: "Erro ao deletar vínculo" });
  }
});

module.exports = router;
