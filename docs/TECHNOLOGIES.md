# 🛠️ Tecnologias

## Stack Principal

### ⚛️ Frontend

- **React 18**: Biblioteca JavaScript para interfaces de usuário
- **TypeScript**: Superset do JavaScript com tipagem estática
- **Vite**: Build tool moderno e rápido

### 🎨 Styling

- **Tailwind CSS**: Framework CSS utilitário
- **shadcn/ui**: Componentes React reutilizáveis
- **Tailwind CSS Animate**: Animações CSS

### 🔄 State Management

- **Zustand**: Gerenciamento de estado simples e eficiente
- **React Query (TanStack Query)**: Gerenciamento de estado de servidor

### 🌐 HTTP & API

- **Axios**: Cliente HTTP para requisições
- **Spotify Web API**: API oficial do Spotify

### 🌍 Internacionalização

- **react-i18next**: Biblioteca para internacionalização
- **i18next**: Framework de tradução

## Estrutura do Projeto

```
src/
├── app/                  # Configurações globais
│   ├── providers/        # Providers (React Query, i18n)
│   └── router.tsx        # Configuração de rotas
├── components/           # Componentes React
│   ├── ui/              # Componentes base (shadcn/ui)
│   ├── layout/          # Componentes de layout
│   └── artist/          # Componentes específicos
├── hooks/               # Custom hooks
├── pages/               # Páginas da aplicação
├── repositories/        # Camada de acesso a dados
├── stores/              # Gerenciamento de estado (Zustand)
├── types/               # Definições de tipos TypeScript
├── utils/               # Utilitários
└── locales/             # Arquivos de tradução
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

### Styling

```json
{
  "tailwindcss": "^4.1.11",
  "tailwindcss-animate": "^1.0.7",
  "@radix-ui/react-*": "^1.x.x"
}
```

### State Management

```json
{
  "zustand": "^5.0.7",
  "@tanstack/react-query": "^5.84.0"
}
```

### HTTP & API

```json
{
  "axios": "^1.11.0",
  "zod": "^3.25.76"
}
```

### Internationalization

```json
{
  "i18next": "^25.3.1",
  "react-i18next": "^15.6.0"
}
```

### UI Components

```json
{
  "lucide-react": "^0.525.0",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "tailwind-merge": "^3.3.1"
}
```

## Configurações

### TypeScript

- **Configuração estrita**: `strict: true`
- **Paths mapping**: Aliases para imports
- **ESLint integration**: Regras específicas para TypeScript

### ESLint

- **Configuração moderna**: Flat config
- **Regras React**: Hooks, JSX, accessibility
- **Import sorting**: Organização automática de imports
- **Prettier integration**: Formatação consistente

### Vite

- **HMR**: Hot Module Replacement
- **TypeScript**: Suporte nativo
- **Path aliases**: Configuração de imports
- **Build optimization**: Otimizações de produção

### Tailwind CSS

- **Configuração customizada**: Cores, fontes, breakpoints
- **shadcn/ui**: Componentes base
- **Animações**: Transições suaves
- **Responsive**: Design mobile-first

## Padrões de Desenvolvimento

### 🏗️ Arquitetura

- **Clean Architecture**: Separação de responsabilidades
- **Repository Pattern**: Camada de acesso a dados
- **Component Composition**: Componentes reutilizáveis
- **Custom Hooks**: Lógica reutilizável

### 📝 Code Quality

- **TypeScript**: Tipagem estrita
- **ESLint**: Regras de qualidade
- **Prettier**: Formatação consistente
- **Husky**: Git hooks

### 🧪 Testing

- **Vitest**: Framework de testes
- **Testing Library**: Testes de componentes
- **Coverage**: Relatórios de cobertura

### 🚀 Performance

- **Code splitting**: Carregamento sob demanda
- **Lazy loading**: Componentes carregados quando necessário
- **Cache optimization**: React Query para cache inteligente
- **Bundle optimization**: Vite para builds otimizados

## Integração com Spotify

### 🔐 Autenticação

- **OAuth 2.0**: Fluxo de autorização
- **Client Credentials**: Para funcionalidades básicas
- **Access Token**: Para funcionalidades completas

### 📡 API Endpoints

- **Search API**: Busca de artistas
- **Artists API**: Detalhes de artistas
- **Albums API**: Álbuns de artistas
- **Tracks API**: Músicas de artistas

### 🔄 Rate Limiting

- **Respecta limites**: Não excede rate limits da API
- **Retry logic**: Tentativas automáticas
- **Error handling**: Tratamento de erros robusto
