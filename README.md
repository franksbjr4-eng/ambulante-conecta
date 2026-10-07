# Ambulante Conecta

Sistema web **mobile-first** desenvolvido como protótipo acadêmico para apoiar a **formalização, organização e comunicação de trabalhadores ambulantes em Manaus/AM**.

## 🎯 Objetivo

O Ambulante Conecta busca reunir em um único sistema:

- orientação sobre formalização;
- cadastro e diagnóstico do trabalhador;
- visualização e solicitação de pontos de venda;
- acompanhamento da situação da solicitação;
- comunicação com a Prefeitura e o sindicato.

A proposta é oferecer uma experiência **simples, intuitiva, acessível e adequada ao uso em dispositivos móveis**.

## ✨ Funcionalidades

### 👤 Cadastro
Cadastro de dados do trabalhador, atividade e local pretendido para venda, com fluxo em etapas e possibilidade de revisão.

### 📋 Formalização
Orientação sobre as duas principais etapas:
1. **MEI Federal**
2. **Licença Municipal**

### 📍 Pontos de venda
Visualização de pontos no mapa, identificação de disponibilidade e solicitação de ponto.

### ⏳ Minha situação
Acompanhamento do fluxo:

**Solicitada → Em análise → Aprovada → Liberada**

### 💬 Comunicação
Canal de mensagens e avisos da Prefeitura, sindicato e sistema.

### ⚠️ Validação e erros
Mensagens claras para campos inválidos, informações incompletas e orientações de correção.

## 🎨 Identidade visual

| Uso | Cor |
|---|---|
| Azul institucional | `#1A56DB` |
| Fundo | `#EEF2F7` |
| Cartões | `#FFFFFF` |
| Sucesso | `#057A55` |
| Texto principal | `#111827` |
| Texto secundário | `#4B5563` |
| Atenção | `#D97706` |
| Erro | `#DC2626` |

O layout prioriza mobile-first, botões grandes, alta legibilidade, contraste, navegação simples e uso em ambientes externos.

## ♿ IHC, Usabilidade e Acessibilidade

O projeto utiliza as **10 Heurísticas de Usabilidade de Jakob Nielsen**, relacionadas a **WCAG** e **e-MAG**:

- **H1 — Visibilidade do status:** informa cadastro, formalização e solicitação.
- **H2 — Correspondência com o mundo real:** utiliza linguagem simples e termos familiares.
- **H3 — Controle e liberdade:** permite voltar, cancelar e revisar informações.
- **H4 — Consistência e padrões:** mantém componentes e comportamentos consistentes.
- **H5 — Prevenção de erros:** valida informações antes do envio.
- **H6 — Reconhecimento em vez de memorização:** informações importantes permanecem visíveis.
- **H7 — Flexibilidade e eficiência:** acesso direto às principais funções.
- **H8 — Design minimalista:** hierarquia clara e poucos elementos decorativos.
- **H9 — Recuperação de erros:** explica o problema e orienta a correção.
- **H10 — Ajuda e documentação:** o módulo de formalização funciona como orientação interativa.

## 🧩 Tecnologias previstas

**Front-end**
- React Native
- PWA / abordagem mobile-first

**Back-end**
- Node.js
- Express

**Banco de dados**
- PostgreSQL
- PostGIS

**Mapas**
- Google Maps API ou Leaflet
- OpenStreetMap

**Prototipação**
- Figma

**Versionamento**
- Git e GitHub

> O arquivo HTML deste repositório representa o **protótipo visual e navegável**. A implementação completa de back-end, banco de dados, autenticação e integrações será realizada nas etapas posteriores do projeto.

## ▶️ Como executar

Abra diretamente no navegador:

```text
https://franksbjr4-eng.github.io/ambulante-conecta/
```


## 🧪 Testes de usabilidade

O projeto prevê testes com usuários representativos do público-alvo, avaliando tarefas como:

- realizar cadastro;
- consultar a formalização;
- localizar um ponto;
- solicitar um ponto;
- acompanhar a solicitação;
- utilizar a comunicação.

Também serão observados taxa de conclusão, compreensão das informações, dificuldades e problemas de usabilidade.

## 🔐 LGPD

Como o sistema poderá tratar dados como **CPF e localização**, sua implementação deverá considerar a **Lei nº 13.709/2018 — LGPD**.

O protótipo utiliza dados demonstrativos.

## 📚 Projeto acadêmico

**Projeto:** Ambulante Conecta  
**Curso:** Análise e Desenvolvimento de Sistemas  
**Instituição:** Centro Universitário CEUNI FAMETRO  
**Orientadora:** Luana Leal  
**Autores:** Vagner Matheus Ramos Alves e Frank dos Santos Bezerra Junior

## 🚀 Próximos passos

- implementar o front-end em React Native/PWA;
- criar a API REST;
- estruturar PostgreSQL/PostGIS;
- implementar autenticação e controle de acesso;
- integrar mapas;
- persistir os cadastros;
- implementar aprovação de pontos;
- realizar testes de usabilidade;
- aprimorar acessibilidade.

## 📖 Referências

O projeto considera as referências de IHC, WCAG, e-MAG, LGPD, ODS 8 e as demais referências bibliográficas apresentadas no pré-projeto do TCC.

---

## 🏛️ Ambulante Conecta

**Formalize. Organize. Cresça.**
