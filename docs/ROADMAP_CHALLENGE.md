# 🗺️ Roadmap - Kanastra Frontend Challenge (Spotify API)

## 📋 Visão Geral

Este roadmap detalha as etapas recomendadas para a implementação do desafio técnico de Frontend da Kanastra, com prazos e prioridades para facilitar a execução dentro dos 5 dias corridos estipulados.

## 🎯 Objetivos do Desafio

- [ ] Integrar com Spotify Web API
- [ ] Implementar busca de artistas com filtro
- [ ] Criar página de detalhes do artista
- [ ] Implementar paginação de álbuns
- [ ] Desenvolver interface responsiva e moderna
- [ ] Adicionar animações e feedback visual

## 🧭 Roadmap de Implementação

### ✅ Dia 0 – Planejamento e Setup

- [ ] Ler a [documentação do Spotify Web API](https://developer.spotify.com/documentation/web-api)
- [ ] Definir escopo mínimo viável (MVP)
- [ ] Criar repositório GitHub com README inicial
- [ ] Setup inicial do projeto:
  - [ ] Vite + React + TypeScript
  - [ ] Tailwind CSS + shadcn/ui
  - [ ] ESLint + Prettier
  - [ ] React Router + Context API
  - [ ] .env com variáveis de autenticação da API

### 🎨 Dia 1 – Estrutura e Layout

- [ ] Criar rotas principais:
  - `/` → Home / Listagem de artistas
  - `/artist/:id` → Detalhes do artista
- [ ] Montar layout base responsivo
- [ ] Implementar grid de artistas com UI atrativa
- [ ] Criar componentes reutilizáveis (Card, Header, Input, etc.)

### 🎧 Dia 2 – Integração com a API do Spotify

- [ ] Criar serviço `spotifyService.ts` com Axios
- [ ] Implementar busca de artistas com filtro por nome (debounce)
- [ ] Ao clicar em um artista, carregar:
  - [ ] Nome e popularidade
  - [ ] Top músicas
  - [ ] Lista de álbuns com paginação (20 por página)

### 🔄 Dia 3 – Paginação, Filtros e Estados

- [ ] Implementar paginação manual dos álbuns
- [ ] Filtro por nome do álbum
- [ ] Gerenciamento de estado com Context API ou Zustand
- [ ] Implementar loading states (skeletons/spinners)
- [ ] Tratar erros com mensagens amigáveis
- [ ] Adicionar feedback para listas vazias

### 🌍 Dia 4 – Polimento e Diferenciais

- [ ] Tradução com i18n (ex: pt-BR e en-US)
- [ ] Adicionar animações (entradas suaves, transições)
- [ ] Criar variações de componentes (botão com loading, inputs com erro, etc.)
- [ ] Garantir responsividade e acessibilidade básica (aria-labels, contraste)

### 🧪 Dia 5 – Testes, README e Deploy

- [ ] Testes unitários (opcional)
- [ ] Testes E2E com Cypress (opcional)
- [ ] Escrever README completo com:
  - Tecnologias
  - Como rodar
  - Link da demo
- [ ] Deploy no [Vercel](https://vercel.com) ou [Netlify](https://netlify.com)
- [ ] Revisar tudo antes da entrega final

## 🏁 Entrega Final

- [ ] Conferir todos os requisitos e diferenciais listados no desafio
- [ ] Validar funcionamento no mobile e desktop
- [ ] Subir repositório no GitHub com o link da demo
- [ ] Responder ao e-mail com o link do repositório

## 🛠️ Stack Tecnológico

### Frontend

- **Vite** - Build tool
- **React 19** - Framework principal
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Styling
- **shadcn/ui** - Biblioteca de componentes

### Navegação e Estado

- **React Router** - Roteamento
- **Context API/Zustand** - Gerenciamento de estado

### Integração

- **Axios** - Cliente HTTP
- **Spotify Web API** - API externa

### Qualidade

- **ESLint** - Linting
- **Prettier** - Formatação

### Deploy

- **Vercel/Netlify** - Plataforma de deploy

## 📊 Critérios de Avaliação

### Funcionalidade (40%)

- [ ] Busca de artistas funcionando
- [ ] Detalhes do artista carregando corretamente
- [ ] Paginação de álbuns implementada
- [ ] Filtros funcionando adequadamente
- [ ] Tratamento de erros implementado

### Código (30%)

- [ ] Código limpo e bem estruturado
- [ ] Uso adequado de TypeScript
- [ ] Componentes reutilizáveis
- [ ] Arquitetura escalável
- [ ] Documentação adequada

### UX/UI (20%)

- [ ] Interface intuitiva e moderna
- [ ] Responsividade implementada
- [ ] Animações suaves
- [ ] Loading states e feedback visual

### Testes (10%)

- [ ] Testes implementados (se aplicável)
- [ ] Funcionamento em diferentes dispositivos
- [ ] Compatibilidade cross-browser

## 🎯 Endpoints da API Spotify

### Principais Endpoints

- `GET /search` - Buscar artistas
- `GET /artists/{id}` - Detalhes do artista
- `GET /artists/{id}/top-tracks` - Top músicas
- `GET /artists/{id}/albums` - Álbuns do artista

### Parâmetros Importantes

- `q` - Query de busca
- `type` - Tipo de item (artist, track, album)
- `limit` - Limite de resultados
- `offset` - Offset para paginação

## 📝 Notas Importantes

1. **Priorize a funcionalidade** sobre features extras
2. **Foque na experiência do usuário** com loading states e feedback
3. **Mantenha o código limpo** e bem documentado
4. **Teste em diferentes dispositivos** e navegadores
5. **Considere a performance** com debounce e paginação

## 🔄 Atualizações

Este roadmap será atualizado conforme o desenvolvimento progride e novos requisitos são identificados.

---

**Feito com foco em performance, legibilidade e impacto visual. Boa sorte! 🚀**
