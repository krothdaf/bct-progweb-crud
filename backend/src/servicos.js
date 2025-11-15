const express = require('express');
const {
  getLista,
  getProduto,
  inserir,
  alterar,
  excluir
} = require("./produtorecurso");

const router = express.Router();

// Rota default
router.get('/', (req, res) => {
  res.json({
    "statusCode": 200,
    "msg": "API CRUD de Produtos Rodando"
  })
});

// Rotas do CRUD de Produtos
router.get('/produtos', getLista);
router.get('/produto/:produtoId', getProduto);
router.post('/produto', inserir);
router.put('/produto/:produtoId', alterar);
router.delete('/produto/:produtoId', excluir);

module.exports = router;