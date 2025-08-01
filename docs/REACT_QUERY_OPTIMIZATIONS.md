# React Query Optimizations

Este documento descreve as otimizações implementadas no React Query para melhorar a performance e experiência do usuário.

## 🎯 **Configuração Centralizada**

### **Arquivo: `src/config/react-query.ts`**

Configuração centralizada com constantes bem definidas para:

- **Cache Times**: Tempo que os dados ficam em memória
- **Stale Times**: Tempo antes dos dados serem considerados obsoletos
- **Retry Configs**: Configurações de retry para diferentes tipos de dados
- **Query Keys**: Factory functions para chaves de query tipadas

```typescript
// Exemplo de uso
const queryClient = createQueryClient()
```

## 🚀 **Prefetch Inteligente**

### **Hook: `usePrefetch`**

Implementa prefetch de dados relacionados para melhorar a UX:

```typescript
const { prefetchArtistData } = usePrefetch()

// Prefetch no hover do card do artista
const handleMouseEnter = () => {
  prefetchArtistData(artist.id, { enabled: true })
}
```

**Funcionalidades:**

- ✅ Prefetch de detalhes do artista
- ✅ Prefetch de top tracks
- ✅ Prefetch de álbuns
- ✅ Prefetch de resultados de busca
- ✅ Prefetch de artistas populares

## ⚡ **Optimistic Updates**

### **Hook: `useOptimisticUpdates`**

Atualizações otimistas para operações de mutação:

```typescript
const { optimisticallyUpdateArtist } = useOptimisticUpdates()

const handleUpdateArtist = async () => {
  const rollback = optimisticallyUpdateArtist(artistId, updates)

  try {
    await updateArtistAPI(artistId, updates)
  } catch (error) {
    rollback() // Reverte mudanças em caso de erro
  }
}
```

**Funcionalidades:**

- ✅ Atualização otimista de artistas
- ✅ Atualização otimista de álbuns
- ✅ Atualização otimista de tracks
- ✅ Adição/remoção otimista de álbuns
- ✅ Rollback automático em caso de erro

## 🔄 **Background Refetch**

### **Hook: `useBackgroundRefetch`**

Refetch automático de dados críticos:

```typescript
useBackgroundRefetch({
  enabled: true,
  interval: 5 * 60 * 1000, // 5 minutos
  onSuccess: () => console.log('Refetch completed'),
  onError: (error) => console.error('Refetch failed:', error),
})
```

**Funcionalidades:**

- ✅ Refetch em intervalos regulares
- ✅ Refetch no foco da janela
- ✅ Refetch na reconexão de rede
- ✅ Controle de frequência de refetch

## 📊 **Configurações de Cache**

### **Cache Times (gcTime)**

```typescript
CACHE_TIMES = {
  SHORT: 2 * 60 * 1000, // 2 minutos - dados temporários
  MEDIUM: 10 * 60 * 1000, // 10 minutos - dados normais
  LONG: 30 * 60 * 1000, // 30 minutos - dados estáticos
  INFINITE: Infinity, // Indefinido - dados críticos
}
```

### **Stale Times**

```typescript
STALE_TIMES = {
  FREQUENT: 1 * 60 * 1000, // 1 minuto - dados que mudam muito
  OCCASIONAL: 5 * 60 * 1000, // 5 minutos - dados que mudam ocasionalmente
  RARE: 15 * 60 * 1000, // 15 minutos - dados que raramente mudam
  STATIC: Infinity, // Indefinido - dados estáticos
}
```

## 🔧 **Query Keys Tipadas**

### **Factory Functions**

```typescript
queryKeys = {
  auth: {
    all: ['spotifyAuth'],
    status: () => [...queryKeys.auth.all, 'status'],
  },
  search: {
    all: ['searchArtists'],
    byQuery: (query: string) => [...queryKeys.search.all, query],
  },
  artists: {
    all: ['artist'],
    details: (id: string) => [...queryKeys.artists.all, id],
    topTracks: (id: string) => [...queryKeys.artists.all, id, 'topTracks'],
    albums: (id: string, page: number, limit: number) => [
      ...queryKeys.artists.all,
      id,
      'albums',
      page,
      limit,
    ],
  },
}
```

## 🎨 **Hooks Atualizados**

Todos os hooks existentes foram atualizados para usar as novas configurações:

### **useSpotifySearch**

- Query key tipada
- Cache time otimizado para busca
- Stale time frequente

### **useArtistDetails**

- Query key tipada
- Cache time médio
- Retry configurado para dados importantes

### **useArtistTopTracks**

- Query key tipada
- Cache time longo (dados estáticos)
- Stale time raro

### **useArtistAlbums**

- Query key tipada com paginação
- Cache time médio
- Retry configurado para dados importantes

### **useSpotifyAuth**

- Query key tipada
- Cache time infinito
- Sem retry (dados críticos)

## 🚀 **Benefícios Implementados**

### **Performance**

- ✅ Cache otimizado por tipo de dado
- ✅ Prefetch inteligente
- ✅ Background refetch controlado
- ✅ Invalidação seletiva

### **UX**

- ✅ Carregamento mais rápido
- ✅ Dados sempre atualizados
- ✅ Feedback imediato com optimistic updates
- ✅ Funcionamento offline melhorado

### **Manutenibilidade**

- ✅ Configuração centralizada
- ✅ Tipos TypeScript completos
- ✅ Hooks reutilizáveis
- ✅ Documentação clara

## 📝 **Exemplos de Uso**

### **Prefetch no Componente**

```typescript
import { usePrefetch } from '@/hooks'

function ArtistCard({ artist }) {
  const { prefetchArtistData } = usePrefetch()

  return (
    <div onMouseEnter={() => prefetchArtistData(artist.id)}>
      {/* Card content */}
    </div>
  )
}
```

### **Optimistic Update**

```typescript
import { useOptimisticUpdates } from '@/hooks'

function ArtistPage({ artistId }) {
  const { optimisticallyUpdateArtist } = useOptimisticUpdates()

  const handleLike = async () => {
    const rollback = optimisticallyUpdateArtist(artistId, { liked: true })

    try {
      await likeArtistAPI(artistId)
    } catch (error) {
      rollback()
    }
  }
}
```

### **Background Refetch**

```typescript
import { useBackgroundRefetch } from '@/hooks'

function App() {
  useBackgroundRefetch({
    enabled: true,
    interval: 5 * 60 * 1000,
  })

  return <div>App content</div>
}
```

## 🔮 **Próximas Melhorias**

- [ ] Implementar mutations com React Query
- [ ] Adicionar cache persistence
- [ ] Implementar infinite queries para paginação
- [ ] Adicionar cache warming strategies
- [ ] Implementar query deduplication
