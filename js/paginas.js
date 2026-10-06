/* Ambulante Conecta — formalização, solicitação, comunicação */

const $ = (s) => document.querySelector(s);
const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fmt = (iso) => new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
let estado = lerEstado();
const salvar = () => { salvarEstado(estado); renderMenu(); };

function erro(campo, msg) {
  $("#erro-" + campo).textContent = msg;
  const el = document.getElementById(campo);
  el.setAttribute("aria-invalid", msg ? "true" : "false");
  el.classList.toggle("invalido", !!msg);
  return !msg;
}

/* ---------- Formalização ---------- */
function paginaFormalizacao() {
  const docs = ["Documento com foto e CPF", "Comprovante de residência", "Comprovante de inscrição no MEI (CCMEI)", "Foto do seu ponto ou carrinho"];

  function render() {
    ["mei", "licenca"].forEach((k) => {
      const ok = estado.formalizacao[k];
      $("#status-" + k).className = "status " + (ok ? "green" : "gray");
      $("#status-" + k).textContent = ok ? "Concluída" : "Não iniciada";
      $("#toggle-" + k).textContent = ok ? "Desmarcar etapa" : "Marcar como concluída";
    });
    $("#contagem").textContent = `${Object.values(estado.formalizacao).filter(Boolean).length} de 2 etapas`;
    $("#docs").innerHTML = docs.map((d, i) =>
      `<li><label class="check"><input type="checkbox" data-i="${i}" ${estado.docs.includes(i) ? "checked" : ""}> ${d}</label></li>`).join("");
  }

  ["mei", "licenca"].forEach((k) => $("#toggle-" + k).addEventListener("click", () => {
    estado.formalizacao[k] = !estado.formalizacao[k];
    salvar(); render();
  }));
  $("#docs").addEventListener("change", (e) => {
    const i = +e.target.dataset.i;
    estado.docs = e.target.checked ? [...new Set([...estado.docs, i])] : estado.docs.filter((x) => x !== i);
    salvar();
  });
  render();
}

/* ---------- Solicitação ---------- */
function paginaSolicitacao() {
  const form = $("#formSolicitacao");
  if (estado.perfil) { form.local.value = estado.perfil.local || ""; form.turno.value = estado.perfil.turno || ""; }

  function render() {
    const s = estado.solicitacao;
    $("#semCadastro").hidden = estado.cadastro || !!s;
    $("#nova").hidden = !estado.cadastro || !!s;
    $("#andamento").hidden = !s;
    if (s) { $("#d-data").textContent = fmt(s.data); $("#d-local").textContent = s.local; $("#d-turno").textContent = s.turno; }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const okLocal = erro("local", form.local.value.trim() ? "" : "Informe o bairro ou região.");
    const okTurno = erro("turno", form.turno.value ? "" : "Escolha o turno de trabalho.");
    if (!okLocal) return form.local.focus();
    if (!okTurno) return form.turno.focus();
    estado.solicitacao = { data: new Date().toISOString(), local: form.local.value.trim(), turno: form.turno.value };
    addMensagem(estado, { de: "Ambulante Conecta", assunto: "Solicitação enviada",
      texto: `Sua solicitação de ponto em "${estado.solicitacao.local}" (${estado.solicitacao.turno}) foi registrada e aguarda análise.` });
    salvar(); render();
    mostrarAviso("Solicitação enviada.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  $("#cancelar").addEventListener("click", () => {
    if (!confirm("Cancelar sua solicitação de ponto?")) return;
    estado.solicitacao = null;
    salvar(); render();
    mostrarAviso("Solicitação cancelada.");
  });
  render();
}

/* ---------- Comunicação ---------- */
function paginaComunicacao() {
  const form = $("#formMsg"), card = $("#formMsgCard"), btn = $("#btnNova");

  const item = (m) => `<details class="msg${!m.lida && !m.enviada ? " nova" : ""}" data-id="${m.id}">
    <summary><span class="msg-de">${esc(m.de)}</span><span class="msg-assunto">${esc(m.assunto)}</span><time datetime="${m.data}">${fmt(m.data)}</time></summary>
    <p>${esc(m.texto)}</p></details>`;

  function render() {
    const lista = (enviada, vazio) => {
      const ms = estado.mensagens.filter((m) => !!m.enviada === enviada);
      return ms.length ? ms.map(item).join("") : `<p class="vazio">${vazio}</p>`;
    };
    $("#recebidas").innerHTML = lista(false, "Você ainda não recebeu mensagens.");
    $("#enviadas").innerHTML = lista(true, "Você ainda não enviou mensagens.");
  }

  function abrirForm(abrir) {
    card.hidden = !abrir;
    btn.setAttribute("aria-expanded", abrir);
    if (abrir) form.assunto.focus();
  }
  btn.addEventListener("click", () => abrirForm(card.hidden));
  $("#cancelaMsg").addEventListener("click", () => abrirForm(false));

  // Marca como lida ao abrir
  $("#recebidas").addEventListener("toggle", (e) => {
    const d = e.target, m = estado.mensagens.find((x) => x.id === d.dataset.id);
    if (d.open && m && !m.lida) { m.lida = true; d.classList.remove("nova"); salvar(); }
  }, true);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const okA = erro("assunto", form.assunto.value.trim() ? "" : "Escreva o assunto da mensagem.");
    const okT = erro("texto", form.texto.value.trim() ? "" : "Escreva a mensagem.");
    if (!okA) return form.assunto.focus();
    if (!okT) return form.texto.focus();
    addMensagem(estado, { de: "Para: " + form.dest.value, assunto: form.assunto.value.trim(), texto: form.texto.value.trim(), enviada: true });
    salvar(); render();
    form.reset(); abrirForm(false);
    mostrarAviso("Mensagem enviada.");
  });
  render();
}

({ formalizacao: paginaFormalizacao, situacao: paginaSolicitacao, comunicacao: paginaComunicacao }[document.body.dataset.pagina] || (() => {}))();
