/* Ambulante Conecta — cadastro em etapas */

const form = document.getElementById("cadastroForm");
const paineis = [...form.querySelectorAll(".step-panel")];
const CHAVE_RASCUNHO = "ambulante.cadastro.rascunho";
const SEM_RASCUNHO = ["cpf", "consentimento"]; // dados sensíveis não ficam no navegador
let etapa = 0;

/* ---------- Validação ---------- */
function cpfValido(v) {
  const n = v.replace(/\D/g, "");
  if (n.length !== 11 || /^(\d)\1+$/.test(n)) return false;
  const dv = (t) => {
    let soma = 0;
    for (let i = 0; i < t; i++) soma += +n[i] * (t + 1 - i);
    const r = (soma * 10) % 11;
    return r === 10 ? 0 : r;
  };
  return dv(9) === +n[9] && dv(10) === +n[10];
}

function maiorDeIdade(data) {
  const d = new Date(data), hoje = new Date();
  if (isNaN(d)) return false;
  const limite = new Date(hoje.getFullYear() - 18, hoje.getMonth(), hoje.getDate());
  return d <= limite && d.getFullYear() > 1900;
}

const obrig = (msg) => (v) => (v.trim() ? "" : msg);
const regras = {
  nome: (v) => (v.trim().split(/\s+/).length >= 2 ? "" : "Digite seu nome e sobrenome."),
  cpf: (v) => (cpfValido(v) ? "" : "CPF inválido. Verifique os 11 números."),
  nascimento: (v) => (maiorDeIdade(v) ? "" : "Informe uma data válida. É preciso ter 18 anos ou mais."),
  telefone: (v) => (v.replace(/\D/g, "").length === 11 ? "" : "O telefone deve ter 11 dígitos, com DDD."),
  email: (v) => (!v || /^\S+@\S+\.\S+$/.test(v) ? "" : "Digite um e-mail válido, como nome@email.com."),
  atividade: obrig("Escolha o tipo de atividade."),
  mei: obrig("Informe se você tem MEI."),
  local: obrig("Informe o bairro ou região."),
  turno: obrig("Escolha o turno de trabalho."),
  consentimento: (_, el) => (el.checked ? "" : "Marque a caixa para enviar o cadastro.")
};

function valida(campo) {
  const el = form.elements[campo];
  const valor = el.value ?? "";
  const msg = regras[campo](valor, el);
  document.getElementById("erro-" + campo).textContent = msg;
  const alvo = el.length ? el[0] : el; // radios
  alvo.setAttribute("aria-invalid", msg ? "true" : "false");
  if (el.length) [...el].forEach((r) => r.closest("label")?.classList.toggle("invalido", !!msg));
  else el.classList.toggle("invalido", !!msg);
  return !msg;
}

function validaEtapa(i) {
  const campos = paineis[i].dataset.campos.split(",");
  const resultados = campos.map((c) => [c, valida(c)]);
  const primeiro = resultados.find(([, ok]) => !ok);
  if (primeiro) {
    const el = form.elements[primeiro[0]];
    (el.length ? el[0] : el).focus();
    return false;
  }
  return true;
}

/* ---------- Máscaras ---------- */
function mascara(el, fn) {
  el.addEventListener("input", () => (el.value = fn(el.value.replace(/\D/g, ""))));
}
mascara(form.elements.cpf, (n) =>
  n.slice(0, 11).replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2"));
mascara(form.elements.telefone, (n) =>
  n.slice(0, 11).replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d{1,4})$/, "$1-$2"));

/* ---------- Etapas ---------- */
function renderProgresso() {
  document.getElementById("progress").innerHTML = paineis.map((p, i) => {
    const estado = i < etapa ? "done" : i === etapa ? "current" : "";
    return `<li class="${estado}"${i === etapa ? ' aria-current="step"' : ""}>
      <span class="bubble">${i < etapa ? "✓" : i + 1}</span>
      <span class="bubble-label">${p.dataset.titulo}</span></li>`;
  }).join("");
}

function mostrarEtapa(i, focar = true) {
  etapa = i;
  paineis.forEach((p, k) => (p.hidden = k !== i));
  if (i === paineis.length - 1) montarRevisao();
  document.getElementById("voltar").hidden = i === 0;
  document.getElementById("avancar").textContent = i === paineis.length - 1 ? "Enviar cadastro" : "Continuar";
  renderProgresso();
  if (focar) {
    paineis[i].querySelector("input,select,textarea")?.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function montarRevisao() {
  const rotulos = [
    ["nome", "Nome"], ["cpf", "CPF"], ["nascimento", "Nascimento"], ["telefone", "Telefone"], ["email", "E-mail"],
    ["atividade", "Atividade"], ["produtos", "Produtos ou serviços"], ["mei", "MEI"], ["local", "Local pretendido"], ["turno", "Turno"]
  ];
  const fmtData = (v) => v.split("-").reverse().join("/");
  document.getElementById("revisao").innerHTML = rotulos.map(([c, r]) => {
    let v = form.elements[c].value || "Não informado";
    if (c === "nascimento" && form.elements[c].value) v = fmtData(v);
    if (c === "cpf") v = v.replace(/^\d{3}\.\d{3}\.\d{3}/, "•••.•••.•••");
    return `<div><dt>${r}</dt><dd>${v.replace(/</g, "&lt;")}</dd></div>`;
  }).join("");
}

document.getElementById("voltar").addEventListener("click", () => mostrarEtapa(etapa - 1));

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validaEtapa(etapa)) return;
  if (etapa < paineis.length - 1) return mostrarEtapa(etapa + 1);

  // Última etapa: confere tudo antes de enviar
  for (let i = 0; i < paineis.length; i++) {
    if (!validaEtapa(i)) { mostrarEtapa(i); validaEtapa(i); return; }
  }
  enviar();
});

// Validação ao sair do campo
form.addEventListener("focusout", (e) => {
  const c = e.target.name;
  if (c && regras[c] && e.target.getAttribute("aria-invalid") === "true") valida(c);
});

/* ---------- Rascunho (sem CPF) ---------- */
function salvarRascunho() {
  try {
    const d = {};
    [...form.elements].forEach((el) => {
      if (!el.name || SEM_RASCUNHO.includes(el.name)) return;
      if (el.type === "radio" && !el.checked) return;
      d[el.name] = el.value;
    });
    localStorage.setItem(CHAVE_RASCUNHO, JSON.stringify(d));
  } catch (_) { /* navegador sem armazenamento: segue sem rascunho */ }
}

function carregarRascunho() {
  try {
    const d = JSON.parse(localStorage.getItem(CHAVE_RASCUNHO) || "{}");
    Object.entries(d).forEach(([nome, valor]) => {
      const el = form.elements[nome];
      if (!el) return;
      if (el.length) [...el].forEach((r) => (r.checked = r.value === valor));
      else el.value = valor;
    });
  } catch (_) {}
}
form.addEventListener("input", salvarRascunho);
form.addEventListener("change", salvarRascunho);

/* ---------- Envio ---------- */
function enviar() {
  const dados = Object.fromEntries(new FormData(form).entries());
  // TODO: trocar por fetch("/api/cadastro", { method: "POST", body: JSON.stringify(dados) })
  const est = lerEstado();
  est.cadastro = true;
  est.perfil = { atividade: dados.atividade, local: dados.local, turno: dados.turno }; // sem CPF
  addMensagem(est, { de: "Ambulante Conecta", assunto: "Cadastro recebido",
    texto: "Recebemos seus dados. Agora você pode solicitar um ponto de venda na página Solicitação." });
  salvarEstado(est);
  renderMenu();
  try { localStorage.removeItem(CHAVE_RASCUNHO); } catch (_) {}
  document.getElementById("cadastroCard").hidden = true;
  const ok = document.getElementById("sucesso");
  ok.hidden = false;
  ok.focus();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

carregarRascunho();
mostrarEtapa(0, false);
const cadastroForm = document.getElementById('cadastroForm');

cadastroForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Captura os dados diretamente pelos IDs do seu HTML
    const opcaoMei = document.querySelector('input[name="mei"]:checked');

    const dadosCadastro = {
        nome: document.getElementById('nome').value,
        cpf: document.getElementById('cpf').value,
        nascimento: document.getElementById('nascimento').value,
        telefone: document.getElementById('telefone').value,
        email: document.getElementById('email').value,
        atividade: document.getElementById('atividade').value,
        produtos: document.getElementById('produtos').value,
        mei: opcaoMei ? opcaoMei.value : 'Não',
        local: document.getElementById('local').value,
        turno: document.getElementById('turno').value
    };

    try {
        const resposta = await fetch('http://localhost:3000/api/cadastrar-ambulante', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosCadastro)
        });

        const resultado = await resposta.json();

        if (resposta.ok) {
            // Esconde o formulário e exibe o card de sucesso que já existe no seu HTML
            document.getElementById('cadastroCard').hidden = true;
            document.getElementById('sucesso').hidden = false;
        } else {
            alert('Erro: ' + resultado.erro);
        }
    } catch (erro) {
        console.error('Erro ao conectar com o servidor:', erro);
        alert('Servidor off-line. Certifique-se de que o Node.js (node server.js) está rodando.');
    }
});