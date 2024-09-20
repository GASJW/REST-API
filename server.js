require("dotenv").config();
const express = require("express");
const sql = require("mssql");

const app = express();
const port = 3000;

// Configurações da string de conexão
const config = {
  user: process.env.DB_USER, // Utilizador do SQL Server
  password: process.env.DB_PASSWORD, // Senha do SQL Server
  server: process.env.DB_SERVER, // Servidor SQL Server (com instância SQLEXPRESS)
  database: process.env.DB_DATABASE, // Nome do banco de dados
  options: {
    encrypt: false, // Definir como true se o servidor exigir criptografia
    enableArithAbort: true, // Necessário em algumas configurações do SQL Server
    connectTimeout: 30000, // Timeout de conexão
  },
};

// Listener global de erros no SQL
sql.on("error", (err) => {
  console.error("Erro global no SQL Server:", err);
});

// Função para conectar ao banco de dados
async function connectToDatabase() {
  try {
    await sql.connect(config);
    console.log("Conectado ao banco de dados SQL Server");
  } catch (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
  }
}

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Index encontrado");
});

// Método GET para recuperar dados da tabela tblVinculo
app.get("/vinculos", async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM tblVinculo");
    res.json(result.recordset);
  } catch (err) {
    console.error("Erro ao executar consulta:", err);
    res.status(500).send("Erro ao buscar dados");
  }
});

// Inicia o servidor e conecta ao banco de dados
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}/vinculos`);
  connectToDatabase();
});
