// RF01 — Cadastro do ambulante
const express = require("express");
const { soDigitos, cpfValido, cnpjValido, dataValida, maiorDeIdade, paraBooleano } = require("../utils/validacoes");

module.exports = (pool) => {
  const router = express.Router();

  async function cadastrar(req, res) {
    const b = req.body || {};
    // Aceita os nomes antigos do formulário (nome, nascimento, atividade) durante a transição
    const nome = String(b.nome_completo ?? b.nome ?? "").trim();
    const cpf = soDigitos(b.cpf);
    const nascimento = String(b.data_nascimento ?? b.nascimento ?? "").trim();
    const telefone = soDigitos(b.telefone);
    const email = String(b.email ?? "").trim() || null;
    const atividade = String(b.tipo_atividade ?? b.atividade ?? "").trim();
    const possuiMei = paraBooleano(b.possui_mei ?? b.mei);
    const cnpj = soDigitos(b.cnpj_mei) || null;
    const local = String(b.local_pretendido ?? b.local ?? "").trim().slice(0, 255) || null;

    const erros = {};
    if (nome.split(/\s+/).length < 2) erros.nome_completo = "Informe nome e sobrenome.";
    if (!cpfValido(cpf)) erros.cpf = "CPF inválido.";
    if (!dataValida(nascimento)) erros.data_nascimento = "Data inválida. Use AAAA-MM-DD.";
    else if (!maiorDeIdade(nascimento)) erros.data_nascimento = "É preciso ter 18 anos ou mais.";
    if (telefone.length !== 11) erros.telefone = "O telefone deve ter 11 dígitos, com DDD.";
    if (email && !/^\S+@\S+\.\S+$/.test(email)) erros.email = "E-mail inválido.";
    if (!atividade) erros.tipo_atividade = "Informe o tipo de atividade.";
    if (possuiMei === null) erros.possui_mei = "Informe se possui MEI (true/false ou Sim/Não).";
    if (possuiMei === true && !cnpjValido(cnpj)) erros.cnpj_mei = "Informe um CNPJ válido do MEI.";
    if (Object.keys(erros).length) return res.status(400).json({ erro: "Dados inválidos.", campos: erros });

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const r = await client.query(
        `INSERT INTO ambulantes
           (nome_completo, cpf, data_nascimento, telefone, email, tipo_atividade, possui_mei, cnpj_mei, local_pretendido, criado_em)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9, NOW())
         RETURNING id, nome_completo`,
        [nome, cpf, nascimento, telefone, email, atividade, possuiMei, possuiMei ? cnpj : null, local]
      );
      // Quando o login existir, o INSERT em "usuarios" entra aqui, na mesma transação
      await client.query("COMMIT");
      res.status(201).json(r.rows[0]); // nunca devolve o CPF
    } catch (e) {
      await client.query("ROLLBACK").catch(() => {});
      if (e.code === "23505") return res.status(409).json({ erro: "CPF já cadastrado." });
      console.error("Erro no cadastro:", e.message);
      res.status(500).json({ erro: "Erro interno ao cadastrar." });
    } finally {
      client.release();
    }
  }

  router.post("/ambulantes", cadastrar);
  router.post("/cadastrar-ambulante", cadastrar); // rota antiga, manter só até o front migrar

  return router;
};