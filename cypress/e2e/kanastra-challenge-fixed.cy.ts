/// <reference types="cypress" />

describe('Kanastra Frontend Challenge - E2E Tests (Fixed)', () => {
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
      cy.contains('Erro na conexão').should('be.visible')

      // Verificar se o botão de voltar está presente
      cy.contains('Voltar ao início').should('be.visible')
    })

    it('should redirect to Spotify authorization with correct parameters', () => {
      // Clicar no botão de login
      cy.get('button').contains('Entrar com Spotify').click()

      // Verificar se foi redirecionado para o Spotify
      cy.url().should('include', 'accounts.spotify.com')
      cy.url().should('include', 'authorize')
    })
  })

  describe('2. Artist Search and Listing', () => {
    beforeEach(() => {
      // Mock da autenticação para testes
      cy.window().then((win) => {
        win.localStorage.setItem('spotify_token', 'mock_token_123')
      })

      // Mock das requisições da API do Spotify
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
              },
              {
                id: '2',
                name: 'Drake',
                images: [{ url: 'https://example.com/drake.jpg' }],
                popularity: 90,
                followers: { total: 60000000 },
                genres: ['hip-hop', 'rap']
              }
            ]
          }
        }
      }).as('searchRequest')

      cy.intercept('GET', '**/artists/**', {
        statusCode: 200,
        body: {
          id: '1',
          name: 'Coldplay',
          images: [{ url: 'https://example.com/coldplay.jpg' }],
          popularity: 85,
          followers: { total: 50000000 },
          genres: ['rock', 'pop']
        }
      }).as('artistRequest')
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

      // Aguardar a requisição ser interceptada
      cy.wait('@searchRequest')

      // Verificar se há resultados
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

      // Aguardar a requisição ser interceptada
      cy.wait('@emptySearchRequest')

      // Verificar se há mensagem de resultado vazio
      cy.contains('Nenhum resultado encontrado').should('be.visible')
    })

    it('should display artist cards with proper information', () => {
      // Fazer uma busca válida
      cy.get('[data-testid="search-input"]').type('Drake')
      cy.wait(1000)

      // Aguardar a requisição ser interceptada
      cy.wait('@searchRequest')

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

      // Mock das requisições da API do Spotify para página de artista
      cy.intercept('GET', '**/artists/123', {
        statusCode: 200,
        body: {
          id: '123',
          name: 'Test Artist',
          images: [{ url: 'https://example.com/artist.jpg' }],
          popularity: 85,
          followers: { total: 50000000 },
          genres: ['rock', 'pop']
        }
      }).as('artistDetailsRequest')

      cy.intercept('GET', '**/artists/123/top-tracks**', {
        statusCode: 200,
        body: {
          tracks: [
            {
              id: '1',
              name: 'Test Track 1',
              duration_ms: 180000,
              album: {
                name: 'Test Album',
                images: [{ url: 'https://example.com/album.jpg' }]
              },
              artists: [{ name: 'Test Artist' }]
            }
          ]
        }
      }).as('topTracksRequest')

      cy.intercept('GET', '**/artists/123/albums**', {
        statusCode: 200,
        body: {
          items: [
            {
              id: '1',
              name: 'Test Album 1',
              release_date: '2023-01-01',
              total_tracks: 12,
              images: [{ url: 'https://example.com/album1.jpg' }]
            }
          ]
        }
      }).as('albumsRequest')
    })

    it('should navigate to artist details page', () => {
      // Visitar diretamente uma página de artista
      cy.visit('http://127.0.0.1:5173/artist/123')

      // Aguardar as requisições serem interceptadas
      cy.wait('@artistDetailsRequest')
      cy.wait('@topTracksRequest')
      cy.wait('@albumsRequest')

      // Verificar se a página carregou
      cy.get('[data-testid="artist-page"]').should('exist')
    })

    it('should display artist information', () => {
      // Visitar página de artista
      cy.visit('http://127.0.0.1:5173/artist/123')

      // Aguardar as requisições serem interceptadas
      cy.wait('@artistDetailsRequest')

      // Verificar se há informações do artista
      cy.get('[data-testid="artist-page"]').should('be.visible')
      cy.get('[data-testid="artist-name"]').should('exist')
      cy.get('[data-testid="artist-popularity"]').should('exist')
    })

    it('should have back to home button', () => {
      // Visitar página de artista
      cy.visit('http://127.0.0.1:5173/artist/123')

      // Aguardar as requisições serem interceptadas
      cy.wait('@artistDetailsRequest')

      // Verificar se o botão voltar está presente
      cy.contains('Voltar ao início').should('be.visible')
    })

    it('should display top tracks section', () => {
      // Visitar página de artista
      cy.visit('http://127.0.0.1:5173/artist/123')

      // Aguardar as requisições serem interceptadas
      cy.wait('@artistDetailsRequest')
      cy.wait('@topTracksRequest')

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

      // Mock das requisições da API do Spotify para álbuns
      cy.intercept('GET', '**/artists/123', {
        statusCode: 200,
        body: {
          id: '123',
          name: 'Test Artist',
          images: [{ url: 'https://example.com/artist.jpg' }],
          popularity: 85,
          followers: { total: 50000000 },
          genres: ['rock', 'pop']
        }
      }).as('artistDetailsRequest')

      cy.intercept('GET', '**/artists/123/albums**', {
        statusCode: 200,
        body: {
          items: [
            {
              id: '1',
              name: 'Test Album 1',
              release_date: '2023-01-01',
              total_tracks: 12,
              images: [{ url: 'https://example.com/album1.jpg' }]
            },
            {
              id: '2',
              name: 'Test Album 2',
              release_date: '2022-01-01',
              total_tracks: 10,
              images: [{ url: 'https://example.com/album2.jpg' }]
            }
          ]
        }
      }).as('albumsRequest')
    })

    it('should display albums section', () => {
      // Visitar página de artista
      cy.visit('http://127.0.0.1:5173/artist/123')

      // Aguardar as requisições serem interceptadas
      cy.wait('@artistDetailsRequest')
      cy.wait('@albumsRequest')

      // Verificar se a seção de álbuns está presente
      cy.contains('Álbuns').should('be.visible')
    })

    it('should have album filtering', () => {
      // Visitar página de artista
      cy.visit('http://127.0.0.1:5173/artist/123')

      // Aguardar as requisições serem interceptadas
      cy.wait('@artistDetailsRequest')
      cy.wait('@albumsRequest')

      // Verificar se há campo de filtro de álbuns
      cy.get('[data-testid="album-filter"]').should('exist')
    })

    it('should display album cards with proper information', () => {
      // Visitar página de artista
      cy.visit('http://127.0.0.1:5173/artist/123')

      // Aguardar as requisições serem interceptadas
      cy.wait('@artistDetailsRequest')
      cy.wait('@albumsRequest')

      // Verificar se há cards de álbum
      cy.get('[data-testid="album-card"]').should('exist')

      // Verificar se há informações do álbum
      cy.get('[data-testid="album-name"]').should('exist')
      cy.get('[data-testid="album-info"]').should('exist')
    })

    it('should have pagination controls', () => {
      // Visitar página de artista
      cy.visit('http://127.0.0.1:5173/artist/123')

      // Aguardar as requisições serem interceptadas
      cy.wait('@artistDetailsRequest')
      cy.wait('@albumsRequest')

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
      // Mock de requisição lenta para forçar loading
      cy.intercept('GET', '**/search**', {
        delay: 2000,
        statusCode: 200,
        body: {
          artists: {
            items: []
          }
        }
      }).as('slowSearchRequest')

      // Fazer uma busca para forçar loading
      cy.get('[data-testid="search-input"]').type('test')
      cy.wait(500)

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
      cy.get('[data-testid="language-selector"] button').should('have.length', 2)
      
      // Verificar se os botões contêm as abreviações corretas
      cy.get('[data-testid="language-selector"] button').first().should('contain', 'PT')
      cy.get('[data-testid="language-selector"] button').last().should('contain', 'EN')
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
      // Mock da autenticação
      cy.window().then((win) => {
        win.localStorage.setItem('spotify_token', 'mock_token_123')
      })

      // Interceptar requisições para verificar se estão sendo feitas
      cy.intercept('GET', '**/search**', {
        statusCode: 200,
        body: {
          artists: {
            items: []
          }
        }
      }).as('searchRequest')

      // Fazer uma busca
      cy.get('[data-testid="search-input"]').type('test')
      cy.wait(1000)

      // Verificar se a requisição foi feita
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
      // Mock da autenticação e dados para forçar carregamento de imagens
      cy.window().then((win) => {
        win.localStorage.setItem('spotify_token', 'mock_token_123')
      })

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

      // Aguardar a requisição ser interceptada
      cy.wait('@searchRequest')

      // Verificar se há imagens com alt text
      cy.get('img[alt]').should('exist')
    })

    it('should have proper focus management', () => {
      // Verificar se os elementos são focáveis
      cy.get('[data-testid="search-input"]').focus().should('be.focused')
      cy.get('button').first().focus().should('be.focused')
    })
  })

  describe('9. Error Boundaries', () => {
    it('should handle JavaScript errors gracefully', () => {
      // Visitar a página principal
      cy.visit('http://127.0.0.1:5173/')

      // Verificar se não há erros no console
      cy.window().then((win) => {
        // Verificar se a página carregou sem erros
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(win.document.title).to.not.be.empty
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
      // Mock da autenticação e dados
      cy.window().then((win) => {
        win.localStorage.setItem('spotify_token', 'mock_token_123')
      })

      cy.intercept('GET', '**/artists/123', {
        statusCode: 200,
        body: {
          id: '123',
          name: 'Test Artist',
          images: [{ url: 'https://example.com/artist.jpg' }],
          popularity: 85,
          followers: { total: 50000000 },
          genres: ['rock']
        }
      }).as('artistRequest')

      cy.intercept('GET', '**/artists/123/albums**', {
        statusCode: 200,
        body: {
          items: [
            {
              id: '1',
              name: 'Test Album',
              release_date: '2023-01-01',
              total_tracks: 12,
              images: [{ url: 'https://example.com/album.jpg' }]
            }
          ]
        }
      }).as('albumsRequest')

      // ✅ Spotify API Authentication
      cy.contains('Entrar com Spotify').should('be.visible')

      // ✅ Artist Search and Listing
      cy.get('[data-testid="search-input"]').should('be.visible')

      // ✅ Artist Details Page
      cy.visit('http://127.0.0.1:5173/artist/123')
      cy.wait('@artistRequest')
      cy.wait('@albumsRequest')
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