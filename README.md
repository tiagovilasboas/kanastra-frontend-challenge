# Kanastra Frontend Challenge - Spotify API Integration

Este projeto foi construído usando o [React Vite Boilerplate](https://github.com/tiagovilasboas/react-vite-boilerplate) como base, fornecendo uma estrutura robusta e moderna para desenvolvimento React com integração à **Spotify Web API**.

## 🎵 Sobre o Projeto

Uma aplicação web moderna que permite aos usuários:

- 🔍 Buscar artistas por nome
- 👤 Visualizar detalhes dos artistas
- 🎵 Explorar top músicas dos artistas
- 💿 Navegar pelos álbuns com paginação

## 🚀 Tecnologias

- ⚡️ **Vite:** Build ultrarrápido e Hot Module Replacement (HMR) instantâneo
- ⚛️ **React 19:** Com todos os hooks e features mais recentes
- 🔵 **TypeScript:** Tipagem estrita para um código mais seguro e manutenível
- 🎨 **Mantine:** Biblioteca de componentes React completa e acessível
- 🧪 **Vitest & Testing Library:** Configuração de testes moderna e rápida
- 📐 **ESLint & Prettier:** Qualidade de código e formatação garantidas
- 🌐 **i18n:** Suporte para internacionalização (PT/EN)
- 🏛️ **Arquitetura em Camadas:** Código organizado, escalável e fácil de testar
- 🎧 **Spotify Web API:** Integração para dados de artistas, músicas e álbuns

## 📦 Instalação

```bash
npm install
```

## 🛠️ Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera o build de produção
- `npm run preview` - Visualiza o build de produção
- `npm run test` - Executa os testes
- `npm run test:ui` - Executa os testes com interface visual
- `npm run lint` - Executa o linter
- `npm run lint:fix` - Corrige automaticamente problemas do linter
- `npm run format` - Formata o código com Prettier
- `npm run type-check` - Verifica os tipos TypeScript

## 🏗️ Estrutura do Projeto

```
src/
├── app/                  # Configurações globais, providers, rotas
├── components/           # Componentes de UI compartilhados
├── features/             # Módulos/Features da aplicação
│   ├── artists/          # Feature de artistas
│   ├── albums/           # Feature de álbuns
│   └── tracks/           # Feature de músicas
├── hooks/                # Hooks globais
├── lib/                  # Utilitários
├── pages/                # Páginas da aplicação
├── services/             # Serviços de API (Spotify)
├── stores/               # Stores globais (Zustand)
└── types/                # Tipos globais da aplicação
```

## 🗺️ Roadmap

Para acompanhar o progresso do desenvolvimento e entender as próximas etapas, consulte o [ROADMAP.md](./ROADMAP.md).

### Fases Principais:

1. **🧭 Dia 0:** Planejamento e Setup - Configuração inicial e documentação
2. **🎨 Dia 1:** Estrutura e Layout - Rotas, layout e componentes base
3. **🎧 Dia 2:** Integração com API - Spotify Web API e busca de artistas
4. **🔄 Dia 3:** Paginação e Estados - Filtros, paginação e gerenciamento de estado
5. **🌍 Dia 4:** Polimento - Animações, i18n e acessibilidade
6. **🧪 Dia 5:** Testes e Deploy - Testes, documentação e deploy

## 🎯 Status Atual

### ✅ Concluído

- [x] Setup inicial do projeto
- [x] Configuração de TypeScript, ESLint e Prettier
- [x] Configuração de testes com Vitest
- [x] Configuração de internacionalização (i18n)
- [x] Estrutura base de pastas
- [x] Página inicial funcional

### 🔄 Em Andamento

- [ ] Análise dos requisitos específicos do desafio
- [ ] Definição da arquitetura de features

### 📋 Próximos Passos

- [ ] Implementar integração com Spotify Web API
- [ ] Criar feature de busca de artistas
- [ ] Implementar página de detalhes do artista
- [ ] Adicionar paginação de álbuns
- [ ] Configurar o deploy

## 🧩 Geradores de Código

Este projeto utiliza Plop para acelerar a criação de código padronizado:

```bash
# Gerar uma feature completa
npm run plop -- feature

# Gerar um componente isolado
npm run plop -- component
```

## 🔤 Internacionalização

O projeto já está configurado com **i18next** + **react-i18next**:

- Arquivos de tradução em `src/locales/{pt,en}/common.json`
- Use o hook `useTranslation()` em qualquer componente
- Idioma padrão: **PT-BR**

## 🎧 Spotify Web API

### Endpoints Principais

- `GET /search` - Buscar artistas
- `GET /artists/{id}` - Detalhes do artista
- `GET /artists/{id}/top-tracks` - Top músicas
- `GET /artists/{id}/albums` - Álbuns do artista

### Configuração

Para usar a API, você precisará:

1. Criar uma aplicação no [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Configurar as variáveis de ambiente:
   ```
   VITE_SPOTIFY_CLIENT_ID=seu_client_id
   VITE_SPOTIFY_CLIENT_SECRET=seu_client_secret
   ```

## 📊 Critérios de Avaliação

O projeto será avaliado considerando:

- **Funcionalidade (40%)** - Integração com API, busca, paginação
- **Código (30%)** - Código limpo, TypeScript e arquitetura
- **UX/UI (20%)** - Interface intuitiva, responsiva e animações
- **Testes (10%)** - Cobertura adequada de testes

## 🚀 Deploy

Para fazer o deploy:

```bash
npm run build
```

O build de produção será gerado na pasta `dist/` e pode ser deployado em qualquer plataforma (Vercel, Netlify, etc.).

## 📝 Licença

MIT
