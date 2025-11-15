const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rotas
const rotas = require('./servicos');
app.use(rotas);

// Quando estiver rodando LOCALMENTE (npm start), sobe na porta 8000
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 8000;
  app.listen(port, () => {
    console.log(`Servidor ouvindo na porta ${port}`);
  });
}

// Exporta o app para a Vercel usar como função serverless
module.exports = app;