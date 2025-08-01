# Spotify Explorer - Frontend Challenge

Uma aplicação web moderna que permite explorar artistas, músicas e álbuns através da **Spotify Web API**, construída com React, TypeScript e seguindo princípios de Clean Code.

## 🎵 Sobre o Projeto

Uma aplicação web moderna que permite aos usuários:

- 🔍 Buscar artistas por nome com resultados em tempo real
- 👤 Visualizar detalhes completos dos artistas
- 🎵 Explorar top músicas dos artistas
- 💿 Navegar pelos álbuns com paginação
- 🌐 Interface em português e inglês
- 🎨 Tema escuro moderno e responsivo

## 🚀 Tecnologias

- ⚡️ **Vite:** Build ultrarrápido e Hot Module Replacement (HMR) instantâneo
- ⚛️ **React 19:** Com todos os hooks e features mais recentes
- 🔵 **TypeScript:** Tipagem estrita para um código mais seguro e manutenível
- 🎨 **Mantine:** Biblioteca de componentes React completa e acessível
- 🧪 **Vitest & Testing Library:** Configuração de testes moderna e rápida
- 📐 **ESLint & Prettier:** Qualidade de código e formatação garantidas
- 🌐 **i18n:** Suporte para internacionalização (PT/EN)
- 🎧 **Spotify Web API:** Integração completa para dados de artistas, músicas e álbuns
- 📦 **Zustand:** Gerenciamento de estado simples e eficiente
- 🔄 **React Query:** Gerenciamento de cache e estado de servidor otimizado
- 🏗️ **Arquitetura Limpa:** Código organizado, escalável e fácil de testar

## 📦 Instalação

```bash
# Clone o repositório
git clone <repository-url>
cd kanastra-frontend-challenge

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp env.example .env.local
# Edite .env.local com suas credenciais do Spotify
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
│   ├── providers/        # Providers (React Query, Mantine, i18n)
│   └── router.tsx        # Configuração de rotas
├── components/           # Componentes de UI compartilhados
│   ├── layout/           # Componentes de layout (Header, Container)
│   └── ui/               # Componentes de UI (Button, Card, etc.)
├── config/               # Configurações centralizadas
│   ├── cache.ts          # Configurações de cache (React Query)
│   └── react-query.ts    # Configuração do React Query
├── hooks/                # Hooks customizados
│   ├── useSpotifySearch.ts    # Hook de busca de artistas
│   ├── useArtistDetails.ts    # Hook de detalhes do artista
│   ├── useArtistTopTracks.ts  # Hook de top tracks
│   ├── useArtistAlbums.ts     # Hook de álbuns com paginação
│   ├── useSpotifyAuth.ts      # Hook de autenticação
│   └── usePrefetch.ts         # Hook de prefetch inteligente
├── pages/                # Páginas da aplicação
│   ├── HomePage.tsx      # Página inicial com busca
│   ├── ArtistPage.tsx    # Página de detalhes do artista
│   └── CallbackPage.tsx  # Página de callback do Spotify
├── repositories/         # Camada de acesso a dados
│   └── spotify/          # Repository da Spotify API
├── stores/               # Stores globais (Zustand)
├── types/                # Tipos TypeScript
└── utils/                # Utilitários e formatação
```

## 🎧 Spotify Web API

### Endpoints Utilizados

- `GET /search` - Buscar artistas por nome
- `GET /artists/{id}` - Detalhes completos do artista
- `GET /artists/{id}/top-tracks` - Top músicas do artista
- `GET /artists/{id}/albums` - Álbuns do artista com paginação

### Configuração

Para usar a aplicação, você precisará:

1. Criar uma aplicação no [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Configurar as variáveis de ambiente em `.env.local`:
   ```
   VITE_SPOTIFY_CLIENT_ID=seu_client_id
   VITE_SPOTIFY_CLIENT_SECRET=seu_client_secret
   VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173/callback
   ```

## 🔄 React Query Optimizations

O projeto implementa otimizações avançadas do React Query:

### 🎯 Configuração Centralizada

- **Cache Times**: Configurações otimizadas por tipo de dado
- **Stale Times**: Estratégias baseadas na frequência de mudança
- **Retry Configs**: Configurações de retry inteligentes
- **Query Keys**: Factory functions tipadas

### 🚀 Prefetch Inteligente

- Prefetch de dados relacionados no hover
- Cache otimizado para melhor UX
- Fail silently para não impactar performance

### 📊 Estratégias de Cache

- **SHORT (2min)**: Search results, dados temporários
- **MEDIUM (10min)**: Artist details, álbuns
- **LONG (30min)**: Top tracks, dados estáticos
- **INFINITE**: Dados críticos

## 🌐 Internacionalização

O projeto suporta **português** e **inglês**:

- Arquivos de tradução em `src/locales/{pt,en}/`
- Hook `useTranslation()` em todos os componentes
- Idioma padrão: **PT-BR**
- Seletor de idioma no header
- Sincronização automática com Zustand store

## 📦 Gerenciamento de Estado

### Zustand (Estado Local)

- Configurações de idioma e tema
- Estados de loading e erro
- Persistência automática

### React Query (Estado de Servidor)

- Cache de dados da API
- Estados de loading, error e success
- Invalidação inteligente
- Prefetch otimizado

## 🎨 Interface e UX

### Design System

- **Mantine**: Componentes acessíveis e modernos
- **Tema Escuro**: Interface moderna e elegante
- **Responsivo**: Funciona em desktop e mobile
- **Animações**: Transições suaves e feedback visual

### Componentes Principais

- **SearchInput**: Busca com debounce e clear
- **ArtistCard**: Card de artista com hover effects
- **LoadingSkeleton**: Skeleton loading para melhor UX
- **Pagination**: Paginação de álbuns

## 🧪 Testes

O projeto inclui testes automatizados:

- **Vitest**: Framework de testes rápido
- **Testing Library**: Testes focados em comportamento
- **Cobertura**: Testes de componentes e utilitários
- **CI/CD**: Execução automática nos commits

## 📚 Documentação

- **[🎯 React Query Optimizations](./docs/REACT_QUERY_OPTIMIZATIONS.md)** - Otimizações implementadas
- **[🔒 Environment Variables](./docs/ENVIRONMENT_VARIABLES.md)** - Configuração de variáveis
- **[🐕 Reviewdog](./docs/REVIEWDOG.md)** - Revisões automáticas de código
- **[🔧 Husky Hooks](./docs/HUSKY_HOOKS.md)** - Git hooks configurados

## 🚀 Deploy

Para fazer o deploy:

```bash
# Build de produção
npm run build

# Preview local
npm run preview
```

O build será gerado na pasta `dist/` e pode ser deployado em:

- **Vercel**: Deploy automático
- **Netlify**: Deploy automático
- **GitHub Pages**: Deploy estático
- **Qualquer servidor**: Build estático

## 🎯 Clean Code Principles

O projeto segue princípios de Clean Code:

- **Single Responsibility**: Cada função/componente tem uma responsabilidade
- **DRY**: Evita duplicação de código
- **KISS**: Soluções simples e diretas
- **SOLID**: Princípios de design orientado a objetos
- **Type Safety**: TypeScript em todo o projeto

## 📝 Licença

MIT
