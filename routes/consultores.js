const express = require("express");
const router = express.Router();
const Consultor = require("../models/consultor"); // Importa o modelo criado

// Rota GET para "/consultores" - Obtém todos os consultores
router.get("/", async (req, res) => {
  try {
    const consultores = await Consultor.findAll();
    res.json(consultores);
  } catch (error) {
    console.error("Erro ao buscar consultores:", error);
    res.status(500).json({ message: "Erro ao buscar consultores" });
  }
});

// Rota GET para "/consultores/:id" - Obtém um consultor pelo ID
router.get("/:id", async (req, res) => {
  try {
    const consultor = await Consultor.findByPk(req.params.id);
    if (!consultor) {
      return res.status(404).json({ message: "Consultor não encontrado" });
    }
    res.json(consultor);
  } catch (error) {
    console.error("Erro ao buscar consultor:", error);
    res.status(500).json({ message: "Erro ao buscar consultor" });
  }
});

// Rota POST para "/consultores" - Adiciona um novo consultor
router.post("/", async (req, res) => {
  const { nmConsultor, isActive } = req.body;

  try {
    const NewConsultor = await Consultor.create({
      nmConsultor,
      isActive,
    });
    res.status(201).json(NewConsultor);
  } catch (error) {
    console.error("Erro ao criar consultor:", error);
    res.status(400).json({ message: "Erro ao criar consultor" });
  }
});

// Rota patch para "/consultores/:id" - Atualiza um consultor pelo ID
router.patch("/:id", async (req, res) => {
  const { idConsultor, nmConsultor, isActive } = req.body;

  try {
    const consultor = await Consultor.findByPk(req.params.id);
    if (!consultor) {
      return res.status(404).json({ message: "Consultor não encontrado" });
    }

    consultor.nmConsultor = nmConsultor;
    consultor.isActive = isActive;

    await consultor.save();
    res.json(consultor);
  } catch (error) {
    console.error("Erro ao atualizar consultor:", error);
    res.status(400).json({ message: "Erro ao atualizar consultor" });
  }
});

// Rota DELETE para "/consultores/:id" - Deleta um consultor pelo ID
router.delete("/:id", async (req, res) => {
  try {
    const consultor = await Consultor.findByPk(req.params.id);
    if (!consultor) {
      return res.status(404).json({ message: "Consultor não encontrado" });
    }

    await consultor.destroy();
    res.json({ message: "Consultor deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar consultor:", error);
    res.status(500).json({ message: "Erro ao deletar consultor" });
  }
});

module.exports = router;
