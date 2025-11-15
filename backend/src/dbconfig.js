// Import de bibliteca
const { Sequelize } = require('sequelize');

// Cria a instância do Sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.db' // Nome do arquivo do banco
});

// Exporta a instância
module.exports = sequelize;