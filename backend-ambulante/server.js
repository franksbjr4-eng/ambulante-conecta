const express = require('express');
const { getSolicitacoesComDetalhes } = require('./src/controllers/solicitacaoController');

const app = express();
const PORT = 3000;

app.use(express.json());

// Rota da API que retorna as solicitações com os dados cruzados
app.get('/api/solicitacoes', getSolicitacoesComDetalhes);

app.listen(PORT, () => {
    console.log(`Servidor a rodar na porta ${PORT}`);
});