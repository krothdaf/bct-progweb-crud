const Produto = require("./produto");

// (Retrieve) Retorna uma lista com todos os produtos
const getLista = async (request, response) => {
  try {
    const produtos = await Produto.findAll();
    response.status(200).json(produtos);
  } catch (error) {
    response.status(500).json({ message: 'Erro ao buscar produtos.', error: error.message });
  }
};

// (Retrieve) Procura um produto pelo id
const getProduto = async (request, response) => {
  try {
    const produto = await Produto.findByPk(request.params.produtoId);
    if (produto) {
      response.status(200).json(produto);
    } else {
      response.status(404).json({ message: `Produto não encontrado com produtoId: ${request.params.produtoId}` });
    }
  } catch (error) {
    response.status(500).json({ message: 'Erro ao buscar produto.', error: error.message });
  }
};

// (Create) Insere um novo produto
const inserir = async (request, response) => {
  try {
    const produto = await Produto.create(request.body);
    response.status(201).json({
      message: `Produto inserido com produtoId: ${produto.produtoId}`
    });
  } catch (error) {
    response.status(500).json({ message: 'Erro ao inserir produto.', error: error.message });
  }
};

// (Update) Altera um produto
const alterar = async (request, response) => {
  try {
    const produto = await Produto.findByPk(request.params.produtoId);
    if (produto) {
      await produto.update(request.body);
      response.status(200).json({
        message: `Produto modificado com produtoId: ${request.params.produtoId}`
      });
    } else {
      response.status(404).json({
        message: `Produto não encontrado com produtoId: ${request.params.produtoId}`
      });
    }
  } catch (error) {
    response.status(500).json({ message: 'Erro ao alterar produto.', error: error.message });
  }
};

// (Delete) Exclui um produto
const excluir = async (request, response) => {
  try {
    const produto = await Produto.findByPk(request.params.produtoId);
    if (produto) {
      await produto.destroy();
      response.status(200).json({
        message: `Produto excluído com produtoId: ${produto.produtoId}`
      });
    } else {
      response.status(404).json({
        message: `Produto não encontrado com produtoId: ${request.params.produtoId}`
      });
    }
  } catch (error) {
    response.status(500).json({ message: 'Erro ao excluir produto.', error: error.message });
  }
};

// Exporta as funções
module.exports = {
  getLista,
  getProduto,
  inserir,
  alterar,
  excluir
};