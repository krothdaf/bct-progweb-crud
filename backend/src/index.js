const express = require('express');
const cors = require('cors'); // Importa o CORS

const app = express(); // Inicializa o servidor
const port = 8000; // Define a porta do servidor

// Middlewares
app.use(cors()); // Permite requisições de outras origens (do seu React)
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

// Rotas
const rotas = require("./servicos");
app.use(rotas);

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor ouvindo na porta ${port}`);
});