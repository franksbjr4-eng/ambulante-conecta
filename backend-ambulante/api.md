# API do Ambulante Conecta

Back-end em Node.js, Express e PostgreSQL com PostGIS. Base: `http://localhost:3000/api`.
Rotas protegidas exigem o cabeçalho `Authorization: Bearer <token>` (token do login, válido por 8 horas).

## Como rodar

1. `cd backend-ambulante` e `npm install`
2. Copie `.env.example` para `.env` e preencha as variáveis (`DB_*` e `JWT_SECRET`)
3. Banco: execute `database/schema.sql` e depois `database/seed.sql`
4. Crie o gestor de teste: `node scripts/criar-gestor.js <CPF válido>`
5. `npm start`
6. Testes: defina `TESTE_GESTOR_CPF` e `TESTE_GESTOR_SENHA` e rode `npm test`

## Rotas

| Método e rota | Perfil | Função | Requisito |
|---|---|---|---|
| `POST /ambulantes` | público | Cadastra o ambulante, cria o acesso e registra o consentimento LGPD | RF01, RN05 |
| `POST /auth/login` | público | Entra com CPF e senha e recebe o token | RN01 |
| `GET /auth/me` | logado | Dados do usuário logado | RN01 |
| `GET /pontos` | público | Pontos de venda em GeoJSON (`?status=`, `?bairro=`) | RF03 |
| `POST /solicitacoes` | ambulante | Solicita um ponto (`{ponto_id}`); exige MEI e ponto disponível | RF04, RN01 a RN03 |
| `GET /solicitacoes/minhas` | ambulante | Lista as próprias solicitações | RF04 |
| `GET /solicitacoes` | gestor | Lista todas, com CPF mascarado (`?status=`) | RF06, RN06 |
| `PATCH /solicitacoes/:id` | gestor | Aprova ou recusa; recusa exige justificativa | RF06, RN04 |
| `GET /mensagens` | ambulante, gestor | Conversa (gestor informa `?ambulante_id=`) | RF05 |
| `POST /mensagens` | ambulante, gestor | Envia mensagem (gestor informa `ambulante_id`) | RF05 |
| `GET /mensagens/conversas` | gestor | Caixa de entrada com não lidas | RF05 |
| `GET /mensagens/nao-lidas` | ambulante, gestor | Contador de não lidas | RF05 |
| `PATCH /mensagens/:id/lida` | ambulante, gestor | Marca uma mensagem recebida como lida | RF05 |
| `PATCH /mensagens/lidas` | ambulante, gestor | Marca a conversa como lida | RF05 |
| `GET /painel` | gestor | Números agregados, sem dados pessoais | RF07, RN06 |

## Códigos de resposta

`200` ou `201` sucesso · `400` dados inválidos (a lista `campos` indica o campo) · `401` sem login ou sessão expirada ·
`403` perfil sem permissão · `404` não encontrado · `409` conflito (CPF repetido, ponto indisponível, solicitação já avaliada) ·
`422` regra de negócio (sem MEI) · `429` muitas tentativas · `500` erro interno.

## Regras de negócio no código

| Regra | Onde |
|---|---|
| RN01 solicitar exige login de ambulante | `POST /solicitacoes` usa o ambulante do token |
| RN02 só quem tem MEI com CNPJ válido solicita | cadastro valida o CNPJ; solicitação confere `possui_mei` e `cnpj_mei` |
| RN03 a solicitação nasce Pendente | `POST /solicitacoes` |
| RN04 recusa exige justificativa | `PATCH /solicitacoes/:id` |
| RN05 consentimento LGPD registrado | `ambulantes.consentimento_em` |
| RN06 gestor vê dados agregados e CPF mascarado | `GET /painel` e `GET /solicitacoes` |

## Segurança

Senha com hash bcrypt, consultas parametrizadas, CORS restrito, limite de tentativas no login e nas mensagens,
token JWT com validade, CPF nunca devolvido por completo, credenciais fora do código (`.env`).

## Testes automatizados

`testar-api.js` (cadastro, login, permissões, solicitação), `testar-avaliacao.js` (aprovação e recusa),
`testar-mensagens.js` (conversas e isolamento), `testar-painel.js` (painel agregado) e `testar-tudo.js`
(roda todos e salva o relatório em `resultados-testes/`).