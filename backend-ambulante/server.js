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
// Rota para cadastrar um novo ambulante e seu ponto de venda
app.post('/api/cadastrar-ambulante', async (req, res) => {
    try {
        console.log("Dados recebidos do front-end:", req.body);

        // Mapeamento exato com base no objeto impresso pelo console.log
        const nome_completo = req.body.nome || req.body.nome_completo || req.body.nomeCompleto;
        const cpf = req.body.cpf;
        const data_nascimento = req.body.nascimento || req.body.data_nascimento || req.body.dataNascimento;
        const telefone = req.body.telefone || null;
        const email = req.body.email || null;
        const tipo_atividade = req.body.atividade || req.body.tipo_atividade || req.body.tipoAtividade;
        
        // Converte o campo 'mei' ("Não" / "Sim") para booleano (true/false)
        let possui_mei = false;
        if (req.body.mei === 'Sim' || req.body.possui_mei === true || req.body.possuiMei === true) {
            possui_mei = true;
        }
        
        const cnpj_mei = req.body.cnpj_mei || req.body.cnpjMei || null;
        const descricao_local = req.body.local || req.body.descricao_local || null;
        const bairro = req.body.bairro || null;

        // Validação básica de segurança
        if (!nome_completo || !cpf || !data_nascimento) {
            return res.status(400).json({ 
                sucesso: false, 
                erro: 'Os campos Nome, CPF e Data de Nascimento são obrigatórios.' 
            });
        }

        // 1. Inserir os dados na tabela ambulantes
        const queryAmbulante = `
            INSERT INTO ambulantes (nome_completo, cpf, data_nascimento, telefone, email, tipo_atividade, possui_mei, cnpj_mei)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id;
        `;
        
        const valuesAmbulante = [
            nome_completo, 
            cpf, 
            data_nascimento, 
            telefone, 
            email, 
            tipo_atividade, 
            possui_mei, 
            cnpj_mei
        ];

        const resultadoAmbulante = await pool.query(queryAmbulante, valuesAmbulante);
        const ambulanteId = resultadoAmbulante.rows[0].id;

        // 2. Se houver dados de local, inserir na tabela pontos_venda
        if (descricao_local || bairro) {
            const queryPonto = `
                INSERT INTO pontos_venda (ambulante_id, descricao_local, bairro)
                VALUES ($1, $2, $3);
            `;
            await pool.query(queryPonto, [ambulanteId, descricao_local, bairro]);
        }

        return res.status(201).json({ 
            sucesso: true, 
            mensagem: 'Ambulante cadastrado com sucesso!',
            id: ambulanteId 
        });

    } catch (erro) {
        console.error('Erro ao cadastrar ambulante:', erro);
        return res.status(500).json({ 
            sucesso: false, 
            erro: 'Erro interno ao salvar no banco de dados.' 
        });
    }
});
// 5. Iniciar o Servidor
app.listen(PORT, () => {
  console.log(`Servidor a rodar na porta ${PORT}`);
});