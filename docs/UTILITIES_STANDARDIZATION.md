# Padronização de Utilitários

## Visão Geral

Este documento descreve as mudanças implementadas para padronizar os utilitários do Spotify Repository, incluindo a implementação de feature flags para gêneros e a padronização dos métodos ISRC/UPC.

## Mudanças Implementadas

### 1. Métodos ISRC/UPC Padronizados

#### `getTrackByISRC(isrc: string)`

- **Antes**: Usava endpoint específico
- **Depois**: Usa `/search` com `q=isrc:<code>&type=track`
- **Benefício**: Consistência com outros métodos de busca
- **Retorno**: `SpotifyTrack[]`

#### `getAlbumByUPC(upc: string)`

- **Antes**: Usava endpoint específico
- **Depois**: Usa `/search` com `q=upc:<code>&type=album`
- **Benefício**: Consistência com outros métodos de busca
- **Retorno**: `SpotifyAlbum[]`

### 2. Sistema de Feature Flags para Gêneros

#### Configuração

- **Arquivo**: `src/config/features.ts`
- **Flags disponíveis**:
  - `ENABLE_GENRES_ENDPOINT`: Controla se usa API ou fallback
  - `ENABLE_GENRES_FALLBACK`: Controla se usa lista estática
  - `ENABLE_GENRES_DEPRECATION_WARNING`: Controla avisos de depreciação

#### Variáveis de Ambiente

```bash
REACT_APP_ENABLE_GENRES_ENDPOINT=true
REACT_APP_ENABLE_GENRES_FALLBACK=true
REACT_APP_ENABLE_GENRES_DEPRECATION_WARNING=true
```

### 3. Fallback de Gêneros

#### Lista Estática

- **Arquivo**: `src/constants/genres.ts`
- **Conteúdo**: 126 gêneros baseados na API do Spotify
- **Uso**: Fallback quando API retorna 410/404

#### Comportamento

1. **API habilitada + Fallback habilitado**:
   - Tenta API primeiro
   - Se falha, usa lista estática
   - Loga warning sobre falha

2. **API desabilitada + Fallback habilitado**:
   - Usa lista estática diretamente
   - Sem tentativa de API

3. **API habilitada + Fallback desabilitado**:
   - Tenta API
   - Se falha, lança erro

4. **Ambos desabilitados**:
   - Lança erro imediatamente

### 4. Avisos de Depreciação

#### `getAvailableGenres()`

- **Aviso**: "getAvailableGenres is deprecated. The Spotify API endpoint may return 410/404. Using fallback list."
- **Controle**: Feature flag `ENABLE_GENRES_DEPRECATION_WARNING`
- **Log**: Usa `logger.warn()` para não quebrar produção

## Arquivos Modificados

### Novos Arquivos

- `src/config/features.ts` - Sistema de feature flags
- `src/constants/genres.ts` - Lista estática de gêneros
- `docs/UTILITIES_STANDARDIZATION.md` - Esta documentação

### Arquivos Atualizados

- `src/repositories/spotify/SpotifySearchService.ts`
  - `getTrackByISRC()` - Padronizado para usar `/search`
  - `getAlbumByUPC()` - Padronizado para usar `/search`
  - `getAvailableGenres()` - Com fallback e feature flags

- `src/repositories/spotify/SpotifyRepository.ts`
  - Melhor tratamento de erros nos métodos ISRC/UPC
  - Tratamento de erros em `getAvailableGenres()`

## Critérios de Aceitação

### ✅ ISRC/UPC Funcionando

- [x] `getTrackByISRC()` usa `/search` com `q=isrc:<code>&type=track`
- [x] `getAlbumByUPC()` usa `/search` com `q=upc:<code>&type=album`
- [x] Retorno consistente com outros métodos de busca
- [x] Tratamento de erros adequado

### ✅ Gêneros Resilientes

- [x] Feature flags para controle granular
- [x] Fallback com lista estática (126 gêneros)
- [x] Avisos de depreciação configuráveis
- [x] Não quebra em produção se API retorna 410/404
- [x] Logs informativos para debugging

### ✅ Testes

- [x] Testes básicos para métodos atualizados
- [x] Todos os testes existentes passando
- [x] Linter sem erros

## Uso em Produção

### Configuração Recomendada

```bash
# Para máxima compatibilidade
REACT_APP_ENABLE_GENRES_ENDPOINT=true
REACT_APP_ENABLE_GENRES_FALLBACK=true
REACT_APP_ENABLE_GENRES_DEPRECATION_WARNING=true

# Para forçar fallback (se API estiver instável)
REACT_APP_ENABLE_GENRES_ENDPOINT=false
REACT_APP_ENABLE_GENRES_FALLBACK=true
REACT_APP_ENABLE_GENRES_DEPRECATION_WARNING=false
```

### Monitoramento

- Logs de warning quando API falha
- Logs de depreciação quando habilitados
- Métricas de uso de fallback vs API

## Migração

### Para Desenvolvedores

1. **ISRC/UPC**: Nenhuma mudança na interface, apenas implementação interna
2. **Gêneros**: Comportamento mantido, mas com fallback automático
3. **Feature Flags**: Configuráveis via variáveis de ambiente

### Para DevOps

1. **Deploy**: Adicionar variáveis de ambiente conforme necessário
2. **Monitoramento**: Observar logs de warning e depreciação
3. **Rollback**: Desabilitar feature flags se necessário
