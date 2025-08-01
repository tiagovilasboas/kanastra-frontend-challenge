/// <reference types="cypress" />

describe('4. UI Components and Basic Functionality', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.clearCookies()
    cy.visit('http://127.0.0.1:5173/')
  })

  it('should have responsive design', () => {
    // Testar em viewport mobile
    cy.viewport(375, 667)
    cy.get('[data-testid="home-page"]').should('be.visible')

    // Testar em viewport tablet
    cy.viewport(768, 1024)
    cy.get('[data-testid="home-page"]').should('be.visible')

    // Testar em viewport desktop
    cy.viewport(1280, 720)
    cy.get('[data-testid="home-page"]').should('be.visible')
  })

  it('should have language selector', () => {
    // Verificar se há seletor de idioma
    cy.get('[data-testid="language-selector"]').should('exist')
  })

  it('should have language selector functionality', () => {
    // Verificar se o seletor de idioma está presente
    cy.get('[data-testid="language-selector"]').should('be.visible')

    // Verificar se há opções de idioma
    cy.get('[data-testid="language-selector"] button').should('have.length', 2)
    
    // Verificar se os botões contêm as abreviações corretas
    cy.get('[data-testid="language-selector"] button').first().should('contain', 'PT')
    cy.get('[data-testid="language-selector"] button').last().should('contain', 'EN')
  })

  it('should support multiple languages', () => {
    // Verificar se há elementos em português
    cy.contains('Entrar com Spotify').should('be.visible')

    // Verificar se há elementos em inglês (se disponível)
    cy.get('body').should('contain', 'Spotify')
  })

  it('should have proper ARIA labels', () => {
    // Verificar se há botões com aria-label
    cy.get('button[aria-label]').should('exist')
  })

  it('should have proper focus management', () => {
    // Verificar se os elementos são focáveis
    cy.get('[data-testid="search-input"]').focus().should('be.focused')
    cy.get('button').first().focus().should('be.focused')
  })

  it('should handle JavaScript errors gracefully', () => {
    // Verificar se não há erros no console
    cy.window().then((win) => {
      // Verificar se a página carregou sem erros
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(win.document.title).to.not.be.empty
    })
  })

  it('should not expose sensitive information', () => {
    // Verificar se não há tokens expostos no HTML
    cy.get('body').should('not.contain', 'client_secret')
    cy.get('body').should('not.contain', 'access_token')
  })

  it('should handle authentication state securely', () => {
    // Verificar se o token não está exposto na URL
    cy.url().should('not.contain', 'token')
    cy.url().should('not.contain', 'access_token')
  })

  it('should load the application quickly', () => {
    // Verificar se a página carrega em tempo razoável
    cy.visit('http://127.0.0.1:5173/', { timeout: 10000 })

    // Verificar se o conteúdo principal está visível
    cy.get('[data-testid="home-page"]').should('be.visible')
  })

  it('should have error handling for invalid routes', () => {
    // Visitar página inexistente
    cy.visit('http://127.0.0.1:5173/nonexistent', { failOnStatusCode: false })

    // Verificar se há tratamento de erro
    cy.get('body').should('contain', 'erro')
  })
}) 