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
- 📱 Layout mobile otimizado com funcionalidades completas
- 🔔 Sistema de notificações toast para feedback
- 🎯 Experiência unificada entre desktop e mobile
- ⚡ **100% React Query**: Todos os dados gerenciados com cache inteligente

## 🚀 Tecnologias

- ⚡️ **Vite:** Build ultrarrápido e Hot Module Replacement (HMR) instantâneo
- ⚛️ **React 19:** Com todos os hooks e features mais recentes
- 🔵 **TypeScript:** Tipagem estrita para um código mais seguro e manutenível
- 🎨 **Tailwind CSS:** Framework CSS utilitário para design responsivo
- 🧪 **Vitest & Testing Library:** Configuração de testes moderna e rápida
- 📐 **ESLint & Prettier:** Qualidade de código e formatação garantidas
- 🌐 **i18n:** Suporte para internacionalização (PT/EN)
- 🎧 **Spotify Web API:** Integração completa para dados de artistas, músicas e álbuns
- 📦 **Zustand:** Gerenciamento de estado simples e eficiente
- 🔄 **React Query:** Gerenciamento de cache e estado de servidor otimizado
- 🔔 **Sonner:** Sistema de toast notifications moderno
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
│   ├── providers/        # Providers (React Query, i18n)
│   └── router.tsx        # Configuração de rotas
├── components/           # Componentes de UI compartilhados
│   ├── layout/           # Componentes de layout (Header, MobileLayout)
│   ├── ui/               # Componentes de UI (Button, Card, SearchInput)
│   └── SEO/              # Componentes de SEO
├── config/               # Configurações centralizadas
│   ├── cache.ts          # Configurações de cache (React Query)
│   └── react-query.ts    # Configuração do React Query
├── hooks/                # Hooks customizados (100% React Query)
│   ├── useSpotifySearch.ts    # Hook de busca de artistas
│   ├── useArtistDetails.ts    # Hook de detalhes do artista
│   ├── useArtistTopTracks.ts  # Hook de top tracks
│   ├── useArtistAlbums.ts     # Hook de álbuns com paginação
│   ├── useSpotifyAuth.ts      # Hook de autenticação
│   ├── usePopularArtists.ts   # Hook de artistas populares
│   ├── useUserLibrary.ts      # Hook de biblioteca do usuário
│   ├── usePlaylistCreation.ts # Hook de criação de playlists
│   ├── useToast.ts            # Hook para toast notifications
│   └── usePrefetch.ts         # Hook de prefetch inteligente
├── pages/                # Páginas da aplicação
│   ├── HomePage.tsx      # Página inicial com busca
│   ├── ArtistPage.tsx    # Página de detalhes do artista
│   └── CallbackPage.tsx  # Página de callback do Spotify
├── repositories/         # Camada de acesso a dados
│   └── spotify/          # Repository da Spotify API
├── stores/               # Stores globais (Zustand)
├── types/                # Tipos TypeScript
├── locales/              # Arquivos de tradução (PT/EN)
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

1. **Criar uma conta no Spotify Developer Dashboard**
   - Acesse [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Faça login com sua conta do Spotify
   - Clique em "Create App"

2. **Configurar o App**
   - Nome: `Spotify Explorer` (ou qualquer nome)
   - Descrição: `Aplicação para explorar artistas e músicas`
   - Website: `http://localhost:5173`
   - Redirect URI: `http://127.0.0.1:5173/callback`

3. **Configurar Variáveis de Ambiente**

   ```bash
   # Copie o arquivo de exemplo
   cp env.example .env

   # Edite o arquivo .env com suas credenciais
   VITE_SPOTIFY_CLIENT_ID=seu_client_id_aqui
   VITE_SPOTIFY_CLIENT_SECRET=seu_client_secret_aqui
   VITE_SPOTIFY_REDIRECT_URI=http://127.0.0.1:5173/callback
   ```

4. **Verificar Configuração**
   ```bash
   npm run check-env
   ```

### Troubleshooting

Se você encontrar o erro "Code verifier not found in cookies", consulte o [guia de troubleshooting](docs/AUTHENTICATION_TROUBLESHOOTING.md) para soluções detalhadas.

## 🔄 React Query - **100% dos Dados**

O projeto usa React Query para **TODOS** os dados da aplicação:

### 🎯 Hooks com React Query

- **useSpotifySearch**: Busca de artistas com debounce
- **useArtistDetails**: Detalhes completos do artista
- **useArtistTopTracks**: Top músicas do artista
- **useArtistAlbums**: Álbuns com paginação
- **usePopularArtists**: Artistas populares
- **useUserLibrary**: Biblioteca do usuário
- **usePlaylistCreation**: Criação de playlists (mutations)
- **useSpotifyAuth**: Autenticação e tokens
- **usePrefetch**: Prefetch inteligente de dados

### 🚀 Otimizações Implementadas

- **Cache Inteligente**: Configurações otimizadas por tipo de dado
- **Stale Times**: Estratégias baseadas na frequência de mudança
- **Retry Logic**: Configurações de retry inteligentes
- **Query Keys**: Factory functions tipadas
- **Prefetch**: Dados relacionados carregados no hover
- **Mutations**: Operações de escrita otimizadas

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

### React Query (Estado de Servidor) - **100% dos Dados**

- **Cache Inteligente**: Todos os dados da API com cache otimizado
- **Estados Automáticos**: Loading, error e success para todas as queries
- **Invalidação Inteligente**: Cache invalidation baseado em dependências
- **Prefetch Otimizado**: Prefetch de dados relacionados no hover
- **Mutations**: Operações de escrita (criação de playlists)
- **Query Keys**: Factory functions tipadas para todas as queries
- **Stale Times**: Configurações otimizadas por tipo de dado
- **Retry Logic**: Retry automático com configurações inteligentes

### Zustand (Estado Local)

- Configurações de idioma e tema
- Estados de loading e erro
- Persistência automática

## 🎨 Interface e UX

### Design System

- **Tailwind CSS**: Framework CSS utilitário para design responsivo
- **Tema Escuro**: Interface moderna e elegante
- **Responsivo**: Funciona em desktop e mobile
- **Animações**: Transições suaves e feedback visual
- **Toast Notifications**: Sistema de feedback não-intrusivo

### Layout Responsivo

- **Desktop**: Layout com sidebar, header e área principal
- **Mobile**: Layout otimizado com header compacto e navegação inferior
- **Funcionalidades Unificadas**: Mesma experiência em todas as telas
- **Busca Integrada**: SearchInput funcional em desktop e mobile

### Componentes Principais

- **SearchInput**: Busca com debounce e clear
- **ArtistCard**: Card de artista com hover effects
- **LoadingSkeleton**: Skeleton loading para melhor UX
- **MobileLayout**: Layout otimizado para mobile
- **LanguageSelector**: Seletor de idioma compacto
- **Toast System**: Notificações elegantes com Sonner

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
- **[🧪 Testing Strategy](./docs/TESTING_STRATEGY.md)** - Estratégia de testes
- **[📱 Mobile Implementation](./docs/LIBRARY_AND_PLAYLISTS_IMPLEMENTATION.md)** - Implementação mobile

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
