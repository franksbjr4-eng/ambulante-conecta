/* Ambulante Conecta — código compartilhado (menu, estado e resumo da tela inicial)
   O estado fica no navegador (localStorage) até existir um back-end. Troque lerEstado/salvarEstado por chamadas à API. */

const CHAVE_ESTADO = "ambulante.estado";

const estadoPadrao = () => ({
  cadastro: false,
  perfil: null,
  formalizacao: { mei: false, licenca: false },
  docs: [],
  solicitacao: null,
  mensagens: []
});

function lerEstado() {
  try { return { ...estadoPadrao(), ...JSON.parse(localStorage.getItem(CHAVE_ESTADO) || "{}") }; }
  catch (_) { return estadoPadrao(); }
}
function salvarEstado(e) {
  try { localStorage.setItem(CHAVE_ESTADO, JSON.stringify(e)); } catch (_) {}
}
function addMensagem(e, { de, assunto, texto, enviada = false }) {
  e.mensagens.unshift({ id: String(Date.now()) + Math.floor(Math.random() * 1e4), de, assunto, texto,
    data: new Date().toISOString(), enviada, lida: enviada });
}
const naoLidas = (e) => e.mensagens.filter((m) => !m.lida && !m.enviada).length;

const menu = [
  { id: "index",        href: "index.html",        icone: "⌂", texto: "Início" },
  { id: "mapa",         href: "mapa.html",         icone: "⌖", texto: "Pontos de venda" },
  { id: "formalizacao", href: "formalizacao.html", icone: "✓", texto: "Formalização" },
  { id: "cadastro",     href: "cadastro.html",     icone: "☷", texto: "Cadastro" },
  { id: "situacao",     href: "situacao.html",     icone: "◷", texto: "Solicitação" },
  { id: "comunicacao",  href: "comunicacao.html",  icone: "✉", texto: "Comunicação", badge: true }
];
const menuMovel = { index: "Início", mapa: "Mapa", formalizacao: "Formalização", comunicacao: "Mensagens", cadastro: "Perfil" };

const paginaAtual = (location.pathname.split("/").pop() || "index.html").replace(".html", "") || "index";

function renderMenu() {
  const novas = naoLidas(lerEstado());
  const atual = (m) => (m.id === paginaAtual ? ' aria-current="page"' : "");
  document.getElementById("nav").innerHTML = menu.map((m) => {
    const badge = m.badge && novas ? `<span class="badge" aria-label="${novas} mensagens novas">${novas}</span>` : "";
    return `<a href="${m.href}"${atual(m)}><span class="nav-ico" aria-hidden="true">${m.icone}</span>${m.texto}${badge}</a>`;
  }).join("");
  document.getElementById("mobileNav").innerHTML = Object.keys(menuMovel).map((id) => {
    const m = menu.find((x) => x.id === id);
    return `<a href="${m.href}"${atual(m)}><span aria-hidden="true">${m.icone}</span>${menuMovel[id]}</a>`;
  }).join("");
}

function resumo(e) {
  const etapas = Object.values(e.formalizacao).filter(Boolean).length;
  const novas = naoLidas(e);
  return [
    e.cadastro
      ? { rotulo: "Cadastro", valor: "Concluído", status: "Tudo certo", cor: "green", icone: "✓", href: "cadastro.html" }
      : { rotulo: "Cadastro", valor: "Não iniciado", status: "Comece por aqui", cor: "blue", icone: "☷", href: "cadastro.html" },
    { rotulo: "Formalização", valor: etapas ? `${etapas} de 2` : "Não iniciada",
      status: etapas === 2 ? "Concluída" : etapas ? "Em andamento" : "Veja os passos",
      cor: etapas === 2 ? "green" : etapas ? "blue" : "gray", icone: "↗", href: "formalizacao.html" },
    { rotulo: "Solicitação", valor: e.solicitacao ? "Enviada" : "Nenhuma",
      status: e.solicitacao ? "Aguardando análise" : "Faça seu pedido",
      cor: e.solicitacao ? "orange" : "gray", icone: "◷", href: "situacao.html" },
    { rotulo: "Mensagens", valor: novas ? `${novas} ${novas > 1 ? "novas" : "nova"}` : "Nenhuma nova",
      status: novas ? "Leia agora" : "Tudo em dia", cor: novas ? "red" : "gray", icone: "✉", href: "comunicacao.html" }
  ];
}

function renderResumo() {
  document.getElementById("stats").innerHTML = resumo(lerEstado()).map((s) => `
    <li><a class="card stat-link" href="${s.href}">
      <span class="stat-top"><span>${s.rotulo}</span><span class="icon-circle ${s.cor}" aria-hidden="true">${s.icone}</span></span>
      <span class="stat-number">${s.valor}</span>
      <span class="status ${s.cor}">${s.status}</span>
    </a></li>`).join("");
}

function mostrarAviso(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.style.display = "block";
  clearTimeout(mostrarAviso.timer);
  mostrarAviso.timer = setTimeout(() => (t.style.display = "none"), 2800);
}

renderMenu();
if (document.getElementById("stats")) renderResumo();
