require("dotenv").config();
const express = require("express");
const { Sequelize } = require("sequelize");

const app = express();
const port = 3000;

// Configuração do Sequelize com variáveis de ambiente
const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_SERVER,
    dialect: "mssql", // Usando SQL Server
    dialectOptions: {
      options: {
        encrypt: false, // Definir como true se o servidor exigir criptografia
      },
    },
  }
);

// Função para testar a conexão ao banco de dados
async function connectToDatabase() {
  try {
    await sequelize.authenticate();
    console.log("Conectado ao banco de dados SQL Server via Sequelize");
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
  }
}

app.use(express.json());

// Rota inicial
app.get("/", (req, res) => {
  res.send("Servidor On-Line");
});

// Exemplo de rota GET para recuperar dados da tabela tblVinculo usando Sequelize
app.get("/vinculos", async (req, res) => {
  try {
    const [results, metadata] = await sequelize.query(
      "SELECT * FROM tblVinculo"
    );
    res.json(results); // Retorna os resultados da consulta
  } catch (err) {
    console.error("Erro ao executar consulta:", err);
    res.status(500).send("Erro ao buscar dados");
  }
});

// Inicia o servidor e conecta ao banco de dados
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}/vinculos`);
  connectToDatabase(); // Testa a conexão com o banco de dados ao iniciar
});
