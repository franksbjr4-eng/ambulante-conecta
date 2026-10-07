const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config(); // Carrega as variáveis do arquivo .env

// 1. Inicializa o Express
const app = express();
const PORT = process.env.PORT || 3000;

// 2. Middlewares (Configurações iniciais)
app.use(cors());
app.use(express.json());

// 3. Conexão com o banco de dados PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Importar o controller (ajuste o caminho se necessário)
const { getSolicitacoesComDetalhes } = require('./src/controllers/solicitacaoController');

// 4. Rotas da API
app.get('/api/solicitacoes', getSolicitacoesComDetalhes);

// Rota de teste básica
app.get('/', (req, res) => {
  res.json({ mensagem: 'API do Ambulante Conecta rodando com sucesso!' });
});

// 5. Iniciar o Servidor
app.listen(PORT, () => {
  console.log(`Servidor a rodar na porta ${PORT}`);
});