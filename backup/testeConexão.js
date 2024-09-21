require("dotenv").config();
const sql = require("mssql");

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER, // IP ou hostname do SQL Server
  database: process.env.DB_DATABASE,
  options: {
    encrypt: false,
    enableArithAbort: true,
    connectTimeout: 30000,
  },
};

async function connectToDatabase() {
  try {
    await sql.connect(config);
    console.log("Conectado ao SQL Server");
  } catch (err) {
    console.error("Erro ao conectar:", err);
  }
}

connectToDatabase();
