// C:\projeto-final-crud\backend\src\dbconfig.js

const { Sequelize } = require('sequelize');
const path = require('path');

// Prioriza a variável de ambiente (Vercel) ou usa fallback
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
    logging: false
  });
} else {
  // Conexão LOCAL (SQLite)
  console.log("Conectando ao SQLite (Local)...");
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'database.db'), // Onde o arquivo de DB está
    logging: false
  });
}

module.exports = sequelize;