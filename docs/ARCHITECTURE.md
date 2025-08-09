# 🏗️ Arquitetura do Projeto

## 📁 Estrutura de Diretórios

```
src/
├── app/                    # Configuração da aplicação e router
├── components/             # Componentes reutilizáveis
│   ├── artist/            # Componentes específicos de artista
│   ├── layout/            # Componentes de layout (Header, etc.)
│   ├── search/            # Componentes de busca
│   │   └── sections/      # Seções organizadas de resultados
│   ├── SEO/               # Componentes de SEO
│   └── ui/                # Componentes UI base + Containers
├── config/                # Configurações (ambiente)
├── constants/             # Constantes centralizadas (limites, configurações)
├── hooks/                 # Custom hooks + Presenters/Navigation handlers
├── lib/                   # Bibliotecas e configurações
├── locales/               # Arquivos de internacionalização
├── mappers/               # DTOs e mapeadores (Spotify → App)
├── pages/                 # Páginas da aplicação
├── repositories/          # Camada de acesso a dados (Spotify API)
├── schemas/               # Schemas de validação (Zod)
├── services/              # Lógica de negócio
├── stores/                # Estado global (Zustand)
├── types/                 # Definições de tipos TypeScript
└── utils/                 # Utilitários e helpers
```

## 🏛️ Padrões Arquiteturais

### Clean Architecture

O projeto segue os princípios da Clean Architecture com separação clara de responsabilidades:

#### **1. Presentation Layer (UI)**

- **Components**: Componentes React puramente apresentacionais
- **Pages**: Páginas que orquestram componentes
- **Hooks**: Custom hooks para lógica de UI

#### **2. Business Logic Layer (Services)**

- **Services**: Lógica de negócio centralizada
- **SearchService**: Lógica de busca e processamento de resultados
- **SearchQueryBuilder**: Construção de queries avançadas

#### **3. Data Access Layer (Repositories)**

- **Repositories**: Abstração da API Spotify
- **SpotifyRepository**: Cliente principal da API
- **SpotifyAuthService**: Gerenciamento de autenticação

#### **4. Domain Layer (Types & Schemas)**

- **Types**: Definições TypeScript do domínio
- **Schemas**: Validação com Zod
- **Mappers**: Transformação de dados da API para o domínio

### Repository Pattern

```typescript
// Exemplo: SpotifyRepository
class SpotifyRepository {
  async searchMultipleTypes(
    query: string,
    types: string[],
  ): Promise<SearchResults>
  async getArtistDetails(id: string): Promise<Artist>
  async getArtistAlbums(id: string): Promise<Album[]>
}
```

### Container/Presenter Pattern

```typescript
// Container: Lógica de negócio
const ArtistPageContainer = () => {
  const { data, isLoading } = useArtistDetails(id)
  return <ArtistPage artist={data} loading={isLoading} />
}

// Presenter: Apenas UI
const ArtistPage = ({ artist, loading }) => {
  if (loading) return <Skeleton />
  return <ArtistDetails artist={artist} />
}
```

## 🔄 Fluxo de Dados

### 1. Busca de Dados

```
User Input → SearchService → SpotifyRepository → Spotify API
                ↓
        Processed Results → UI Components
```

### 2. Autenticação

```
User Login → SpotifyAuthService → OAuth Flow → Token Storage
                ↓
        Authenticated Requests → Spotify API
```

### 3. Estado Global

```
User Actions → Zustand Store → UI Updates
                ↓
        Persistent State → Local Storage
```

## 🎯 Princípios de Design

### Single Responsibility Principle (SRP)

- Cada componente tem uma única responsabilidade
- Services focados em lógica de negócio específica
- Repositories responsáveis apenas por acesso a dados

### Dependency Inversion Principle (DIP)

- UI não depende diretamente da API
- Interfaces definem contratos entre camadas
- Injeção de dependências via props e context

### Open/Closed Principle (OCP)

- Extensível para novos tipos de busca
- Plugável para diferentes providers de dados
- Configurável para diferentes ambientes

## 🔧 Configuração e Ambiente

### Environment Configuration

```typescript
// src/config/environment.ts
export const config = {
  spotify: {
    clientId: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
    clientSecret: import.meta.env.VITE_SPOTIFY_CLIENT_SECRET,
    redirectUri: import.meta.env.VITE_SPOTIFY_REDIRECT_URI,
  },
  api: {
    baseUrl: 'https://api.spotify.com/v1',
    timeout: 10000,
  },
}
```

### Feature Flags

```typescript
// src/config/features.ts
export const features = {
  enableVirtualScrolling: true,
  enableServiceWorker: true,
  enablePerformanceMonitoring: true,
}
```

## 🧪 Testabilidade

### Arquitetura Testável

- **Unit Tests**: Services, repositories, utilities
- **Integration Tests**: API interactions
- **Component Tests**: UI components isolados
- **E2E Tests**: Fluxos completos do usuário

### Mock Strategy

```typescript
// Exemplo: Mock do SpotifyRepository
const mockSpotifyRepository = {
  searchMultipleTypes: vi.fn(),
  getArtistDetails: vi.fn(),
}
```

## 📱 Responsividade e Mobile

### Mobile-First Design

- **Breakpoints**: Mobile (< 768px), Tablet (768px-1024px), Desktop (> 1024px)
- **Touch Optimization**: Interações otimizadas para touch
- **Performance Mobile**: Otimizações específicas para dispositivos móveis

### Adaptive Components

```typescript
// Exemplo: Componente adaptativo
const ResponsiveGrid = ({ items }) => {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const columns = isMobile ? 2 : 5

  return <Grid columns={columns} items={items} />
}
```

## 🔐 Segurança

### OAuth 2.0 Implementation

- **PKCE Flow**: Proof Key for Code Exchange
- **Secure Token Storage**: HttpOnly cookies
- **Token Refresh**: Renovação automática de tokens
- **Fallback Strategy**: Client credentials quando necessário

### Data Validation

```typescript
// Exemplo: Validação com Zod
const artistSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  images: z.array(imageSchema),
})
```

## 🌍 Internacionalização

### i18n Architecture

- **Namespace Organization**: Separação por funcionalidade
- **Dynamic Translation**: Interpolação de variáveis
- **Fallback Strategy**: Fallback para idioma padrão
- **RTL Support**: Preparado para idiomas RTL

## 📊 Performance Architecture

### Code Splitting Strategy

- **Route-based**: Páginas carregadas sob demanda
- **Component-based**: Componentes pesados isolados
- **Vendor Splitting**: Bibliotecas externas separadas

### Caching Strategy

- **Service Worker**: Cache estratégico para assets
- **TanStack Query**: Cache inteligente para dados
- **Memory Cache**: Cache em memória para cálculos pesados

## 🔄 State Management

### Zustand Implementation

```typescript
// Exemplo: Store global
interface AppStore {
  language: string
  theme: 'light' | 'dark'
  loading: boolean
  error: string | null
  setLanguage: (lang: string) => void
  setTheme: (theme: 'light' | 'dark') => void
}
```

### Local State vs Global State

- **Global State**: Configurações da aplicação, autenticação
- **Local State**: Estado específico de componentes
- **Server State**: Dados da API gerenciados pelo TanStack Query

## 🚀 Deploy e CI/CD

### Build Optimization

- **Tree Shaking**: Eliminação de código não utilizado
- **Minification**: Compressão de código
- **Asset Optimization**: Otimização de imagens e assets
- **Bundle Analysis**: Análise de tamanho de código

### Environment Strategy

- **Development**: Configurações para desenvolvimento
- **Staging**: Configurações para testes
- **Production**: Configurações otimizadas para produção
