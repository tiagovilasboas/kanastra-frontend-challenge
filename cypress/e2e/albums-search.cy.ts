describe('Álbuns Search E2E - Novas Regras de Negócio', () => {
  beforeEach(() => {
    // Interceptar a chamada de autenticação
    cy.intercept('POST', 'https://accounts.spotify.com/api/token', {
      statusCode: 200,
      body: {
        access_token: 'fake-access-token',
        token_type: 'Bearer',
        expires_in: 3600,
      },
    }).as('authToken')

    // Interceptar a busca específica de álbuns (método desacoplado)
    cy.intercept('GET', 'https://api.spotify.com/v1/search?*type=album*', {
      statusCode: 200,
      body: {
        albums: {
          href: 'https://api.spotify.com/v1/search?query=test&type=album&offset=0&limit=10',
          items: Array.from({ length: 10 }, (_, i) => ({
            id: `album-${i + 1}`,
            name: `Album ${i + 1}`,
            type: 'album',
            uri: `spotify:album:album-${i + 1}`,
            href: `https://api.spotify.com/v1/albums/album-${i + 1}`,
            external_urls: {
              spotify: `https://open.spotify.com/album/album-${i + 1}`,
            },
            images: [
              {
                url: 'https://via.placeholder.com/300',
                height: 300,
                width: 300,
              },
            ],
            artists: [
              {
                id: `artist-${i + 1}`,
                name: `Artist ${i + 1}`,
                type: 'artist',
                uri: `spotify:artist:artist-${i + 1}`,
                href: `https://api.spotify.com/v1/artists/artist-${i + 1}`,
                external_urls: {
                  spotify: `https://open.spotify.com/artist/artist-${i + 1}`,
                },
              },
            ],
            album_type: 'album',
            total_tracks: 12,
            release_date: '2023-01-01',
            release_date_precision: 'day',
            available_markets: ['US', 'BR'],
            restrictions: {},
            popularity: 80,
          })),
          limit: 10,
          next: null,
          offset: 0,
          previous: null,
          total: 10,
        },
      },
    }).as('albumsSpecificSearch')

    // Interceptar a busca "tudo" (método múltiplo)
    cy.intercept(
      'GET',
      'https://api.spotify.com/v1/search?*type=album,track,artist,playlist,show,episode,audiobook*',
      {
        statusCode: 200,
        body: {
          albums: {
            items: Array.from({ length: 5 }, (_, i) => ({
              id: `album-all-${i + 1}`,
              name: `Album All ${i + 1}`,
              type: 'album',
              artists: [{ name: `Artist All ${i + 1}` }],
              images: [{ url: 'https://via.placeholder.com/300' }],
              album_type: 'album',
              total_tracks: 12,
              release_date: '2023-01-01',
              popularity: 80,
            })),
            total: 5,
          },
          tracks: {
            items: Array.from({ length: 5 }, (_, i) => ({
              id: `track-all-${i + 1}`,
              name: `Track All ${i + 1}`,
              type: 'track',
              artists: [{ name: `Artist All ${i + 1}` }],
              album: {
                name: `Album All ${i + 1}`,
                images: [{ url: 'https://via.placeholder.com/300' }],
              },
              duration_ms: 180000,
            })),
            total: 5,
          },
          artists: {
            items: Array.from({ length: 5 }, (_, i) => ({
              id: `artist-all-${i + 1}`,
              name: `Artist All ${i + 1}`,
              type: 'artist',
              images: [{ url: 'https://via.placeholder.com/300' }],
              followers: { total: 1000 },
              genres: ['rock'],
            })),
            total: 5,
          },
          playlists: {
            items: Array.from({ length: 5 }, (_, i) => ({
              id: `playlist-all-${i + 1}`,
              name: `Playlist All ${i + 1}`,
              type: 'playlist',
              images: [{ url: 'https://via.placeholder.com/300' }],
              owner: { display_name: `Owner All ${i + 1}` },
              tracks: { total: 20 },
            })),
            total: 5,
          },
          shows: {
            items: Array.from({ length: 5 }, (_, i) => ({
              id: `show-all-${i + 1}`,
              name: `Show All ${i + 1}`,
              type: 'show',
              images: [{ url: 'https://via.placeholder.com/300' }],
              publisher: `Publisher All ${i + 1}`,
            })),
            total: 5,
          },
          episodes: {
            items: Array.from({ length: 5 }, (_, i) => ({
              id: `episode-all-${i + 1}`,
              name: `Episode All ${i + 1}`,
              type: 'episode',
              images: [{ url: 'https://via.placeholder.com/300' }],
              show: { name: `Show All ${i + 1}` },
              duration_ms: 1800000,
            })),
            total: 5,
          },
          audiobooks: {
            items: Array.from({ length: 5 }, (_, i) => ({
              id: `audiobook-all-${i + 1}`,
              name: `Audiobook All ${i + 1}`,
              type: 'audiobook',
              images: [{ url: 'https://via.placeholder.com/300' }],
              authors: [{ name: `Author All ${i + 1}` }],
              narrators: [{ name: `Narrator All ${i + 1}` }],
            })),
            total: 5,
          },
        },
      },
    ).as('allTypesSearch')

    cy.visit('/search')
  })

  it('should show 10 albums when searching for albums specifically (método desacoplado)', () => {
    // Aguardar a página carregar
    cy.wait('@authToken')

    // Digitar uma busca
    cy.get('[data-testid="search-input"]').type('test')

    // Selecionar apenas "álbuns" no seletor de tipo
    cy.get('[data-testid="search-type-selector"]').click()
    cy.get('[data-testid="search-type-album"]').click()

    // Aguardar a busca específica ser executada
    cy.wait('@albumsSpecificSearch')

    // Verificar se aparecem exatamente 10 álbuns (limite específico para álbuns)
    cy.get('[data-testid="albums-section"]').should('be.visible')
    cy.get('[data-testid="album-card"]').should('have.length', 10)

    // Verificar se os álbuns são os específicos (não os do "tudo")
    cy.get('[data-testid="album-card"]').first().should('contain', 'Album 1')
    cy.get('[data-testid="album-card"]').last().should('contain', 'Album 10')
  })

  it('should show correct number of skeleton cards while loading (consistente com limite)', () => {
    // Aguardar a página carregar
    cy.wait('@authToken')

    // Digitar uma busca
    cy.get('[data-testid="search-input"]').type('test')

    // Selecionar apenas "álbuns" no seletor de tipo
    cy.get('[data-testid="search-type-selector"]').click()
    cy.get('[data-testid="search-type-album"]').click()

    // Verificar se aparecem 10 skeleton cards (consistente com o limite de álbuns)
    cy.get('[data-testid="album-skeleton"]').should('have.length', 10)

    // Aguardar a busca específica ser executada
    cy.wait('@albumsSpecificSearch')

    // Verificar se os skeletons foram substituídos por 10 cards reais
    cy.get('[data-testid="album-card"]').should('have.length', 10)
  })

  it('should use the correct API endpoint for albums search (método específico)', () => {
    // Aguardar a página carregar
    cy.wait('@authToken')

    // Digitar uma busca
    cy.get('[data-testid="search-input"]').type('test')

    // Selecionar apenas "álbuns" no seletor de tipo
    cy.get('[data-testid="search-type-selector"]').click()
    cy.get('[data-testid="search-type-album"]').click()

    // Verificar se a chamada da API foi feita com os parâmetros corretos
    cy.wait('@albumsSpecificSearch').then((interception) => {
      const url = interception.request.url
      expect(url).to.include('type=album')
      expect(url).to.include('limit=10') // Limite específico para álbuns
      expect(url).to.include('query=test')

      // Verificar que NÃO é uma busca múltipla
      expect(url).to.not.include('type=album,track,artist')
    })
  })

  it('should not show "Load More" button for single type search', () => {
    // Aguardar a página carregar
    cy.wait('@authToken')

    // Digitar uma busca
    cy.get('[data-testid="search-input"]').type('test')

    // Selecionar apenas "álbuns" no seletor de tipo
    cy.get('[data-testid="search-type-selector"]').click()
    cy.get('[data-testid="search-type-album"]').click()

    // Aguardar a busca específica ser executada
    cy.wait('@albumsSpecificSearch')

    // Verificar que o botão "Carregar mais" NÃO aparece para busca de tipo único
    cy.get('[data-testid="load-more-button"]').should('not.exist')
  })

  it('should show 5 albums when searching "tudo" (método múltiplo)', () => {
    // Aguardar a página carregar
    cy.wait('@authToken')

    // Digitar uma busca
    cy.get('[data-testid="search-input"]').type('test')

    // Selecionar "tudo" no seletor de tipo
    cy.get('[data-testid="search-type-selector"]').click()
    cy.get('[data-testid="search-type-all"]').click()

    // Aguardar a busca múltipla ser executada
    cy.wait('@allTypesSearch')

    // Verificar se aparecem exatamente 5 álbuns (limite do "tudo")
    cy.get('[data-testid="albums-section"]').should('be.visible')
    cy.get('[data-testid="album-card"]').should('have.length', 5)

    // Verificar se os álbuns são os do "tudo" (não os específicos)
    cy.get('[data-testid="album-card"]')
      .first()
      .should('contain', 'Album All 1')
    cy.get('[data-testid="album-card"]').last().should('contain', 'Album All 5')
  })

  it('should use different API endpoints for specific vs all search', () => {
    // Aguardar a página carregar
    cy.wait('@authToken')

    // Teste 1: Busca específica de álbuns
    cy.get('[data-testid="search-input"]').clear().type('test')
    cy.get('[data-testid="search-type-selector"]').click()
    cy.get('[data-testid="search-type-album"]').click()
    cy.wait('@albumsSpecificSearch')

    // Teste 2: Busca "tudo"
    cy.get('[data-testid="search-type-selector"]').click()
    cy.get('[data-testid="search-type-all"]').click()
    cy.wait('@allTypesSearch')

    // Verificar que foram feitas duas chamadas diferentes
    cy.get('@albumsSpecificSearch.all').should('have.length', 1)
    cy.get('@allTypesSearch.all').should('have.length', 1)
  })

  it('should show correct skeleton count for "tudo" search', () => {
    // Aguardar a página carregar
    cy.wait('@authToken')

    // Digitar uma busca
    cy.get('[data-testid="search-input"]').type('test')

    // Selecionar "tudo" no seletor de tipo
    cy.get('[data-testid="search-type-selector"]').click()
    cy.get('[data-testid="search-type-all"]').click()

    // Verificar se aparecem 5 skeleton cards para álbuns (limite do "tudo")
    cy.get('[data-testid="album-skeleton"]').should('have.length', 5)

    // Aguardar a busca múltipla ser executada
    cy.wait('@allTypesSearch')

    // Verificar se os skeletons foram substituídos por 5 cards reais
    cy.get('[data-testid="album-card"]').should('have.length', 5)
  })
})
