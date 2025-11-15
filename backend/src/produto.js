const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require("./dbconfig");

// Define o modelo para Produto
class Produto extends Model {}

Produto.init({
  produtoId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descricao: {
    type: DataTypes.STRING,
    allowNull: true
  },
  preco: {
    type: DataTypes.DECIMAL(10, 2), // Ex: 12345.67
    allowNull: false
  },
  estoque: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  sequelize,
  modelName: 'produto',
  timestamps: true // Adiciona createdAt e updatedAt
});

sequelize.sync(); // Sincroniza o modelo (cria a tabela se não existir)

module.exports = Produto; // Exporta o modelo