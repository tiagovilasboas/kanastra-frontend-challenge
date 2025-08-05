# Testes E2E - Spotify Explorer

Esta documentação descreve a estrutura e uso dos testes end-to-end organizados por domínio para a aplicação Spotify Explorer.

## 📋 Visão Geral

Os testes E2E foram organizados em **7 domínios principais**, cada um cobrindo funcionalidades específicas da aplicação:

1. **Autenticação** - Fluxo OAuth do Spotify
2. **Navegação** - Rotas e navegação entre páginas
3. **Busca** - Funcionalidade de busca de artistas, álbuns, etc.
4. **Artistas** - Visualização e interação com artistas
5. **Álbuns** - Visualização de álbuns
6. **Configurações** - Idioma, tema, etc.
7. **Favoritos** - Gerenciamento de favoritos

## 🚀 Instalação e Configuração

### Pré-requisitos

- Node.js 20.18.0+
- npm ou yarn
- Aplicação rodando em `http://127.0.0.1:5173`

### Instalação do Cypress

```bash
npm install
```

### Configuração

O Cypress já está configurado com:

- Base URL: `http://127.0.0.1:5173`
- Viewport padrão: 1280x720
- Timeouts: 10 segundos
- Retries: 2 tentativas em modo run

## 🎯 Execução dos Testes

### Comandos Disponíveis

#### Executar todos os testes

```bash
npm run test:e2e
# ou
npm run cypress:run
```

#### Executar testes por domínio

```bash
# Autenticação
npm run test:e2e:auth

# Navegação
npm run test:e2e:navigation

# Busca
npm run test:e2e:search

# Artistas
npm run test:e2e:artists

# Álbuns
npm run test:e2e:albums

# Configurações
npm run test:e2e:settings

# Favoritos
npm run test:e2e:favorites
```

#### Executar testes específicos via script

```bash
# Usando o script customizado
node scripts/run-e2e-tests.js auth
node scripts/run-e2e-tests.js search
node scripts/run-e2e-tests.js all

# Ver ajuda
node scripts/run-e2e-tests.js help
```

#### Modo interativo

```bash
npm run cypress:open
```

#### Matar processos em portas

```bash
# Matar processo na porta 5173 (desenvolvimento)
npm run kill-port:dev

# Matar processo em porta específica
npm run kill-port 3000

# Matar processos em portas comuns
npm run kill-port:all

# Usar diretamente
node scripts/kill-port.js 5173
node scripts/kill-port.js all
```

## 📁 Estrutura dos Arquivos

```
cypress/
├── e2e/                    # Testes organizados por domínio
│   ├── auth.cy.ts         # Testes de autenticação
│   ├── navigation.cy.ts   # Testes de navegação
│   ├── search.cy.ts       # Testes de busca
│   ├── artists.cy.ts      # Testes de artistas
│   ├── albums.cy.ts       # Testes de álbuns
│   ├── settings.cy.ts     # Testes de configurações
│   ├── favorites.cy.ts    # Testes de favoritos
│   └── README.md          # Documentação dos testes
├── fixtures/              # Dados de teste
│   └── spotify-api.json   # Mocks da API do Spotify
├── support/               # Configuração e comandos customizados
│   ├── commands.ts        # Comandos customizados
│   └── e2e.ts            # Configuração global
├── types/                 # Definições de tipos
│   └── cypress.d.ts      # Tipos customizados
├── plugins/               # Plugins do Cypress
│   └── index.ts          # Configuração de plugins
└── .gitignore            # Arquivos ignorados pelo Git
```

## 🛠️ Comandos Customizados

### Comandos de Mock

```typescript
// Mock API do Spotify
cy.mockSpotifyAPI('artists/123', { id: '123', name: 'Artist' })

// Mock busca do Spotify
cy.mockSpotifySearch('test', 'artist', { artists: { items: [] } })

// Mock autenticação
cy.mockSpotifyAuth(true)

// Mock erro de rede
cy.mockNetworkError('artists/123')

// Mock resposta lenta
cy.mockSlowResponse('artists/123', { id: '123' }, 3000)

// Mock resposta vazia
cy.mockEmptyResponse('search')
```

### Comandos de localStorage

```typescript
// Definir dados no localStorage
cy.setLocalStorage('favorites', { artists: [] })

// Obter dados do localStorage
cy.getLocalStorage('favorites')

// Limpar localStorage
cy.clearLocalStorage()
```

### Comandos de UI

```typescript
// Aguardar loading
cy.waitForLoading()

// Aguardar erro
cy.waitForError()

// Verificar classe
cy.get('[data-testid="button"]').hasClass('active')

// Navegar para página
cy.visitPage('/artists')

// Clicar e aguardar navegação
cy.clickAndWait('[data-testid="nav-artists"]', '/artists')

// Digitar com debounce
cy.typeWithDebounce('[data-testid="search-input"]', 'test')

// Verificar texto
cy.get('[data-testid="title"]').containsText('Welcome')
```

### Comandos de Performance

```typescript
// Verificar performance
cy.checkPerformance(5000)

// Definir viewport
cy.setViewport(1920, 1080)
```

## 📊 Dados de Teste

### Fixtures

Os dados de teste estão organizados em `cypress/fixtures/spotify-api.json`:

- **artists**: Dados de artistas (populares, detalhes, relacionados)
- **albums**: Dados de álbuns (lista, detalhes, tracks)
- **tracks**: Dados de músicas (lista, top tracks)
- **search**: Resultados de busca (artistas, álbuns, tracks, vazio)
- **auth**: Dados de autenticação (sucesso, erro)
- **errors**: Diferentes tipos de erro (404, 500, 429)

### Uso dos Fixtures

```typescript
// Carregar dados de fixture
cy.fixture('spotify-api').then((data) => {
  cy.mockSpotifyAPI('artists/123', data.artists.detail)
})
```

## 🎨 Padrões de Teste

### Estrutura dos Testes

```typescript
describe('Domain Name', () => {
  beforeEach(() => {
    // Setup comum
    cy.visit('/')
    cy.clearLocalStorage()
  })

  describe('Feature Group', () => {
    it('should perform specific action', () => {
      // Arrange
      cy.mockSpotifyAPI('endpoint', response)

      // Act
      cy.get('[data-testid="button"]').click()

      // Assert
      cy.get('[data-testid="result"]').should('be.visible')
    })
  })
})
```

### Convenções de Nomenclatura

- **Arquivos**: `domain.cy.ts` (ex: `auth.cy.ts`)
- **Testes**: Descrições claras em inglês
- **Data-testid**: `feature-element` (ex: `search-input`, `artist-card`)

### Assertions Comuns

```typescript
// Verificar visibilidade
cy.get('[data-testid="element"]').should('be.visible')

// Verificar conteúdo
cy.get('[data-testid="element"]').should('contain', 'text')

// Verificar navegação
cy.url().should('include', '/path')

// Verificar estado
cy.get('[data-testid="button"]').should('have.class', 'active')

// Verificar performance
cy.checkPerformance(3000)
```

## 🔧 Configuração Avançada

### Variáveis de Ambiente

```json
// cypress.env.json
{
  "spotifyApiUrl": "https://api.spotify.com/v1",
  "spotifyAuthUrl": "https://accounts.spotify.com",
  "testTimeout": 10000,
  "retryAttempts": 2
}
```

### Configuração de Plugins

Os plugins estão configurados em `cypress/plugins/index.ts`:

- Configuração de timeouts
- Configuração de retries
- Tasks customizadas
- Tratamento de exceções

### Configuração de Suporte

O arquivo `cypress/support/e2e.ts` contém:

- Configuração global
- Limpeza de localStorage
- Tratamento de erros
- Configuração de timeouts

## 🐛 Debugging

### Logs e Screenshots

- Screenshots automáticos em caso de falha
- Logs detalhados no console
- Vídeos desabilitados por padrão

### Comandos de Debug

```typescript
// Pausar execução
cy.debug()

// Log de informações
cy.log('Debug information')

// Verificar estado do localStorage
cy.getLocalStorage('favorites').then(console.log)
```

### Tratamento de Erros

```typescript
// Capturar exceções não tratadas
Cypress.on('uncaught:exception', (err, runnable) => {
  // Retornar false para não falhar o teste
  return false
})
```

## 📈 Performance e Otimização

### Timeouts

- **defaultCommandTimeout**: 10 segundos
- **requestTimeout**: 10 segundos
- **responseTimeout**: 10 segundos

### Retries

- **runMode**: 2 tentativas
- **openMode**: 0 tentativas

### Viewports

- **Desktop**: 1280x720 (padrão)
- **Mobile**: iPhone X
- **Tablet**: iPad 2

## 🔄 CI/CD

### Integração com Pipeline

```yaml
# Exemplo para GitHub Actions
- name: Run E2E Tests
  run: |
    npm run build
    npm run test:e2e
```

### Execução Paralela

```bash
# Executar testes em paralelo por domínio
npm run test:e2e:auth &
npm run test:e2e:search &
npm run test:e2e:artists &
wait
```

## 📝 Manutenção

### Atualização de Testes

1. Manter sincronizados com mudanças na aplicação
2. Atualizar `data-testid` quando necessário
3. Revisar mocks quando APIs mudam
4. Atualizar fixtures quando estrutura de dados muda

### Adição de Novos Testes

1. Seguir padrões estabelecidos
2. Adicionar ao domínio apropriado
3. Documentar novos cenários
4. Usar comandos customizados quando possível

### Boas Práticas

- Testes independentes e isolados
- Setup e limpeza adequados
- Uso consistente de mocks
- Assertions específicas e claras
- Documentação de cenários complexos

## 🆘 Suporte

### Problemas Comuns

1. **Timeout**: Aumentar timeouts ou verificar performance
2. **Elemento não encontrado**: Verificar `data-testid` e timing
3. **Mock não funcionando**: Verificar URL e estrutura de resposta
4. **Estado inconsistente**: Verificar limpeza de localStorage

### Recursos Adicionais

- [Documentação oficial do Cypress](https://docs.cypress.io/)
- [Guia de boas práticas](https://docs.cypress.io/guides/references/best-practices)
- [Comandos customizados](https://docs.cypress.io/api/cypress-api/custom-commands)
