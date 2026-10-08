const pool = require('../config/database');

const getSolicitacoesComDetalhes = async (req, res) => {
  try {
    const query = `
      SELECT
        s.id_solicitacao AS id,
        s.status_solicitacao AS status,
        s.data_solicitacao,
        a.nome_completo AS ambulante,
        a.cpf AS ambulante_cpf,
        p.descricao_local AS ponto,
        p.bairro,
        p.id AS ponto_id
      FROM solicitacao s
      JOIN ambulantes a ON a.id = s.id_ambulante
      JOIN pontos_venda p ON p.id = s.id_ponto
      ORDER BY s.id_solicitacao DESC;
    `;

    const { rows } = await pool.query(query);
    return res.status(200).json(rows);
  } catch (error) {
    console.error('Erro ao buscar solicitações:', error.message);
    return res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
};

module.exports = {
  getSolicitacoesComDetalhes
};