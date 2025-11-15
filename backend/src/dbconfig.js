// C:\projeto-final-crud\backend\src\dbconfig.js

const { Sequelize } = require('sequelize');
const path = require('path');

// Verifica se a variável de ambiente POSTGRES_URL existe
const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

let sequelize;

if (connectionString) {
  // Conexão de PRODUÇÃO (Neon/PostgreSQL)
  console.log("Conectando ao PostgreSQL (Produção)...");
  sequelize = new Sequelize(connectionString, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false // Desabilita logging do SQL
  });
} else {
  // Conexão LOCAL (SQLite)
  console.log("Conectando ao SQLite (Local)...");
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'database.db'), // Onde o seu arquivo de DB está
    logging: false
  });
}

// O Sequelize sincronizará os modelos em ambos os casos.
// O nosso modelo 'produto.js' continuará funcionando.

module.exports = sequelize;