/// <reference types="cypress" />

describe('1. Spotify Authentication', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.clearCookies()
    cy.visit('http://127.0.0.1:5173/')
  })

  it('should display login button on home page', () => {
    // Verificar se a página inicial carrega
    cy.get('[data-testid="home-page"]').should('exist')
    
    // Verificar se o botão de login está visível
    cy.contains('Entrar com Spotify').should('be.visible')
    
    // Verificar se o botão tem o ícone
    cy.get('button').contains('Entrar com Spotify').should('be.visible')
  })

  it('should handle authentication errors gracefully', () => {
    // Visitar diretamente a página de callback sem autenticação
    cy.visit('http://127.0.0.1:5173/callback?code=invalid_code')

    // Verificar se a mensagem de erro é exibida
    cy.contains('Erro na conexão').should('be.visible')

    // Verificar se o botão de voltar está presente
    cy.contains('Voltar ao início').should('be.visible')
  })

  it('should redirect to Spotify authorization when clicking login', () => {
    // Clicar no botão de login
    cy.get('button').contains('Entrar com Spotify').click()

    // Verificar se foi redirecionado para o Spotify
    cy.url().should('include', 'accounts.spotify.com')
  })
}) 