require("dotenv").config();
const express = require("express");
const sequelize = require("./config/database"); // Importa a conexão do Sequelize
const clienteRoutes = require("./routes/clientes.js"); // Importa as rotas
const consultorRoutes = require("./routes/consultores.js"); // Importa as rotas

const app = express();
const port = 3000;

app.use(express.json());

// Usa as rotas criadas
app.use("/clientes", clienteRoutes);
app.use("/consultores", consultorRoutes);

// Sincroniza o Sequelize com o banco de dados e inicia o servidor
sequelize
  .authenticate() // Verifica se a conexão foi bem-sucedida
  .then(() => {
    console.log("Conexão com o banco de dados estabelecida com sucesso.");
    return sequelize.sync(); // Sincroniza os modelos
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`Servidor rodando em http://localhost:${port}/clientes`);
    });
  })
  .catch((err) => {
    console.error("Erro ao conectar ao banco de dados:", err);
  });
