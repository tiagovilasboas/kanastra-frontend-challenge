# React Query Optimizations - Simplified

Este documento descreve as otimizações implementadas no React Query, focando apenas no que realmente importa para a performance e experiência do usuário.

## 🎯 **Configuração Centralizada**

### **Arquivo: `src/config/cache.ts`**

Configuração centralizada para cache com namespace organizado:

- **Cache Times**: Tempo que os dados ficam em memória
- **Stale Times**: Tempo antes dos dados serem considerados obsoletos
- **Retry Configs**: Configurações de retry para diferentes tipos de dados

```typescript
// Exemplo de uso com namespace
import { cache } from '@/config/react-query'

// Cache times
cache.times.SHORT // 2 minutos
cache.times.MEDIUM // 10 minutos
cache.times.LONG // 30 minutos
cache.times.INFINITE // Indefinido

// Stale times
cache.stale.FREQUENT // 1 minuto
cache.stale.OCCASIONAL // 5 minutos
cache.stale.RARE // 15 minutos
cache.stale.STATIC // Indefinido

// Retry configs
cache.retry.CRITICAL // 3 tentativas
cache.retry.IMPORTANT // 2 tentativas
cache.retry.OPTIONAL // 1 tentativa
cache.retry.NONE // Sem retry
```

### **Arquivo: `src/config/react-query.ts`**

Configuração do React Query com:

- **Query Keys**: Factory functions para chaves de query tipadas
- **Query Client**: Configuração centralizada do cliente

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
- ✅ Prefetch de álbuns (primeira página)
- ✅ Fail silently para não impactar UX

## 🔧 **Query Keys Tipadas**

### **Factory Functions**

```typescript
queryKeys = {
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

- **Simplificado**: Usa `useState` em vez de React Query
- **Motivo**: Autenticação é baseada em `localStorage` (dados locais)
- **Benefício**: Menos complexidade, mesma funcionalidade

## 🚀 **Benefícios Implementados**

### **Performance**

- ✅ Cache otimizado por tipo de dado
- ✅ Prefetch inteligente apenas onde necessário
- ✅ Configurações de retry apropriadas
- ✅ Invalidação seletiva

### **UX**

- ✅ Carregamento mais rápido com prefetch
- ✅ Dados sempre atualizados
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

### **Uso do Namespace Cache**

```typescript
import { cache, queryKeys } from '@/config/react-query'

// Em um hook customizado
const { data } = useQuery({
  queryKey: queryKeys.artists.details(artistId),
  queryFn: () => getArtist(artistId),
  staleTime: cache.stale.OCCASIONAL, // 5 minutos
  gcTime: cache.times.MEDIUM, // 10 minutos
  retry: cache.retry.IMPORTANT.retry,
  retryDelay: cache.retry.IMPORTANT.retryDelay,
})
```

## 🎯 **Princípios Aplicados**

### **React Query Apenas Onde Faz Sentido**

- ✅ **APIs externas**: Spotify API
- ✅ **Dados que mudam**: Search results, artist details
- ✅ **Cache necessário**: Para evitar requests repetidos
- ❌ **Dados locais**: localStorage (useState é suficiente)
- ❌ **Dados estáticos**: Não precisam de optimistic updates
- ❌ **Operações síncronas**: Não precisam de React Query

### **Simplicidade vs Complexidade**

- ✅ **Prefetch simples**: Apenas dados essenciais
- ✅ **Cache apropriado**: Baseado na frequência de mudança
- ✅ **Retry inteligente**: Apenas onde necessário
- ❌ **Over-engineering**: Evitado em favor da simplicidade

## 🚨 **O que foi Removido (Over-Engineering)**

### **1. Optimistic Updates**

- **Motivo**: Dados do Spotify não são editáveis pelo usuário
- **Substituição**: Não necessária

### **2. Background Refetch**

- **Motivo**: Dados de artistas raramente mudam
- **Substituição**: Cache time apropriado é suficiente

### **3. React Query para Autenticação**

- **Motivo**: localStorage é operação síncrona local
- **Substituição**: useState + useEffect

### **4. Prefetch Excessivo**

- **Motivo**: Prefetch de dados que podem não ser usados
- **Substituição**: Prefetch apenas de dados essenciais

## ✅ **Resultado Final**

- **Menos complexidade**: Código mais fácil de entender e manter
- **Melhor performance**: Foco apenas no que realmente importa
- **UX mantida**: Funcionalidades essenciais preservadas
- **Clean Code**: Princípios SOLID aplicados corretamente
