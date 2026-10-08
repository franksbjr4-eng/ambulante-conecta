// RF01 — Cadastro do ambulante, com criação do acesso (usuário e senha) e registro do consentimento LGPD
const express = require("express");
const bcrypt = require("bcryptjs");
const { soDigitos, cpfValido, cnpjValido, dataValida, maiorDeIdade, paraBooleano } = require("../utils/validacoes");

const senhaValida = (s) => s.length >= 8 && s.length <= 72 && /[A-Za-z]/.test(s) && /\d/.test(s);

module.exports = (pool) => {
  const router = express.Router();

  // POST /api/ambulantes
  router.post("/ambulantes", async (req, res) => {
    const b = req.body || {};
    const nome = String(b.nome_completo ?? "").trim();
    const cpf = soDigitos(b.cpf);
    const nascimento = String(b.data_nascimento ?? "").trim();
    const telefone = soDigitos(b.telefone);
    const email = String(b.email ?? "").trim() || null;
    const atividade = String(b.tipo_atividade ?? "").trim();
    const possuiMei = paraBooleano(b.possui_mei);
    const cnpj = soDigitos(b.cnpj_mei) || null;
    const local = String(b.local_pretendido ?? "").trim().slice(0, 255) || null;
    const senha = String(b.senha ?? "");

    const erros = {};
    if (nome.split(/\s+/).length < 2) erros.nome_completo = "Informe nome e sobrenome.";
    if (!cpfValido(cpf)) erros.cpf = "CPF inválido.";
    if (!dataValida(nascimento)) erros.data_nascimento = "Data inválida. Use AAAA-MM-DD.";
    else if (!maiorDeIdade(nascimento)) erros.data_nascimento = "É preciso ter 18 anos ou mais.";
    if (telefone.length !== 11) erros.telefone = "O telefone deve ter 11 dígitos, com DDD.";
    if (email && !/^\S+@\S+\.\S+$/.test(email)) erros.email = "E-mail inválido.";
    if (!atividade) erros.tipo_atividade = "Informe o tipo de atividade.";
    if (possuiMei === null) erros.possui_mei = "Informe se possui MEI (true ou false).";
    if (possuiMei === true && !cnpjValido(cnpj)) erros.cnpj_mei = "Informe um CNPJ válido do MEI.";
    if (!senhaValida(senha)) erros.senha = "A senha deve ter de 8 a 72 caracteres, com letras e números.";
    if (b.consentimento !== true) erros.consentimento = "É preciso aceitar o uso dos dados para concluir o cadastro.";
    if (Object.keys(erros).length) return res.status(400).json({ erro: "Dados inválidos.", campos: erros });

    const client = await pool.connect();
    try {
      const senhaHash = await bcrypt.hash(senha, 10);
      await client.query("BEGIN");
      const amb = await client.query(
        `INSERT INTO ambulantes
           (nome_completo, cpf, data_nascimento, telefone, email, tipo_atividade, possui_mei, cnpj_mei,
            local_pretendido, criado_em, consentimento_em)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9, NOW(), NOW())
         RETURNING id, nome_completo`,
        [nome, cpf, nascimento, telefone, email, atividade, possuiMei, possuiMei ? cnpj : null, local]
      );
      await client.query(
        "INSERT INTO usuarios (cpf, senha_hash, perfil, ambulante_id) VALUES ($1, $2, 'ambulante', $3)",
        [cpf, senhaHash, amb.rows[0].id]
      );
      await client.query("COMMIT"); // ambulante e acesso são criados juntos ou não são criados
      res.status(201).json(amb.rows[0]); // nunca devolve CPF nem senha
    } catch (e) {
      await client.query("ROLLBACK").catch(() => {});
      if (e.code === "23505") return res.status(409).json({ erro: "CPF já cadastrado." });
      console.error("Erro no cadastro:", e.message);
      res.status(500).json({ erro: "Erro interno ao cadastrar." });
    } finally {
      client.release();
    }
  });

  return router;
};