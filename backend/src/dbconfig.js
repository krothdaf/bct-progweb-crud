// (CORRIGIDO para usar Vercel Postgres)
const { Sequelize } = require('sequelize');

// Lê a URL do banco de dados das variáveis de ambiente que a Vercel configurou
const connectionString = process.env.DATABASE_URL;

// Validação simples
if (!connectionString) {
  throw new Error("Variável de ambiente POSTGRES_URL não definida!");
}

// Cria a instância do Sequelize conectando ao Postgres
const sequelize = new Sequelize(connectionString, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Necessário para conexões Vercel
    }
  }
});

// O nosso modelo 'produto.js' (que já fizemos) vai usar este 'sequelize'
// e o Sequelize é inteligente o suficiente para criar a tabela em Postgres.

module.exports = sequelize;