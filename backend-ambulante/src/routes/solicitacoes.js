// RF04 — Solicitação de ponto de venda (RN01 a RN03)
// Tabela: solicitacao (id_solicitacao, id_ambulante, id_ponto, data_solicitacao, status_solicitacao,
//                      justificativa, data_avaliacao, id_avaliador)
// O GET /api/solicitacoes continua no solicitacaoController existente.
const express = require("express");

const normalizar = (s) => String(s ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();

module.exports = (pool) => {
  const router = express.Router();

  router.post("/solicitacoes", async (req, res) => {
    // RN01: quando o login existir, o ambulante virá do token (req.usuario), não do corpo
    const ambulanteId = Number(req.body?.ambulante_id);
    const pontoId = Number(req.body?.ponto_id);
    if (!Number.isInteger(ambulanteId) || ambulanteId <= 0 || !Number.isInteger(pontoId) || pontoId <= 0) {
      return res.status(400).json({ erro: "Informe ambulante_id e ponto_id válidos." });
    }
    try {
      const amb = await pool.query("SELECT id, possui_mei, cnpj_mei FROM ambulantes WHERE id = $1", [ambulanteId]);
      if (!amb.rowCount) return res.status(404).json({ erro: "Ambulante não encontrado." });

      // RN02: só quem tem MEI (com CNPJ) pode solicitar
      if (!amb.rows[0].possui_mei || !amb.rows[0].cnpj_mei) {
        return res.status(422).json({ erro: "É necessário ter MEI ativo para solicitar um ponto. Consulte a página de Formalização." });
      }

      const pt = await pool.query("SELECT id, status FROM pontos_venda WHERE id = $1", [pontoId]);
      if (!pt.rowCount) return res.status(404).json({ erro: "Ponto de venda não encontrado." });
      if (normalizar(pt.rows[0].status) !== "disponivel") return res.status(409).json({ erro: "Este ponto não está disponível." });

      const dup = await pool.query(
        "SELECT 1 FROM solicitacao WHERE id_ambulante = $1 AND id_ponto = $2 AND status_solicitacao = 'Pendente'",
        [ambulanteId, pontoId]
      );
      if (dup.rowCount) return res.status(409).json({ erro: "Você já tem uma solicitação pendente para este ponto." });

      // RN03: toda solicitação nasce como "Pendente"
      const r = await pool.query(
        `INSERT INTO solicitacao (id_ambulante, id_ponto, data_solicitacao, status_solicitacao)
         VALUES ($1, $2, NOW(), 'Pendente')
         RETURNING id_solicitacao AS id, id_ambulante AS ambulante_id, id_ponto AS ponto_id,
                   status_solicitacao AS status, data_solicitacao AS criado_em`,
        [ambulanteId, pontoId]
      );
      res.status(201).json(r.rows[0]);
    } catch (e) {
      console.error("Erro ao criar solicitação:", e.message);
      res.status(500).json({ erro: "Erro interno ao criar solicitação." });
    }
  });

  return router;
};