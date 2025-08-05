# Testes E2E por Domínio

Esta pasta contém os testes end-to-end organizados por domínio da aplicação Spotify Explorer.

## Estrutura dos Testes

### Domínios Testados

#### 1. **Autenticação** (`auth.cy.ts`)

- **Funcionalidades testadas:**
  - Fluxo OAuth do Spotify
  - Gerenciamento de tokens
  - Estados de autenticação
  - Tratamento de erros de autenticação

- **Cenários principais:**
  - Login via Spotify OAuth
  - Callback de autenticação
  - Refresh automático de tokens
  - Logout e limpeza de estado
  - Persistência de estado de autenticação

#### 2. **Navegação** (`navigation.cy.ts`)

- **Funcionalidades testadas:**
  - Navegação entre rotas
  - Menu de navegação
  - Breadcrumbs
  - Navegação mobile
  - Navegação do navegador (back/forward)
  - Deep linking

- **Cenários principais:**
  - Navegação entre páginas
  - Menu responsivo
  - Histórico do navegador
  - URLs diretas
  - Performance de navegação

#### 3. **Busca** (`search.cy.ts`)

- **Funcionalidades testadas:**
  - Interface de busca
  - Busca por artistas, álbuns e tracks
  - Filtros de busca
  - Resultados de busca
  - Histórico de busca
  - Performance e debounce

- **Cenários principais:**
  - Busca por diferentes tipos de conteúdo
  - Aplicação de filtros
  - Paginação de resultados
  - Tratamento de erros de API
  - Histórico e sugestões

#### 4. **Artistas** (`artists.cy.ts`)

- **Funcionalidades testadas:**
  - Lista de artistas populares
  - Página de detalhes do artista
  - Álbuns do artista
  - Top tracks do artista
  - Artistas relacionados
  - Favoritos de artistas

- **Cenários principais:**
  - Visualização de artistas populares
  - Navegação para detalhes do artista
  - Exibição de discografia
  - Músicas mais populares
  - Recomendações de artistas similares

#### 5. **Álbuns** (`albums.cy.ts`)

- **Funcionalidades testadas:**
  - Lista de álbuns
  - Página de detalhes do álbum
  - Tracks do álbum
  - Filtros e ordenação
  - Integração com busca
  - Favoritos de álbuns

- **Cenários principais:**
  - Visualização de álbuns
  - Detalhes completos do álbum
  - Reprodução de previews
  - Navegação para artista
  - Responsividade em diferentes dispositivos

#### 6. **Configurações** (`settings.cy.ts`)

- **Funcionalidades testadas:**
  - Configuração de idioma
  - Configuração de tema
  - Persistência de configurações
  - Validação de configurações
  - Performance de mudanças

- **Cenários principais:**
  - Mudança de idioma (PT, EN, ES)
  - Alternância entre temas claro/escuro
  - Persistência em localStorage
  - Validação de dados corrompidos
  - Aplicação em todas as páginas

#### 7. **Favoritos** (`favorites.cy.ts`)

- **Funcionalidades testadas:**
  - Adição/remoção de favoritos
  - Página de favoritos
  - Persistência de favoritos
  - Navegação a partir de favoritos
  - Estados de favoritos

- **Cenários principais:**
  - Gerenciamento de favoritos por tipo
  - Visualização de favoritos
  - Navegação para itens favoritados
  - Persistência entre sessões
  - Tratamento de erros de localStorage

## Padrões de Teste

### Estrutura dos Testes

Cada arquivo de teste segue a estrutura:

```typescript
describe('Domain Name', () => {
  beforeEach(() => {
    // Setup comum
  })

  describe('Feature Group', () => {
    it('should perform specific action', () => {
      // Test implementation
    })
  })
})
```

### Convenções de Nomenclatura

- **Arquivos:** `domain.cy.ts` (ex: `auth.cy.ts`, `search.cy.ts`)
- **Testes:** Descrições claras em inglês
- **Data-testid:** Padrão `feature-element` (ex: `search-input`, `artist-card`)

### Mocks e Interceptações

- Uso de `cy.intercept()` para mockar APIs do Spotify
- Dados consistentes entre testes
- Tratamento de diferentes cenários (sucesso, erro, loading)

### Assertions

- Verificação de visibilidade de elementos
- Verificação de conteúdo
- Verificação de navegação (URLs)
- Verificação de estado (classes CSS)
- Verificação de performance (tempos de carregamento)

## Execução dos Testes

### Executar todos os testes

```bash
npm run cypress:run
```

### Executar testes específicos por domínio

```bash
# Apenas testes de autenticação
npx cypress run --spec "cypress/e2e/auth.cy.ts"

# Apenas testes de busca
npx cypress run --spec "cypress/e2e/search.cy.ts"
```

### Executar testes em modo interativo

```bash
npm run cypress:open
```

## Configuração

### Base URL

- Configurada em `cypress.config.ts`
- Padrão: `http://127.0.0.1:5175`

### Viewport

- Desktop: 1280x720
- Mobile: iPhone X
- Tablet: iPad 2

### Timeouts

- Padrão: 10 segundos
- Timeouts específicos para operações lentas

## Dados de Teste

### Mocks do Spotify API

- Dados consistentes e realistas
- Diferentes cenários (sucesso, erro, vazio)
- Estrutura similar à API real do Spotify

### localStorage

- Manipulação direta para testar persistência
- Limpeza entre testes
- Simulação de dados corrompidos

## Boas Práticas

### Organização

- Testes organizados por domínio funcional
- Setup comum em `beforeEach`
- Limpeza de estado entre testes

### Isolamento

- Cada teste é independente
- Não dependência entre testes
- Estado limpo entre execuções

### Performance

- Verificação de tempos de carregamento
- Testes de cache
- Otimização de operações

### Acessibilidade

- Testes de navegação por teclado
- Verificação de elementos focáveis
- Suporte a diferentes viewports

## Manutenção

### Atualização de Testes

- Manter sincronizados com mudanças na aplicação
- Atualizar data-testid quando necessário
- Revisar mocks quando APIs mudam

### Adição de Novos Testes

- Seguir padrões estabelecidos
- Adicionar ao domínio apropriado
- Documentar novos cenários

### Debugging

- Usar `cy.debug()` para pausar execução
- Verificar screenshots em caso de falha
- Revisar logs do Cypress
