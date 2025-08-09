# 🔧 Guia de Desenvolvimento

## 🚀 Setup Inicial

### Pré-requisitos

- **Node.js**: 20.18.0 ou superior
- **npm**: 10.8.2 ou superior
- **Git**: Para controle de versão

### Instalação

```bash
# Clone o repositório
git clone https://github.com/tiagovilasboas/kanastra-frontend-challenge.git

# Entre no diretório
cd kanastra-frontend-challenge

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp env.example .env.local
```

### Configuração do Spotify API

1. Acesse o [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Crie um novo aplicativo ou use um existente
3. Copie o **Client ID** e **Client Secret**
4. Configure as URLs de redirecionamento no dashboard
5. Edite o arquivo `.env.local`:

```env
VITE_SPOTIFY_CLIENT_ID=seu_client_id_aqui
VITE_SPOTIFY_CLIENT_SECRET=seu_client_secret_aqui
VITE_SPOTIFY_REDIRECT_URI=http://127.0.0.1:5173/callback
```

## 🛠️ Scripts Disponíveis

### Desenvolvimento

```bash
# Servidor de desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview

# Verificar tipos TypeScript
npm run type-check
```

### Qualidade de Código

```bash
# Verificar código
npm run lint

# Corrigir problemas de lint automaticamente
npm run lint:fix

# Executar testes unitários
npm run test

# Executar testes E2E
npm run test:e2e

# Executar testes em modo watch
npm run test:watch
```

### Análise e Performance

```bash
# Análise de bundle
npm run analyze

# Auditoria de performance
npm run lighthouse

# Auditoria em desenvolvimento
npm run lighthouse:dev
```

## 📁 Estrutura do Projeto

### Organização de Arquivos

```
src/
├── app/                    # Configuração da aplicação
│   ├── App.tsx            # Componente principal
│   ├── providers/         # Providers (Context, etc.)
│   └── router.tsx         # Configuração de rotas
├── components/            # Componentes reutilizáveis
│   ├── artist/           # Componentes específicos de artista
│   ├── layout/           # Componentes de layout
│   ├── search/           # Componentes de busca
│   └── ui/               # Componentes UI base
├── hooks/                # Custom hooks
├── pages/                # Páginas da aplicação
├── repositories/         # Camada de acesso a dados
├── services/             # Lógica de negócio
├── stores/               # Estado global (Zustand)
├── types/                # Definições TypeScript
└── utils/                # Utilitários
```

### Convenções de Nomenclatura

- **Componentes**: PascalCase (`ArtistCard.tsx`)
- **Hooks**: camelCase com prefixo `use` (`useSpotifySearch.ts`)
- **Utilitários**: camelCase (`formatters.ts`)
- **Tipos**: PascalCase (`SpotifyArtist.ts`)
- **Constantes**: UPPER_SNAKE_CASE (`SEARCH_LIMITS`)

## 🔧 Configuração de Desenvolvimento

### Editor Setup

Recomendamos usar **VS Code** com as seguintes extensões:

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

### Configuração do VS Code

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

## 🧪 Desenvolvimento com Testes

### Executando Testes

```bash
# Todos os testes
npm run test

# Testes específicos
npm run test -- --run src/utils/__tests__/formatters.test.ts

# Testes com coverage
npm run test -- --coverage

# Testes em modo watch
npm run test:watch
```

### Debugging de Testes

```bash
# Debug de teste específico
npm run test -- --debug src/utils/__tests__/formatters.test.ts
```

## 🔍 Debugging

### Debug no Browser

```typescript
// Exemplo de debug
console.log('Debug info:', { data, loading, error })
debugger // Breakpoint no código
```

### React DevTools

- Instale a extensão React DevTools no browser
- Use para inspecionar componentes e estado

### Network Tab

- Use para debugar requisições à API
- Verifique headers, payload e responses

## 📝 Padrões de Código

### Componentes React

```typescript
// Exemplo de componente
interface ArtistCardProps {
  artist: Artist
  onClick?: (artist: Artist) => void
}

export const ArtistCard: React.FC<ArtistCardProps> = ({ artist, onClick }) => {
  const handleClick = () => {
    onClick?.(artist)
  }

  return (
    <div
      className="artist-card"
      onClick={handleClick}
      data-testid="artist-card"
    >
      <img src={artist.images[0]?.url} alt={artist.name} />
      <h3>{artist.name}</h3>
    </div>
  )
}
```

### Custom Hooks

```typescript
// Exemplo de custom hook
export const useSpotifySearch = (query: string) => {
  const [results, setResults] = useState<SearchResults | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!query.trim()) return

    const searchData = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await spotifyRepository.search(query)
        setResults(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed')
      } finally {
        setLoading(false)
      }
    }

    searchData()
  }, [query])

  return { results, loading, error }
}
```

### TypeScript

```typescript
// Exemplo de tipos
interface Artist {
  id: string
  name: string
  images: SpotifyImage[]
  popularity: number
  genres: string[]
}

type SearchType = 'artist' | 'album' | 'track' | 'playlist'

interface SearchParams {
  query: string
  type: SearchType
  limit?: number
  offset?: number
}
```

## 🚀 Performance

### Otimizações de Desenvolvimento

```typescript
// Exemplo: React.memo para componentes
export const ArtistCard = React.memo<ArtistCardProps>(({ artist, onClick }) => {
  // Component implementation
})

// Exemplo: useMemo para cálculos pesados
const expensiveValue = useMemo(() => {
  return heavyCalculation(data)
}, [data])

// Exemplo: useCallback para funções
const handleClick = useCallback(
  (artist: Artist) => {
    onClick?.(artist)
  },
  [onClick],
)
```

### Bundle Analysis

```bash
# Analisar tamanho do bundle
npm run analyze

# Verificar chunks
npm run build && npm run preview
```

## 🔐 Segurança

### Variáveis de Ambiente

- Nunca commite arquivos `.env` no repositório
- Use `.env.example` como template
- Valide variáveis obrigatórias no startup

### Validação de Dados

```typescript
// Exemplo: Validação com Zod
const searchParamsSchema = z.object({
  query: z.string().min(2),
  type: z.enum(['artist', 'album', 'track']),
  limit: z.number().min(1).max(50).optional(),
})

const validateSearchParams = (params: unknown) => {
  return searchParamsSchema.parse(params)
}
```

## 🌍 Internacionalização

### Adicionando Traduções

```typescript
// src/locales/pt/search.json
{
  "placeholder": "Pesquisar artistas, álbuns ou músicas",
  "noResults": "Nenhum resultado encontrado",
  "loading": "Carregando..."
}

// src/locales/en/search.json
{
  "placeholder": "Search for artists, albums or songs",
  "noResults": "No results found",
  "loading": "Loading..."
}
```

### Usando Traduções

```typescript
import { useTranslation } from 'react-i18next'

const SearchComponent = () => {
  const { t } = useTranslation('search')

  return (
    <input
      placeholder={t('placeholder')}
      aria-label={t('placeholder')}
    />
  )
}
```

## 📱 Responsividade

### Breakpoints

```css
/* Tailwind CSS breakpoints */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
```

### Componentes Responsivos

```typescript
// Exemplo: Grid responsivo
const ResponsiveGrid = ({ items }: { items: Artist[] }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {items.map(artist => (
        <ArtistCard key={artist.id} artist={artist} />
      ))}
    </div>
  )
}
```

## 🔄 Git Workflow

### Commits

```bash
# Commits convencionais
git commit -m "feat: add artist search functionality"
git commit -m "fix: resolve mobile layout issues"
git commit -m "docs: update README with new features"
git commit -m "test: add unit tests for search service"
```

### Branches

```bash
# Criar feature branch
git checkout -b feature/artist-search

# Criar bugfix branch
git checkout -b fix/mobile-layout

# Criar hotfix branch
git checkout -b hotfix/critical-bug
```

### Pull Requests

- Use templates para PRs
- Inclua descrição detalhada das mudanças
- Adicione screenshots quando relevante
- Referencie issues relacionadas

## 🚨 Troubleshooting

### Problemas Comuns

#### Build Fails

```bash
# Limpar cache
rm -rf node_modules package-lock.json
npm install

# Verificar tipos
npm run type-check
```

#### Tests Failing

```bash
# Limpar cache de testes
npm run test -- --clearCache

# Executar testes específicos
npm run test -- --run src/utils/__tests__/formatters.test.ts
```

#### Performance Issues

```bash
# Analisar bundle
npm run analyze

# Verificar métricas
npm run lighthouse
```

## 📚 Recursos Adicionais

### Documentação

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/)

### Ferramentas

- [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools)
- [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
