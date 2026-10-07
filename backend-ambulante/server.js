const express = require('express');
const { getSolicitacoesComDetalhes } = require('./src/controllers/solicitacaoController');

const app = express();
const PORT = 3000;

app.use(express.json());

// Rota da API que retorna as solicitações com os dados cruzados
app.get('/api/solicitacoes', getSolicitacoesComDetalhes);

app.listen(PORT, () => {
    console.log(`Servidor a rodar na porta ${PORT}`);
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexão com o banco de dados PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'ambulante_conecta',
    password: 'AmbulanteConecta2026', // Substitua pela sua senha
    port: 5432,
});

// 1. Rota de teste (mantida)
app.get('/', (req, res) => {
    res.send('API do Ambulante Conecta está rodando perfeitamente!');
});

// 2. Rota de Cadastro do Ambulante
app.post('/api/cadastrar-ambulante', async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { nome, cpf, nascimento, telefone, email, mei } = req.body;

        // Inserção na tabela USUARIO
        const resUsuario = await client.query(
            `INSERT INTO usuario (nome, email, senha_hash, tipo_usuario)
             VALUES ($1, $2, $3, $4) RETURNING id_usuario`,
            [nome, email || `${cpf}@ambulante.com`, 'senha_padrao_hash', 'AMBULANTE']
        );
        const idUsuario = resUsuario.rows[0].id_usuario;

        // Mapeamento do status do MEI
        let statusFormalizacao = 'INFORMAL';
        if (mei === 'Sim') statusFormalizacao = 'MEI_ATIVO';
        if (mei === 'Em andamento') statusFormalizacao = 'EM_PROCESSO';

        // Inserção na tabela AMBULANTE
        await client.query(
            `INSERT INTO ambulante (id_usuario, id_atividade, cpf, nome_completo, telefone, status_formalizacao)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [idUsuario, 1, cpf.replace(/\D/g, ''), nome, telefone, statusFormalizacao]
        );

        await client.query('COMMIT');
        res.status(201).json({ mensagem: 'Cadastro realizado com sucesso!' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Erro no cadastro:', error);
        res.status(500).json({ erro: 'Falha ao salvar cadastro no banco de dados.' });
    } finally {
        client.release();
    }
});

// Teste de conexão ao iniciar
pool.connect((err, client, release) => {
    if (err) {
        return console.error('❌ Erro de conexão com o PostgreSQL:', err.stack);
    }
    console.log('✅ Conexão com o PostgreSQL realizada com sucesso!');
    release();
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT} (http://localhost:3000)`);
});