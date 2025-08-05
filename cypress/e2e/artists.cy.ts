describe('Artists Domain', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('Popular Artists', () => {
    it('should display popular artists on home page', () => {
      // Mock popular artists API
      cy.intercept('GET', 'https://api.spotify.com/v1/browse/new-releases*', {
        statusCode: 200,
        body: {
          albums: {
            items: [
              {
                id: 'album1',
                name: 'Test Album 1',
                images: [{ url: 'https://example.com/album1.jpg' }],
                artists: [
                  {
                    id: 'artist1',
                    name: 'Test Artist 1',
                    images: [{ url: 'https://example.com/artist1.jpg' }],
                    followers: { total: 1000 },
                    genres: ['rock'],
                  },
                ],
              },
            ],
          },
        },
      }).as('popularArtists')

      cy.wait('@popularArtists')
      cy.get('[data-testid="popular-artists"]').should('be.visible')
      cy.get('[data-testid="artist-card"]').should('have.length.at.least', 1)
    })

    it('should navigate to artist detail from popular artists', () => {
      cy.intercept('GET', 'https://api.spotify.com/v1/browse/new-releases*', {
        statusCode: 200,
        body: {
          albums: {
            items: [
              {
                id: 'album1',
                name: 'Test Album 1',
                images: [{ url: 'https://example.com/album1.jpg' }],
                artists: [
                  {
                    id: 'artist1',
                    name: 'Test Artist 1',
                    images: [{ url: 'https://example.com/artist1.jpg' }],
                    followers: { total: 1000 },
                    genres: ['rock'],
                  },
                ],
              },
            ],
          },
        },
      }).as('popularArtists')

      cy.wait('@popularArtists')
      cy.get('[data-testid="artist-card"]').first().click()
      cy.url().should('include', '/artist/artist1')
    })

    it('should show loading state for popular artists', () => {
      cy.intercept('GET', 'https://api.spotify.com/v1/browse/new-releases*', {
        delay: 1000,
        statusCode: 200,
        body: { albums: { items: [] } },
      }).as('slowPopularArtists')

      cy.get('[data-testid="popular-artists-loading"]').should('be.visible')
      cy.wait('@slowPopularArtists')
      cy.get('[data-testid="popular-artists-loading"]').should('not.exist')
    })
  })

  describe('Artists List Page', () => {
    beforeEach(() => {
      cy.visit('/artists')
    })

    it('should display artists list page', () => {
      cy.get('[data-testid="artists-page"]').should('be.visible')
      cy.get('h1').should('contain', 'Artists')
    })

    it('should load and display artists', () => {
      // Mock artists API
      cy.intercept('GET', 'https://api.spotify.com/v1/browse/new-releases*', {
        statusCode: 200,
        body: {
          albums: {
            items: [
              {
                id: 'album1',
                name: 'Test Album 1',
                images: [{ url: 'https://example.com/album1.jpg' }],
                artists: [
                  {
                    id: 'artist1',
                    name: 'Test Artist 1',
                    images: [{ url: 'https://example.com/artist1.jpg' }],
                    followers: { total: 1000 },
                    genres: ['rock'],
                  },
                  {
                    id: 'artist2',
                    name: 'Test Artist 2',
                    images: [{ url: 'https://example.com/artist2.jpg' }],
                    followers: { total: 2000 },
                    genres: ['pop'],
                  },
                ],
              },
            ],
          },
        },
      }).as('artistsList')

      cy.wait('@artistsList')
      cy.get('[data-testid="artist-card"]').should('have.length', 2)
    })

    it('should filter artists by genre', () => {
      cy.get('[data-testid="genre-filter"]').click()
      cy.get('[data-testid="genre-rock"]').click()

      cy.intercept('GET', '**/browse/new-releases*', {
        statusCode: 200,
        body: {
          albums: {
            items: [
              {
                id: 'album1',
                name: 'Rock Album',
                images: [{ url: 'https://example.com/album1.jpg' }],
                artists: [
                  {
                    id: 'artist1',
                    name: 'Rock Artist',
                    images: [{ url: 'https://example.com/artist1.jpg' }],
                    followers: { total: 1000 },
                    genres: ['rock'],
                  },
                ],
              },
            ],
          },
        },
      }).as('filteredArtists')

      cy.wait('@filteredArtists')
      cy.get('[data-testid="artist-card"]').should('have.length', 1)
    })

    it('should sort artists by popularity', () => {
      cy.get('[data-testid="sort-selector"]').click()
      cy.get('[data-testid="sort-popularity"]').click()

      cy.intercept('GET', '**/browse/new-releases*', {
        statusCode: 200,
        body: {
          albums: {
            items: [
              {
                id: 'album1',
                name: 'Popular Album',
                images: [{ url: 'https://example.com/album1.jpg' }],
                artists: [
                  {
                    id: 'artist1',
                    name: 'Popular Artist',
                    images: [{ url: 'https://example.com/artist1.jpg' }],
                    followers: { total: 5000 },
                    genres: ['pop'],
                  },
                ],
              },
            ],
          },
        },
      }).as('sortedArtists')

      cy.wait('@sortedArtists')
    })

    it('should paginate artists list', () => {
      // Mock first page
      cy.intercept(
        'GET',
        'https://api.spotify.com/v1/browse/new-releases?limit=20&offset=0*',
        {
          statusCode: 200,
          body: {
            albums: {
              items: Array.from({ length: 20 }, (_, i) => ({
                id: `album${i}`,
                name: `Album ${i}`,
                images: [{ url: 'https://example.com/album.jpg' }],
                artists: [
                  {
                    id: `artist${i}`,
                    name: `Artist ${i}`,
                    images: [{ url: 'https://example.com/artist.jpg' }],
                    followers: { total: 1000 },
                    genres: ['rock'],
                  },
                ],
              })),
              total: 50,
              limit: 20,
              offset: 0,
            },
          },
        },
      ).as('firstPage')

      cy.wait('@firstPage')
      cy.get('[data-testid="pagination"]').should('be.visible')

      // Mock second page
      cy.intercept(
        'GET',
        'https://api.spotify.com/v1/browse/new-releases?limit=20&offset=20*',
        {
          statusCode: 200,
          body: {
            albums: {
              items: Array.from({ length: 20 }, (_, i) => ({
                id: `album${i + 20}`,
                name: `Album ${i + 20}`,
                images: [{ url: 'https://example.com/album.jpg' }],
                artists: [
                  {
                    id: `artist${i + 20}`,
                    name: `Artist ${i + 20}`,
                    images: [{ url: 'https://example.com/artist.jpg' }],
                    followers: { total: 1000 },
                    genres: ['rock'],
                  },
                ],
              })),
              total: 50,
              limit: 20,
              offset: 20,
            },
          },
        },
      ).as('secondPage')

      cy.get('[data-testid="pagination-next"]').click()
      cy.wait('@secondPage')
    })
  })

  describe('Artist Detail Page', () => {
    beforeEach(() => {
      cy.visit('/artist/test-artist-id')
    })

    it('should display artist information', () => {
      // Mock artist details API
      cy.intercept('GET', 'https://api.spotify.com/v1/artists/test-artist-id', {
        statusCode: 200,
        body: {
          id: 'test-artist-id',
          name: 'Test Artist',
          images: [{ url: 'https://example.com/artist.jpg' }],
          followers: { total: 10000 },
          genres: ['rock', 'alternative'],
          popularity: 85,
        },
      }).as('artistDetails')

      cy.wait('@artistDetails')
      cy.get('[data-testid="artist-header"]').should('be.visible')
      cy.get('[data-testid="artist-name"]').should('contain', 'Test Artist')
      cy.get('[data-testid="artist-followers"]').should('contain', '10,000')
    })

    it('should display artist albums', () => {
      // Mock artist albums API
      cy.intercept(
        'GET',
        'https://api.spotify.com/v1/artists/test-artist-id/albums*',
        {
          statusCode: 200,
          body: {
            items: [
              {
                id: 'album1',
                name: 'Test Album 1',
                images: [{ url: 'https://example.com/album1.jpg' }],
                release_date: '2023-01-01',
                total_tracks: 12,
              },
              {
                id: 'album2',
                name: 'Test Album 2',
                images: [{ url: 'https://example.com/album2.jpg' }],
                release_date: '2022-01-01',
                total_tracks: 10,
              },
            ],
          },
        },
      ).as('artistAlbums')

      cy.wait('@artistAlbums')
      cy.get('[data-testid="artist-albums"]').should('be.visible')
      cy.get('[data-testid="album-card"]').should('have.length', 2)
    })

    it('should display artist top tracks', () => {
      // Mock artist top tracks API
      cy.intercept(
        'GET',
        'https://api.spotify.com/v1/artists/test-artist-id/top-tracks*',
        {
          statusCode: 200,
          body: {
            tracks: [
              {
                id: 'track1',
                name: 'Top Track 1',
                duration_ms: 180000,
                album: {
                  name: 'Test Album',
                  images: [{ url: 'https://example.com/album.jpg' }],
                },
              },
              {
                id: 'track2',
                name: 'Top Track 2',
                duration_ms: 200000,
                album: {
                  name: 'Test Album',
                  images: [{ url: 'https://example.com/album.jpg' }],
                },
              },
            ],
          },
        },
      ).as('artistTopTracks')

      cy.wait('@artistTopTracks')
      cy.get('[data-testid="artist-top-tracks"]').should('be.visible')
      cy.get('[data-testid="track-item"]').should('have.length', 2)
    })

    it('should display related artists', () => {
      // Mock related artists API
      cy.intercept(
        'GET',
        'https://api.spotify.com/v1/artists/test-artist-id/related-artists',
        {
          statusCode: 200,
          body: {
            artists: [
              {
                id: 'related1',
                name: 'Related Artist 1',
                images: [{ url: 'https://example.com/related1.jpg' }],
                followers: { total: 5000 },
                genres: ['rock'],
              },
              {
                id: 'related2',
                name: 'Related Artist 2',
                images: [{ url: 'https://example.com/related2.jpg' }],
                followers: { total: 3000 },
                genres: ['alternative'],
              },
            ],
          },
        },
      ).as('relatedArtists')

      cy.wait('@relatedArtists')
      cy.get('[data-testid="related-artists"]').should('be.visible')
      cy.get('[data-testid="artist-card"]').should('have.length', 2)
    })

    it('should navigate to related artist', () => {
      cy.intercept(
        'GET',
        'https://api.spotify.com/v1/artists/test-artist-id/related-artists',
        {
          statusCode: 200,
          body: {
            artists: [
              {
                id: 'related1',
                name: 'Related Artist 1',
                images: [{ url: 'https://example.com/related1.jpg' }],
                followers: { total: 5000 },
                genres: ['rock'],
              },
            ],
          },
        },
      ).as('relatedArtists')

      cy.wait('@relatedArtists')
      cy.get('[data-testid="artist-card"]').first().click()
      cy.url().should('include', '/artist/related1')
    })

    it('should add artist to favorites', () => {
      cy.intercept('GET', 'https://api.spotify.com/v1/artists/test-artist-id', {
        statusCode: 200,
        body: {
          id: 'test-artist-id',
          name: 'Test Artist',
          images: [{ url: 'https://example.com/artist.jpg' }],
          followers: { total: 10000 },
          genres: ['rock'],
          popularity: 85,
        },
      }).as('artistDetails')

      cy.wait('@artistDetails')
      cy.get('[data-testid="favorite-button"]').click()
      cy.get('[data-testid="favorite-button"]').should(
        'have.class',
        'favorited',
      )
    })

    it('should remove artist from favorites', () => {
      cy.intercept('GET', 'https://api.spotify.com/v1/artists/test-artist-id', {
        statusCode: 200,
        body: {
          id: 'test-artist-id',
          name: 'Test Artist',
          images: [{ url: 'https://example.com/artist.jpg' }],
          followers: { total: 10000 },
          genres: ['rock'],
          popularity: 85,
        },
      }).as('artistDetails')

      cy.wait('@artistDetails')

      // Add to favorites first
      cy.get('[data-testid="favorite-button"]').click()
      cy.get('[data-testid="favorite-button"]').should(
        'have.class',
        'favorited',
      )

      // Remove from favorites
      cy.get('[data-testid="favorite-button"]').click()
      cy.get('[data-testid="favorite-button"]').should(
        'not.have.class',
        'favorited',
      )
    })
  })

  describe('Artist Error Handling', () => {
    it('should handle artist not found', () => {
      cy.intercept('GET', 'https://api.spotify.com/v1/artists/invalid-id', {
        statusCode: 404,
        body: { error: { status: 404, message: 'Artist not found' } },
      }).as('artistNotFound')

      cy.visit('/artist/invalid-id')
      cy.wait('@artistNotFound')
      cy.get('[data-testid="artist-error"]').should('be.visible')
      cy.get('[data-testid="artist-error"]').should(
        'contain',
        'Artist not found',
      )
    })

    it('should handle API errors gracefully', () => {
      cy.intercept('GET', 'https://api.spotify.com/v1/artists/test-artist-id', {
        statusCode: 500,
        body: { error: 'Internal Server Error' },
      }).as('artistError')

      cy.visit('/artist/test-artist-id')
      cy.wait('@artistError')
      cy.get('[data-testid="artist-error"]').should('be.visible')
    })

    it('should retry failed artist requests', () => {
      cy.intercept('GET', 'https://api.spotify.com/v1/artists/test-artist-id', {
        statusCode: 500,
        body: { error: 'Internal Server Error' },
      }).as('artistError')

      cy.intercept('GET', 'https://api.spotify.com/v1/artists/test-artist-id', {
        statusCode: 200,
        body: {
          id: 'test-artist-id',
          name: 'Test Artist',
          images: [{ url: 'https://example.com/artist.jpg' }],
          followers: { total: 10000 },
          genres: ['rock'],
          popularity: 85,
        },
      }).as('artistRetry')

      cy.visit('/artist/test-artist-id')
      cy.wait('@artistError')
      cy.get('[data-testid="retry-button"]').click()
      cy.wait('@artistRetry')
      cy.get('[data-testid="artist-header"]').should('be.visible')
    })
  })

  describe('Artist Performance', () => {
    it('should load artist page quickly', () => {
      const startTime = Date.now()

      cy.intercept('GET', 'https://api.spotify.com/v1/artists/test-artist-id', {
        statusCode: 200,
        body: {
          id: 'test-artist-id',
          name: 'Test Artist',
          images: [{ url: 'https://example.com/artist.jpg' }],
          followers: { total: 10000 },
          genres: ['rock'],
          popularity: 85,
        },
      }).as('artistDetails')

      cy.visit('/artist/test-artist-id').then(() => {
        const loadTime = Date.now() - startTime
        expect(loadTime).to.be.lessThan(3000) // 3 seconds max
      })

      cy.wait('@artistDetails')
    })

    it('should cache artist data', () => {
      cy.intercept('GET', 'https://api.spotify.com/v1/artists/test-artist-id', {
        statusCode: 200,
        body: {
          id: 'test-artist-id',
          name: 'Test Artist',
          images: [{ url: 'https://example.com/artist.jpg' }],
          followers: { total: 10000 },
          genres: ['rock'],
          popularity: 85,
        },
      }).as('artistDetails')

      // First visit
      cy.visit('/artist/test-artist-id')
      cy.wait('@artistDetails')

      // Second visit (should use cache)
      cy.visit('/artist/test-artist-id')
      cy.get('[data-testid="artist-header"]').should('be.visible')

      // Should not make another API call
      cy.get('@artistDetails.all').should('have.length', 1)
    })
  })
})
