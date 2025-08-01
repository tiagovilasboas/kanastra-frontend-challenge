/// <reference types="cypress" />

describe('2. Artist Search Functionality', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.clearCookies()
    cy.visit('http://127.0.0.1:5173/')

    // Mock da autenticação para testes
    cy.window().then((win) => {
      win.localStorage.setItem('spotify_token', 'mock_token_123')
    })
  })

  it('should have search input visible', () => {
    // Verificar se o campo de busca está presente
    cy.get('[data-testid="search-input"]').should('be.visible')
    
    // Verificar se o placeholder está correto
    cy.get('[data-testid="search-input"]').should('have.attr', 'placeholder')
  })

  it('should display search results when searching for artists', () => {
    // Mock da resposta da API
    cy.intercept('GET', '**/search**', {
      statusCode: 200,
      body: {
        artists: {
          items: [
            {
              id: '1',
              name: 'Coldplay',
              images: [{ url: 'https://example.com/coldplay.jpg' }],
              popularity: 85,
              followers: { total: 50000000 },
              genres: ['rock', 'pop']
            }
          ]
        }
      }
    }).as('searchRequest')

    // Digitar no campo de busca
    cy.get('[data-testid="search-input"]').type('Coldplay')
    
    // Aguardar o debounce e a requisição
    cy.wait(1000)
    cy.wait('@searchRequest')

    // Verificar se os resultados aparecem
    cy.get('[data-testid="artist-card"]').should('exist')
    cy.get('[data-testid="artist-name"]').should('contain', 'Coldplay')
  })

  it('should handle empty search results', () => {
    // Mock para busca vazia
    cy.intercept('GET', '**/search**', {
      statusCode: 200,
      body: {
        artists: {
          items: []
        }
      }
    }).as('emptySearchRequest')

    // Buscar por algo que não existe
    cy.get('[data-testid="search-input"]').type('xyz123nonexistent')
    cy.wait(1000)
    cy.wait('@emptySearchRequest')

    // Verificar se há mensagem de resultado vazio
    cy.contains('Nenhum resultado encontrado').should('be.visible')
  })

  it('should show loading state during search', () => {
    // Mock de requisição lenta
    cy.intercept('GET', '**/search**', {
      delay: 2000,
      statusCode: 200,
      body: {
        artists: {
          items: []
        }
      }
    }).as('slowSearchRequest')

    // Fazer uma busca
    cy.get('[data-testid="search-input"]').type('test')
    cy.wait(500)

    // Verificar se há elementos de loading
    cy.get('[data-testid="loading-skeleton"]').should('exist')
  })
}) 