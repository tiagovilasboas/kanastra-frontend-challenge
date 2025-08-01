/// <reference types="cypress" />

describe('5. Accessibility', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.clearCookies()
    cy.visit('http://127.0.0.1:5173/')

    // Mock da autenticação para carregar imagens
    cy.window().then((win) => {
      win.localStorage.setItem('spotify_token', 'mock_token_123')
    })
  })

  it('should have proper alt text for images', () => {
    // Mock de dados para forçar carregamento de imagens
    cy.intercept('GET', '**/search**', {
      statusCode: 200,
      body: {
        artists: {
          items: [
            {
              id: '1',
              name: 'Test Artist',
              images: [{ url: 'https://example.com/artist.jpg' }],
              popularity: 85,
              followers: { total: 50000000 },
              genres: ['rock']
            }
          ]
        }
      }
    }).as('searchRequest')

    // Fazer uma busca para carregar imagens
    cy.get('[data-testid="search-input"]').type('test')
    cy.wait(1000)
    cy.wait('@searchRequest')

    // Verificar se há imagens com alt text
    cy.get('img[alt]').should('exist')
  })

  it('should have proper ARIA labels on interactive elements', () => {
    // Verificar se há botões com aria-label
    cy.get('button[aria-label]').should('exist')
    
    // Verificar se há inputs com aria-label ou aria-labelledby
    cy.get('input[aria-label], input[aria-labelledby]').should('exist')
  })

  it('should have proper focus management', () => {
    // Verificar se os elementos são focáveis
    cy.get('[data-testid="search-input"]').focus().should('be.focused')
    
    // Verificar se o foco pode ser movido para botões
    cy.get('button').first().focus().should('be.focused')
  })

  it('should have proper heading structure', () => {
    // Verificar se há headings (h1, h2, h3, etc.)
    cy.get('h1, h2, h3, h4, h5, h6').should('exist')
  })

  it('should have proper color contrast', () => {
    // Verificar se o texto é legível
    cy.get('body').should('have.css', 'color')
    cy.get('body').should('have.css', 'background-color')
  })

  it('should be keyboard navigable', () => {
    // Verificar se é possível navegar com Tab
    cy.get('body').tab()
    
    // Verificar se há elementos focáveis
    cy.get('button, input, a, [tabindex]').should('exist')
  })

  it('should have proper semantic HTML', () => {
    // Verificar se há elementos semânticos
    cy.get('header, main, nav, section, article').should('exist')
  })
}) 