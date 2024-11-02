require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database.js");
const clienteRoutes = require("./routes/clientes.js");
const consultorRoutes = require("./routes/consultores.js");
const contratoRoutes = require("./routes/contratos.js");
const tipoContratosRoutes = require("./routes/tipoContratos.js");
const statusContratosRoutes = require("./routes/statusContratos.js");
const vinculoRoutes = require("./routes/vinculos.js");
const fazendaRoutes = require("./routes/fazendas.js");

const app = express();
const port = 3030;

app.use(cors());
app.use(express.json());

app.use("/clientes", clienteRoutes);
app.use("/consultores", consultorRoutes);
app.use("/contratos", contratoRoutes);
app.use("/tipoContratos", tipoContratosRoutes);
app.use("/statusContratos", statusContratosRoutes);
app.use("/vinculos", vinculoRoutes);
app.use("/fazendas", fazendaRoutes);

sequelize
  .authenticate()
  .then(() => {
    console.log("Conexão com o banco de dados estabelecida com sucesso.");
    return sequelize.sync();
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`Servidor rodando em http://localhost:${port}/`);
    });
  })
  .catch((err) => {
    console.error("Erro ao conectar ao banco de dados:", err);
  });
