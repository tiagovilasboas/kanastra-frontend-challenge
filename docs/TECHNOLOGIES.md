# 🛠️ Tecnologias

## Stack Principal

### ⚛️ Frontend

- **React 18**: Biblioteca JavaScript para interfaces de usuário
- **TypeScript**: Superset do JavaScript com tipagem estática
- **Vite**: Build tool moderno e rápido
- **React Router DOM**: Roteamento client-side com lazy loading

### 🎨 Styling

- **Tailwind CSS**: Framework CSS utilitário
- **shadcn/ui**: Componentes React reutilizáveis
- **Tailwind CSS Animate**: Animações CSS
- **Lucide React**: Ícones modernos e consistentes

### 🔄 State Management

- **Zustand**: Gerenciamento de estado simples e eficiente
- **React Query (TanStack Query)**: Cache e sincronização de dados
- **Axios**: Cliente HTTP para requisições

### 🌐 HTTP & API

- **Spotify Web API**: API oficial do Spotify
- **OAuth 2.0**: Autenticação segura
- **Client Credentials**: Fallback para busca pública

### 🌍 Internacionalização

- **react-i18next**: Biblioteca para internacionalização
- **i18next**: Framework de tradução
- **Interpolação dinâmica**: Variáveis em traduções

### 🧪 Qualidade de Código

- **ESLint**: Linting de código
- **Prettier**: Formatação automática
- **Husky**: Git hooks
- **Vitest**: Framework de testes

### 🚀 Deploy

- **Vercel**: Plataforma de deploy
- **GitHub Actions**: CI/CD (se configurado)

## Estrutura do Projeto

```
src/
├── app/                  # Configurações globais
│   ├── providers/        # Providers (React Query, i18n)
│   ├── App.tsx          # Componente principal
│   ├── App.test.tsx     # Testes do App
│   └── router.tsx       # Configuração de rotas
├── components/           # Componentes React
│   ├── ui/              # Componentes base (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── ArtistCard.tsx
│   │   ├── AlbumCard.tsx
│   │   ├── TrackCard.tsx
│   │   ├── TrackListItem.tsx
│   │   ├── TrackList.tsx
│   │   └── ...
│   ├── layout/          # Componentes de layout
│   │   ├── AppLayout.tsx
│   │   ├── Header/
│   │   ├── Sidebar/
│   │   └── Container/
│   ├── artist/          # Componentes específicos de artistas
│   │   ├── ArtistHeader.tsx
│   │   ├── ArtistAlbums.tsx
│   │   ├── ArtistTopTracks.tsx
│   │   └── ArtistPageSkeleton.tsx
│   ├── ErrorBoundary/   # Tratamento de erros
│   └── SEO/             # Otimização para motores de busca
├── hooks/               # Custom hooks
│   ├── useSpotifySearch.ts
│   ├── usePopularArtists.ts
│   ├── useArtistPage.ts
│   ├── useArtistAlbums.ts
│   ├── useArtistTopTracks.ts
│   └── ...
├── pages/               # Páginas da aplicação
│   ├── HomePage.tsx
│   ├── SearchPage.tsx
│   ├── ArtistPage.tsx
│   ├── ArtistsPage.tsx
│   ├── AlbumsPage.tsx
│   ├── FavoritesPage.tsx
│   └── CallbackPage.tsx
├── repositories/        # Camada de acesso a dados
│   ├── base/
│   │   └── BaseRepository.ts
│   └── spotify/
│       ├── SpotifyRepository.ts
│       ├── SpotifyAuthService.ts
│       └── SpotifySearchService.ts
├── stores/              # Gerenciamento de estado (Zustand)
│   ├── appStore.ts
│   ├── searchStore.ts
│   ├── navigationStore.ts
│   └── index.ts
├── types/               # Definições de tipos TypeScript
│   ├── spotify.ts
│   ├── search.ts
│   └── vite-env.d.ts
├── utils/               # Utilitários
│   ├── formatters.ts
│   ├── validation.ts
│   ├── errorHandler.ts
│   ├── logger.ts
│   └── ...
├── locales/             # Arquivos de tradução
│   ├── en/
│   │   ├── common.json
│   │   ├── search.json
│   │   ├── artist.json
│   │   ├── albums.json
│   │   ├── audio.json
│   │   ├── ui.json
│   │   └── ...
│   └── pt/
│       ├── common.json
│       ├── search.json
│       ├── artist.json
│       ├── albums.json
│       ├── audio.json
│       ├── ui.json
│       └── ...
├── config/              # Configurações
│   ├── i18n.ts
│   ├── react-query.ts
│   ├── environment.ts
│   └── cache.ts
├── constants/           # Constantes da aplicação
│   ├── spotify.ts
│   ├── artists.ts
│   └── index.ts
├── schemas/             # Schemas de validação
│   └── spotify.ts
└── styles/              # Estilos globais
    └── globals.css
```

## Dependências Principais

### Core

```json
{
  "react": "^19.1.0",
  "react-dom": "^19.1.0",
  "typescript": "~5.8.3"
}
```

### Build & Development

```json
{
  "vite": "^7.0.0",
  "@vitejs/plugin-react": "^4.5.2",
  "vite-tsconfig-paths": "^5.1.4"
}
```

### Routing

```json
{
  "react-router-dom": "^6.28.0"
}
```

### Styling

```json
{
  "tailwindcss": "^4.1.11",
  "tailwindcss-animate": "^1.0.7",
  "@radix-ui/react-*": "^1.x.x",
  "lucide-react": "^0.468.0"
}
```

### State Management

```json
{
  "zustand": "^5.0.7",
  "@tanstack/react-query": "^5.84.0",
  "axios": "^1.11.0"
}
```

### Internacionalização

```json
{
  "react-i18next": "^15.1.1",
  "i18next": "^24.1.0",
  "i18next-browser-languagedetector": "^8.0.2"
}
```

### Validação

```json
{
  "zod": "^3.25.76"
}
```

### Qualidade de Código

```json
{
  "eslint": "^9.17.0",
  "prettier": "^3.4.1",
  "husky": "^9.1.6",
  "vitest": "^2.1.8"
}
```

## Padrões de Desenvolvimento

### 🏗️ Arquitetura

- **Separation of Concerns**: Lógica separada por domínio
- **Repository Pattern**: Camada de abstração para APIs
- **Custom Hooks**: Lógica reutilizável encapsulada
- **Component Composition**: Componentes pequenos e focados

### 📝 TypeScript

- **Tipagem explícita**: Funções e componentes tipados
- **Interfaces bem definidas**: Contratos claros entre camadas
- **Type Safety**: Sem uso de `any`, preferindo `unknown`
- **Enums e Union Types**: Para conjuntos finitos de valores

### 🎨 Componentes

- **Presentational/Container**: Separação de responsabilidades
- **Composability**: Componentes reutilizáveis
- **Props tipadas**: Interface clara para props
- **Event handlers**: Callbacks tipados

### 🔄 Estado

- **Zustand**: Estado global simples
- **React Query**: Cache e sincronização de dados
- **Local State**: useState para estado local
- **Derived State**: Estado calculado quando possível

### 🌐 API

- **Repository Layer**: Abstração para APIs externas
- **Error Handling**: Tratamento consistente de erros
- **Loading States**: Estados de carregamento
- **Retry Logic**: Lógica de retry para falhas

### 🌍 Internacionalização

- **Organização por domínio**: Traduções organizadas por contexto
- **Interpolação dinâmica**: Variáveis em traduções
- **Fallbacks**: Valores padrão para traduções faltantes
- **Type Safety**: Tipagem para chaves de tradução

## Configurações

### Vite

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query'],
        },
      },
    },
  },
})
```

### TypeScript

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### Tailwind CSS

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
```

## Performance

### 🚀 Otimizações

- **Code Splitting**: Lazy loading de páginas
- **Bundle Splitting**: Chunks separados para vendor libraries
- **Image Optimization**: Imagens otimizadas
- **Debounce**: Otimização de busca em tempo real
- **React Query**: Cache inteligente de dados

### 📊 Métricas

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## Deploy

### Vercel

```json
// vercel.json
{
  "name": "kanastra-frontend-challenge",
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "VITE_SPOTIFY_CLIENT_ID": "@spotify_client_id",
    "VITE_SPOTIFY_CLIENT_SECRET": "@spotify_client_secret",
    "VITE_SPOTIFY_REDIRECT_URI": "https://kanastra-frontend-challenge.vercel.app/callback"
  }
}
```
