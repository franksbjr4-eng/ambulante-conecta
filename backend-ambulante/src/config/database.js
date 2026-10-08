require('dotenv').config();
const { Pool } = require('pg');
 
if (!process.env.DB_PASSWORD) {
  console.error('Defina DB_PASSWORD no arquivo .env');
  process.exit(1);
}
 
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: String(process.env.DB_PASSWORD),
  database: process.env.DB_NAME || 'ambulante_conecta'
});
 
pool.on('error', (e) => console.error('Erro inesperado no pool do banco:', e.message));
 
module.exports = pool;
 