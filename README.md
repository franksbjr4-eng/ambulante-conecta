# 🛒 Ambulante Conecta

O **Ambulante Conecta** é um sistema web desenvolvido como Trabalho de Conclusão de Curso (TCC) no curso de Análise e Desenvolvimento de Sistemas (CEUNI FAMETRO). O projeto visa auxiliar os vendedores ambulantes informais da cidade de Manaus no processo de formalização (MEI), licenciamento e mapeamento estratégico dos locais de venda.

## 🚀 Funcionalidades

- **Cadastro de Ambulantes:** Registo de dados pessoais, atividade comercial e situação de formalização (MEI).
- **Mapeamento de Pontos de Venda:** Registo dos locais de atuação dos ambulantes, com suporte a coordenadas geográficas para visualização espacial.
- **Interface Intuitiva:** Formulários em múltiplas etapas para facilitar o preenchimento por parte do utilizador.
- **Integração Espacial:** Preparado para cruzar dados de localização utilizando a extensão PostGIS.

## 🛠️ Tecnologias Utilizadas

O projeto foi construído utilizando uma arquitetura cliente-servidor:

**Front-end:**
- HTML5, CSS3 e Vanilla JavaScript
- Comunicação assíncrona via `Fetch API`

**Back-end:**
- Node.js e Express.js
- CORS para controlo de origens de requisição
- `dotenv` para gestão de variáveis de ambiente

**Base de Dados:**
- PostgreSQL
- PostGIS (Extensão espacial para os pontos de venda e coordenadas)
- `pg` (Node-Postgres) para comunicação entre a API e a base de dados

## 📁 Estrutura do Projeto

```text
definitivo/
├── backend-ambulante/    # API RESTful em Node.js
│   ├── src/              # Controladores e rotas adicionais
│   ├── .env              # Variáveis de ambiente (credenciais da BD)
│   ├── package.json      # Dependências do Node.js
│   └── server.js         # Servidor principal e rotas
├── database/             # Scripts da Base de Dados
│   ├── schema.sql        # Criação das tabelas e extensão PostGIS
│   └── seed.sql          # Dados fictícios para testes em Manaus
└── frontend/             # Interface do utilizador (UI)
    ├── css/              # Estilos da aplicação
    ├── img/              # Imagens e logótipos
    ├── js/               # Lógica do front-end (envio de formulários)
    └── *.html            # Páginas da aplicação (cadastro, mapa, etc.)