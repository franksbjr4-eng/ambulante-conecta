const pool = require('../config/database');

const getSolicitacoesComDetalhes = async (req, res) => {
    try {
        const query = `
            SELECT
                s.id_solicitacao,
                a.nome_completo AS ambulante,
                p.endereco_referencia AS ponto,
                s.status_solicitacao,
                s.data_solicitacao
            FROM solicitacao s
            JOIN ambulante a ON a.id_ambulante = s.id_ambulante
            JOIN ponto_venda p ON p.id_ponto = s.id_ponto;
        `;
        
        const { rows } = await pool.query(query);
        return res.status(200).json(rows);
    } catch (error) {
        console.error("Erro ao buscar solicitações:", error);
        return res.status(500).json({ error: "Erro interno no servidor." });
    }
};

module.exports = {
    getSolicitacoesComDetalhes
};