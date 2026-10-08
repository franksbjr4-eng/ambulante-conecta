// Roteiro de teste da API (Node 18+). Uso: com o servidor ligado, rode `node testar-api.js`
const BASE = process.env.API || "http://localhost:3000/api";

function gerarCpf() {
  const n = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
  const dv = (a) => { let s = 0; a.forEach((d, i) => (s += d * (a.length + 1 - i))); const r = (s * 10) % 11; return r === 10 ? 0 : r; };
  n.push(dv(n)); n.push(dv(n));
  return n.join("");
}
async function chamar(metodo, caminho, corpo) {
  const r = await fetch(BASE + caminho, { method: metodo, headers: { "Content-Type": "application/json" }, body: corpo ? JSON.stringify(corpo) : undefined });
  return { status: r.status, dados: await r.json().catch(() => ({})) };
}
function conferir(rotulo, obtido, esperado) {
  console.log(`${obtido === esperado ? "OK  " : "FALHA"} ${rotulo} (esperado ${esperado}, veio ${obtido})`);
}

(async () => {
  const cpf = gerarCpf();
  const base = { nome_completo: "Maria Teste Santos", cpf, data_nascimento: "1990-05-10", telefone: "92912345678",
    tipo_atividade: "Alimentação", possui_mei: true, cnpj_mei: "11.222.333/0001-81", local_pretendido: "Centro" };

  let r = await chamar("POST", "/ambulantes", base);
  conferir("cadastro válido", r.status, 201);
  const ambId = r.dados.id;

  r = await chamar("POST", "/ambulantes", base);
  conferir("CPF duplicado", r.status, 409);

  r = await chamar("POST", "/ambulantes", { ...base, cpf: "111.111.111-11" });
  conferir("CPF inválido", r.status, 400);

  r = await chamar("POST", "/ambulantes", { ...base, cpf: gerarCpf(), possui_mei: false, cnpj_mei: null });
  conferir("cadastro sem MEI", r.status, 201);
  const semMeiId = r.dados.id;

  r = await chamar("GET", "/pontos?status=disponivel");
  conferir("lista de pontos (GeoJSON)", r.status, 200);
  const ponto = r.dados.features?.[0]?.properties?.id;
  console.log("     pontos disponíveis:", r.dados.features?.length ?? 0);
  if (!ponto) return console.log("Sem ponto disponível no banco: confira o seed.sql.");

  r = await chamar("POST", "/solicitacoes", { ambulante_id: semMeiId, ponto_id: ponto });
  conferir("RN02: sem MEI não solicita", r.status, 422);

  r = await chamar("POST", "/solicitacoes", { ambulante_id: ambId, ponto_id: ponto });
  conferir("RN03: solicitação criada como Pendente", r.status, 201);
  console.log("     status:", r.dados.status);

  r = await chamar("POST", "/solicitacoes", { ambulante_id: ambId, ponto_id: ponto });
  conferir("solicitação pendente duplicada", r.status, 409);
})();