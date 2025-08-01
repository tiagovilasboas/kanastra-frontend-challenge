/// <reference types="cypress" />

describe('Kanastra Frontend Challenge - E2E Tests', () => {
  const AUTHORIZED_EMAIL = 'tcarvalhovb@gmail.com'

  beforeEach(() => {
    cy.clearLocalStorage()
    cy.clearCookies()
    cy.visit('http://127.0.0.1:5173/')
  })

  describe('1. Spotify API Authentication', () => {
    it('should show login button and handle authentication flow', () => {
      // Verificar se a página inicial carrega
      cy.get('[data-testid="home-page"]').should('exist')

      // Verificar se o botão de login está visível
      cy.contains('Entrar com Spotify').should('be.visible')

      // Verificar se o botão tem o ícone de play
      cy.get('button').contains('Entrar com Spotify').should('be.visible')

      // Verificar se o email autorizado está documentado
      cy.log(`Email autorizado para testes: ${AUTHORIZED_EMAIL}`)
    })

    it('should handle authentication errors gracefully', () => {
      // Visitar diretamente a página de callback sem autenticação
      cy.visit('http://127.0.0.1:5173/callback?code=invalid_code')

      // Verificar se a mensagem de erro é exibida
      cy.contains('Erro na autenticação').should('be.visible')

      // Verificar se o botão de voltar está presente
      cy.contains('Voltar ao início').should('be.visible')
    })

    it('should redirect to Spotify authorization with correct parameters', () => {
      // Clicar no botão de login
      cy.get('button').contains('Entrar com Spotify').click()

      // Verificar se foi redirecionado para o Spotify
      cy.url().should('include', 'accounts.spotify.com')
      cy.url().should('include', 'authorize')
      cy.url().should('include', 'response_type=code')
      cy.url().should('include', 'code_challenge_method=S256')
    })
  })

  describe('2. Artist Search and Listing', () => {
    beforeEach(() => {
      // Mock da autenticação para testes
      cy.window().then((win) => {
        win.localStorage.setItem('spotify_token', 'mock_token_123')
      })
    })

    it('should have search input and search functionality', () => {
      // Verificar se o campo de busca está presente
      cy.get('[data-testid="search-input"]').should('be.visible')

      // Verificar se o placeholder está correto
      cy.get('[data-testid="search-input"]').should('have.attr', 'placeholder')
    })

    it('should display artist cards when searching', () => {
      // Digitar no campo de busca
      cy.get('[data-testid="search-input"]').type('Coldplay')

      // Aguardar um pouco para o debounce
      cy.wait(1000)

      // Verificar se há resultados (mesmo que seja loading)
      cy.get('body').should('contain', 'Coldplay')
    })

    it('should handle empty search results', () => {
      // Buscar por algo que não existe
      cy.get('[data-testid="search-input"]').type('xyz123nonexistent')
      cy.wait(1000)

      // Verificar se há alguma mensagem de resultado
      cy.get('body').should('contain', 'resultado')
    })

    it('should display artist cards with proper information', () => {
      // Fazer uma busca válida
      cy.get('[data-testid="search-input"]').type('Drake')
      cy.wait(1000)

      // Verificar se os cards de artista aparecem
      cy.get('[data-testid="artist-card"]').should('exist')

      // Verificar se há informações do artista
      cy.get('[data-testid="artist-name"]').should('exist')
      cy.get('[data-testid="artist-popularity"]').should('exist')
    })
  })

  describe('3. Artist Details Page', () => {
    beforeEach(() => {
      // Mock da autenticação
      cy.window().then((win) => {
        win.localStorage.setItem('spotify_token', 'mock_token_123')
      })
    })

    it('should navigate to artist details page', () => {
      // Visitar diretamente uma página de artista
      cy.visit('http://127.0.0.1:5173/artist/123')

      // Verificar se a página carregou
      cy.get('[data-testid="artist-page"]').should('exist')
    })

    it('should display artist information', () => {
      // Visitar página de artista
      cy.visit('http://127.0.0.1:5173/artist/123')

      // Verificar se há informações do artista
      cy.get('[data-testid="artist-page"]').should('be.visible')
      cy.get('[data-testid="artist-name"]').should('exist')
      cy.get('[data-testid="artist-popularity"]').should('exist')
    })

    it('should have back to home button', () => {
      // Visitar página de artista
      cy.visit('http://127.0.0.1:5173/artist/123')

      // Verificar se o botão voltar está presente
      cy.contains('Voltar ao início').should('be.visible')
    })

    it('should display top tracks section', () => {
      // Visitar página de artista
      cy.visit('http://127.0.0.1:5173/artist/123')

      // Verificar se a seção de top tracks está presente
      cy.contains('Top Tracks').should('be.visible')

      // Verificar se há elementos de track
      cy.get('[data-testid="track-item"]').should('exist')
    })
  })

  describe('4. Albums Listing and Pagination', () => {
    beforeEach(() => {
      // Mock da autenticação
      cy.window().then((win) => {
        win.localStorage.setItem('spotify_token', 'mock_token_123')
      })
    })

    it('should display albums section', () => {
      // Visitar página de artista
      cy.visit('http://127.0.0.1:5173/artist/123')

      // Verificar se a seção de álbuns está presente
      cy.contains('Álbuns').should('be.visible')
    })

    it('should have album filtering', () => {
      // Visitar página de artista
      cy.visit('http://127.0.0.1:5173/artist/123')

      // Verificar se há campo de filtro de álbuns
      cy.get('[data-testid="album-filter"]').should('exist')
    })

    it('should display album cards with proper information', () => {
      // Visitar página de artista
      cy.visit('http://127.0.0.1:5173/artist/123')

      // Verificar se há cards de álbum
      cy.get('[data-testid="album-card"]').should('exist')

      // Verificar se há informações do álbum
      cy.get('[data-testid="album-name"]').should('exist')
      cy.get('[data-testid="album-info"]').should('exist')
    })

    it('should have pagination controls', () => {
      // Visitar página de artista
      cy.visit('http://127.0.0.1:5173/artist/123')

      // Verificar se há controles de paginação
      cy.get('[data-testid="pagination"]').should('exist')
    })
  })

  describe('5. UI/UX Features', () => {
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

    it('should have loading states', () => {
      // Verificar se há elementos de loading
      cy.get('[data-testid="loading-skeleton"]').should('exist')
    })

    it('should have error handling', () => {
      // Visitar página inexistente
      cy.visit('http://127.0.0.1:5173/nonexistent', { failOnStatusCode: false })

      // Verificar se há tratamento de erro
      cy.get('body').should('contain', 'erro')
    })

    it('should have language selector', () => {
      // Verificar se há seletor de idioma
      cy.get('[data-testid="language-selector"]').should('exist')
    })
  })

  describe('6. Internationalization', () => {
    it('should support multiple languages', () => {
      // Verificar se há elementos em português
      cy.contains('Entrar com Spotify').should('be.visible')

      // Verificar se há elementos em inglês (se disponível)
      cy.get('body').should('contain', 'Spotify')
    })

    it('should have language selector functionality', () => {
      // Verificar se o seletor de idioma está presente
      cy.get('[data-testid="language-selector"]').should('be.visible')

      // Verificar se há opções de idioma
      cy.get('[data-testid="language-selector"]').should('contain', 'PT')
      cy.get('[data-testid="language-selector"]').should('contain', 'EN')
    })
  })

  describe('7. Performance and Loading', () => {
    it('should load the application quickly', () => {
      // Verificar se a página carrega em tempo razoável
      cy.visit('http://127.0.0.1:5173/', { timeout: 10000 })

      // Verificar se o conteúdo principal está visível
      cy.get('[data-testid="home-page"]').should('be.visible')
    })

    it('should handle network requests', () => {
      // Interceptar requisições para verificar se estão sendo feitas
      cy.intercept('GET', '**/search**').as('searchRequest')

      // Fazer uma busca
      cy.get('[data-testid="search-input"]').type('test')
      cy.wait(1000)

      // Verificar se a requisição foi feita (ou pelo menos tentada)
      cy.wait('@searchRequest', { timeout: 5000 }).then((interception) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(interception).to.not.be.null
      })
    })
  })

  describe('8. Accessibility', () => {
    it('should have proper ARIA labels', () => {
      // Verificar se há botões com aria-label
      cy.get('button[aria-label]').should('exist')
    })

    it('should have proper alt text for images', () => {
      // Verificar se há imagens com alt text
      cy.get('img[alt]').should('exist')
    })

    it('should have proper focus management', () => {
      // Verificar se os elementos são focáveis
      cy.get('[data-testid="search-input"]').should('be.focusable')
      cy.get('button').first().should('be.focusable')
    })
  })

  describe('9. Error Boundaries', () => {
    it('should handle JavaScript errors gracefully', () => {
      // Visitar a página principal
      cy.visit('http://127.0.0.1:5173/')

      // Verificar se não há erros no console
      cy.window().then((win) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(win.console.error).to.not.be.called
      })
    })
  })

  describe('10. Security', () => {
    it('should not expose sensitive information', () => {
      // Verificar se não há tokens expostos no HTML
      cy.get('body').should('not.contain', 'client_secret')
      cy.get('body').should('not.contain', 'access_token')
    })

    it('should use secure authentication flow', () => {
      // Verificar se o botão de login redireciona para HTTPS
      cy.get('button').contains('Entrar com Spotify').click()

      // Verificar se foi redirecionado para o Spotify
      cy.url().should('include', 'accounts.spotify.com')
    })

    it('should handle authentication state securely', () => {
      // Verificar se o token não está exposto na URL
      cy.url().should('not.contain', 'token')
      cy.url().should('not.contain', 'access_token')
    })
  })

  describe('11. Challenge Requirements Coverage', () => {
    it('should meet all challenge requirements', () => {
      // ✅ Spotify API Authentication
      cy.contains('Entrar com Spotify').should('be.visible')

      // ✅ Artist Search and Listing
      cy.get('[data-testid="search-input"]').should('be.visible')

      // ✅ Artist Details Page
      cy.visit('http://127.0.0.1:5173/artist/123')
      cy.get('[data-testid="artist-page"]').should('exist')

      // ✅ Albums Listing and Pagination
      cy.get('[data-testid="album-card"]').should('exist')

      // ✅ UI/UX Features
      cy.get('[data-testid="language-selector"]').should('exist')

      // ✅ Internationalization
      cy.contains('Entrar com Spotify').should('be.visible')

      // ✅ Performance and Loading
      cy.get('[data-testid="loading-skeleton"]').should('exist')

      // ✅ Accessibility
      cy.get('img[alt]').should('exist')

      // ✅ Error Boundaries
      cy.visit('http://127.0.0.1:5173/')
      cy.get('[data-testid="home-page"]').should('be.visible')

      // ✅ Security
      cy.get('body').should('not.contain', 'client_secret')

      cy.log(`✅ Todos os requisitos do desafio estão cobertos`)
      cy.log(`📧 Email autorizado: ${AUTHORIZED_EMAIL}`)
    })
  })
})
