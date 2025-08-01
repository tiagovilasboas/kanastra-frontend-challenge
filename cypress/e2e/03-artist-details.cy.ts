/// <reference types="cypress" />

describe('3. Artist Details Page', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.clearCookies()

    // Mock da autenticação
    cy.window().then((win) => {
      win.localStorage.setItem('spotify_token', 'mock_token_123')
    })

    // Mock das requisições da API do Spotify
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

  it('should load artist details page', () => {
    // Visitar página de artista
    cy.visit('http://127.0.0.1:5173/artist/123')

    // Aguardar as requisições
    cy.wait('@artistDetailsRequest')
    cy.wait('@topTracksRequest')
    cy.wait('@albumsRequest')

    // Verificar se a página carregou
    cy.get('[data-testid="artist-page"]').should('exist')
  })

  it('should display artist information', () => {
    // Visitar página de artista
    cy.visit('http://127.0.0.1:5173/artist/123')
    cy.wait('@artistDetailsRequest')

    // Verificar informações do artista
    cy.get('[data-testid="artist-name"]').should('contain', 'Test Artist')
    cy.get('[data-testid="artist-popularity"]').should('exist')
  })

  it('should have back to home button', () => {
    // Visitar página de artista
    cy.visit('http://127.0.0.1:5173/artist/123')
    cy.wait('@artistDetailsRequest')

    // Verificar se o botão voltar está presente
    cy.contains('Voltar ao início').should('be.visible')
  })

  it('should display top tracks section', () => {
    // Visitar página de artista
    cy.visit('http://127.0.0.1:5173/artist/123')
    cy.wait('@artistDetailsRequest')
    cy.wait('@topTracksRequest')

    // Verificar se a seção de top tracks está presente
    cy.contains('Top Tracks').should('be.visible')
    cy.get('[data-testid="track-item"]').should('exist')
  })

  it('should display albums section', () => {
    // Visitar página de artista
    cy.visit('http://127.0.0.1:5173/artist/123')
    cy.wait('@artistDetailsRequest')
    cy.wait('@albumsRequest')

    // Verificar se a seção de álbuns está presente
    cy.contains('Álbuns').should('be.visible')
    cy.get('[data-testid="album-card"]').should('exist')
  })
}) 