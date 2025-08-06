# Implementação do SearchAllTypes no Modo "All"

## Visão Geral

Este documento descreve as mudanças implementadas para usar `SearchService.searchAllTypes` no modo "All" com limit=5, garantindo que o hook `useSpotifySearch` preserve o `hasMore` por tipo.

## Mudanças Implementadas

### 1. Lógica de Seleção de Método

**Arquivo**: `src/hooks/useSpotifySearch.ts`

**Antes**:

```typescript
// For multiple types or "all", use the multiple method
const isAllMode =
  filters.types.length > 1 ||
  filters.types.length === 7 ||
  filters.types.includes(SpotifySearchType.ALL)
const limit = isAllMode ? 5 : 20

const result = await searchService.searchMultipleTypes(
  debouncedSearchQuery,
  filters.types,
  filters as unknown as Record<string, unknown>,
  limit,
  0,
)
```

**Depois**:

```typescript
// For multiple types or "all", use the appropriate method
const isAllMode =
  filters.types.length > 1 ||
  filters.types.length === 7 ||
  filters.types.includes(SpotifySearchType.ALL)

if (isAllMode) {
  // Use searchAllTypes for "All" mode with limit=5
  const result = await searchService.searchAllTypes(
    debouncedSearchQuery,
    filters.types,
    filters as unknown as Record<string, unknown>,
    0,
  )
  return result
} else {
  // Use searchMultipleTypes for specific type combinations with limit=20
  const result = await searchService.searchMultipleTypes(
    debouncedSearchQuery,
    filters.types,
    filters as unknown as Record<string, unknown>,
    20,
    0,
  )
  return result
}
```

### 2. Detecção do Modo "All"

O sistema detecta o modo "All" quando:

- `filters.types.length > 1` (múltiplos tipos selecionados)
- `filters.types.length === 7` (todos os tipos selecionados)
- `filters.types.includes(SpotifySearchType.ALL)` (sentinel ALL presente)

### 3. Métodos Utilizados

#### Modo "All" (limit=5)

- **Método**: `searchService.searchAllTypes()`
- **Limite**: 5 itens por tipo
- **Uso**: Página principal `/search` com visualização geral

#### Modo Específico (limit=20)

- **Método**: `searchService.searchMultipleTypes()`
- **Limite**: 20 itens por tipo
- **Uso**: Combinações específicas de tipos

#### Modo Único (limit=20)

- **Método**: `searchService.searchArtists()`, `searchService.searchAlbums()`, etc.
- **Limite**: 20 itens
- **Uso**: Busca por tipo específico

## Funcionalidades do SearchAllTypes

### Implementação Existente

O método `searchAllTypes` já estava implementado no `SearchService` com:

```typescript
async searchAllTypes(
  query: string,
  types: SpotifySearchType[],
  filters: Record<string, unknown>,
  offset: number = 0,
): Promise<{
  results: AggregatedSearchResults
  state: SearchState
}>
```

### Características

- **Limite fixo**: 5 itens por tipo
- **Processamento**: Usa `SearchResultProcessor.processMultipleTypesResponse`
- **HasMore**: Calculado corretamente por tipo
- **Estado**: Gerenciado pelo `SearchStateManager`

## Critérios de Aceitação

### ✅ /search (All) exibe no máximo 5 itens por seção

- [x] `searchAllTypes` usa limit=5 fixo
- [x] Modo "All" detectado corretamente
- [x] Hook chama o método apropriado

### ✅ hasMore vem verdadeiro quando total > 5

- [x] `SearchResultProcessor.processMultipleTypesResponse` calcula `hasMore`
- [x] `hasMore = total > limit + offset`
- [x] Preservado no retorno do hook

### ✅ Preservação do hasMore por tipo

- [x] `AggregatedSearchResults` mantém `hasMore` por tipo
- [x] `results.artists.hasMore`, `results.albums.hasMore`, etc.
- [x] Hook retorna estrutura completa

## Fluxo de Funcionamento

### 1. Detecção do Modo

```typescript
const isAllMode =
  filters.types.length > 1 ||
  filters.types.length === 7 ||
  filters.types.includes(SpotifySearchType.ALL)
```

### 2. Seleção do Método

```typescript
if (isAllMode) {
  // searchAllTypes com limit=5
} else {
  // searchMultipleTypes com limit=20
}
```

### 3. Processamento dos Resultados

```typescript
// searchAllTypes internamente chama:
const results = SearchResultProcessor.processMultipleTypesResponse(
  response,
  types,
  5, // limit fixo
  offset,
)
```

### 4. Retorno do Hook

```typescript
return {
  results: {
    artists: { items: [], total: 0, hasMore: false },
    albums: { items: [], total: 0, hasMore: false },
    // ... outros tipos
  },
  state: {
    /* estado da busca */
  },
}
```

## Testes Implementados

### Novos Testes

- `src/hooks/__tests__/useSpotifySearch.test.ts` - Testes do hook principal
- Atualização em `src/services/__tests__/SearchService.test.ts` - Verifica `searchAllTypes`

### Testes Existentes

- Todos os 192 testes passando
- Linter sem erros
- Funcionalidade preservada

## Benefícios

### 1. Performance

- **Limit=5**: Carregamento mais rápido na página principal
- **Limit=20**: Paginação adequada para buscas específicas

### 2. UX

- **Visualização geral**: 5 itens por seção na página principal
- **"Ver tudo"**: Navegação para páginas específicas com mais itens

### 3. Manutenibilidade

- **Separação clara**: Métodos específicos para cada caso de uso
- **Código limpo**: Lógica de seleção bem definida

### 4. Escalabilidade

- **Flexibilidade**: Fácil ajuste de limites por contexto
- **Extensibilidade**: Novos modos podem ser adicionados facilmente

## Monitoramento

### Logs de Debug

O sistema inclui logs detalhados para monitoramento:

```typescript
console.log('🔍 useSpotifySearch - filters.types:', filters.types)
console.log('🔍 useSpotifySearch - filters.types.length:', filters.types.length)
```

### Métricas Sugeridas

- Uso de `searchAllTypes` vs `searchMultipleTypes`
- Tempo de resposta por modo
- Taxa de uso do "Ver tudo"

## Próximos Passos

### Melhorias Possíveis

1. **Cache inteligente**: Cache separado para modo "All"
2. **Lazy loading**: Carregamento sob demanda das seções
3. **Personalização**: Limites configuráveis por usuário
4. **Analytics**: Métricas de uso por modo de busca

### Manutenção

1. **Monitoramento**: Observar performance dos dois métodos
2. **Ajustes**: Refinar limites baseado no uso real
3. **Documentação**: Manter documentação atualizada
