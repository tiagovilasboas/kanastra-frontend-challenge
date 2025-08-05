describe('Albums Domain', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('Albums List Page', () => {
    beforeEach(() => {
      cy.visit('/albums')
    })

    it('should display albums list page', () => {
      cy.get('[data-testid="albums-page"]').should('be.visible')
      cy.get('h1').should('contain', 'Albums')
    })

    it('should load and display albums', () => {
      // Mock albums API
      cy.intercept('GET', 'https://api.spotify.com/v1/browse/new-releases*', {
        statusCode: 200,
        body: {
          albums: {
            items: [
              {
                id: 'album1',
                name: 'Test Album 1',
                images: [{ url: 'https://example.com/album1.jpg' }],
                artists: [{ name: 'Test Artist 1' }],
                release_date: '2023-01-01',
                total_tracks: 12,
              },
              {
                id: 'album2',
                name: 'Test Album 2',
                images: [{ url: 'https://example.com/album2.jpg' }],
                artists: [{ name: 'Test Artist 2' }],
                release_date: '2022-12-01',
                total_tracks: 10,
              },
            ],
          },
        },
      }).as('albumsList')

      cy.wait('@albumsList')
      cy.get('[data-testid="album-card"]').should('have.length', 2)
    })

    it('should filter albums by release date', () => {
      cy.get('[data-testid="date-filter"]').click()
      cy.get('[data-testid="date-this-month"]').click()

      cy.intercept('GET', '**/browse/new-releases*', {
        statusCode: 200,
        body: {
          albums: {
            items: [
              {
                id: 'album1',
                name: 'Recent Album',
                images: [{ url: 'https://example.com/album1.jpg' }],
                artists: [{ name: 'Test Artist' }],
                release_date: '2023-01-15',
                total_tracks: 12,
              },
            ],
          },
        },
      }).as('filteredAlbums')

      cy.wait('@filteredAlbums')
      cy.get('[data-testid="album-card"]').should('have.length', 1)
    })

    it('should sort albums by release date', () => {
      cy.get('[data-testid="sort-selector"]').click()
      cy.get('[data-testid="sort-release-date"]').click()

      cy.intercept('GET', '**/browse/new-releases*', {
        statusCode: 200,
        body: {
          albums: {
            items: [
              {
                id: 'album1',
                name: 'Latest Album',
                images: [{ url: 'https://example.com/album1.jpg' }],
                artists: [{ name: 'Test Artist' }],
                release_date: '2023-01-20',
                total_tracks: 12,
              },
            ],
          },
        },
      }).as('sortedAlbums')

      cy.wait('@sortedAlbums')
    })

    it('should paginate albums list', () => {
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
                artists: [{ name: `Artist ${i}` }],
                release_date: '2023-01-01',
                total_tracks: 12,
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
                artists: [{ name: `Artist ${i + 20}` }],
                release_date: '2023-01-01',
                total_tracks: 12,
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

  describe('Album Detail Page', () => {
    beforeEach(() => {
      cy.visit('/album/test-album-id')
    })

    it('should display album information', () => {
      // Mock album details API
      cy.intercept('GET', 'https://api.spotify.com/v1/albums/test-album-id', {
        statusCode: 200,
        body: {
          id: 'test-album-id',
          name: 'Test Album',
          images: [{ url: 'https://example.com/album.jpg' }],
          artists: [{ id: 'artist1', name: 'Test Artist' }],
          release_date: '2023-01-01',
          total_tracks: 12,
          popularity: 85,
          genres: ['rock'],
        },
      }).as('albumDetails')

      cy.wait('@albumDetails')
      cy.get('[data-testid="album-header"]').should('be.visible')
      cy.get('[data-testid="album-name"]').should('contain', 'Test Album')
      cy.get('[data-testid="album-artist"]').should('contain', 'Test Artist')
    })

    it('should display album tracks', () => {
      // Mock album tracks API
      cy.intercept(
        'GET',
        'https://api.spotify.com/v1/albums/test-album-id/tracks*',
        {
          statusCode: 200,
          body: {
            items: [
              {
                id: 'track1',
                name: 'Track 1',
                duration_ms: 180000,
                track_number: 1,
                artists: [{ name: 'Test Artist' }],
              },
              {
                id: 'track2',
                name: 'Track 2',
                duration_ms: 200000,
                track_number: 2,
                artists: [{ name: 'Test Artist' }],
              },
            ],
          },
        },
      ).as('albumTracks')

      cy.wait('@albumTracks')
      cy.get('[data-testid="album-tracks"]').should('be.visible')
      cy.get('[data-testid="track-item"]').should('have.length', 2)
    })

    it('should navigate to artist from album', () => {
      cy.intercept('GET', 'https://api.spotify.com/v1/albums/test-album-id', {
        statusCode: 200,
        body: {
          id: 'test-album-id',
          name: 'Test Album',
          images: [{ url: 'https://example.com/album.jpg' }],
          artists: [{ id: 'artist1', name: 'Test Artist' }],
          release_date: '2023-01-01',
          total_tracks: 12,
        },
      }).as('albumDetails')

      cy.wait('@albumDetails')
      cy.get('[data-testid="album-artist-link"]').click()
      cy.url().should('include', '/artist/artist1')
    })

    it('should add album to favorites', () => {
      cy.intercept('GET', 'https://api.spotify.com/v1/albums/test-album-id', {
        statusCode: 200,
        body: {
          id: 'test-album-id',
          name: 'Test Album',
          images: [{ url: 'https://example.com/album.jpg' }],
          artists: [{ id: 'artist1', name: 'Test Artist' }],
          release_date: '2023-01-01',
          total_tracks: 12,
        },
      }).as('albumDetails')

      cy.wait('@albumDetails')
      cy.get('[data-testid="favorite-button"]').click()
      cy.get('[data-testid="favorite-button"]').should(
        'have.class',
        'favorited',
      )
    })

    it('should remove album from favorites', () => {
      cy.intercept('GET', 'https://api.spotify.com/v1/albums/test-album-id', {
        statusCode: 200,
        body: {
          id: 'test-album-id',
          name: 'Test Album',
          images: [{ url: 'https://example.com/album.jpg' }],
          artists: [{ id: 'artist1', name: 'Test Artist' }],
          release_date: '2023-01-01',
          total_tracks: 12,
        },
      }).as('albumDetails')

      cy.wait('@albumDetails')

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

    it('should play album preview', () => {
      cy.intercept('GET', 'https://api.spotify.com/v1/albums/test-album-id', {
        statusCode: 200,
        body: {
          id: 'test-album-id',
          name: 'Test Album',
          images: [{ url: 'https://example.com/album.jpg' }],
          artists: [{ id: 'artist1', name: 'Test Artist' }],
          release_date: '2023-01-01',
          total_tracks: 12,
        },
      }).as('albumDetails')

      cy.intercept(
        'GET',
        'https://api.spotify.com/v1/albums/test-album-id/tracks*',
        {
          statusCode: 200,
          body: {
            items: [
              {
                id: 'track1',
                name: 'Track 1',
                duration_ms: 180000,
                track_number: 1,
                artists: [{ name: 'Test Artist' }],
                preview_url: 'https://example.com/preview1.mp3',
              },
            ],
          },
        },
      ).as('albumTracks')

      cy.wait('@albumDetails')
      cy.wait('@albumTracks')

      cy.get('[data-testid="play-button"]').click()
      cy.get('[data-testid="audio-player"]').should('be.visible')
    })
  })

  describe('Album Search Integration', () => {
    it('should search for albums', () => {
      cy.visit('/search')

      // Mock album search
      cy.intercept(
        'GET',
        'https://api.spotify.com/v1/search?q=test+album&type=album*',
        {
          statusCode: 200,
          body: {
            albums: {
              items: [
                {
                  id: 'album1',
                  name: 'Test Album 1',
                  images: [{ url: 'https://example.com/album1.jpg' }],
                  artists: [{ name: 'Test Artist' }],
                  release_date: '2023-01-01',
                },
              ],
            },
          },
        },
      ).as('albumSearch')

      cy.get('[data-testid="search-type-album"]').click()
      cy.get('[data-testid="search-input"]').type('test album')
      cy.get('[data-testid="search-button"]').click()

      cy.wait('@albumSearch')
      cy.get('[data-testid="album-card"]').should('have.length', 1)
    })

    it('should navigate to album from search results', () => {
      cy.visit('/search')

      cy.intercept(
        'GET',
        'https://api.spotify.com/v1/search?q=test+album&type=album*',
        {
          statusCode: 200,
          body: {
            albums: {
              items: [
                {
                  id: 'album1',
                  name: 'Test Album 1',
                  images: [{ url: 'https://example.com/album1.jpg' }],
                  artists: [{ name: 'Test Artist' }],
                  release_date: '2023-01-01',
                },
              ],
            },
          },
        },
      ).as('albumSearch')

      cy.get('[data-testid="search-type-album"]').click()
      cy.get('[data-testid="search-input"]').type('test album')
      cy.get('[data-testid="search-button"]').click()

      cy.wait('@albumSearch')
      cy.get('[data-testid="album-card"]').first().click()
      cy.url().should('include', '/album/album1')
    })
  })

  describe('Album Error Handling', () => {
    it('should handle album not found', () => {
      cy.intercept('GET', 'https://api.spotify.com/v1/albums/invalid-id', {
        statusCode: 404,
        body: { error: { status: 404, message: 'Album not found' } },
      }).as('albumNotFound')

      cy.visit('/album/invalid-id')
      cy.wait('@albumNotFound')
      cy.get('[data-testid="album-error"]').should('be.visible')
      cy.get('[data-testid="album-error"]').should('contain', 'Album not found')
    })

    it('should handle API errors gracefully', () => {
      cy.intercept('GET', 'https://api.spotify.com/v1/albums/test-album-id', {
        statusCode: 500,
        body: { error: 'Internal Server Error' },
      }).as('albumError')

      cy.visit('/album/test-album-id')
      cy.wait('@albumError')
      cy.get('[data-testid="album-error"]').should('be.visible')
    })

    it('should retry failed album requests', () => {
      cy.intercept('GET', 'https://api.spotify.com/v1/albums/test-album-id', {
        statusCode: 500,
        body: { error: 'Internal Server Error' },
      }).as('albumError')

      cy.intercept('GET', 'https://api.spotify.com/v1/albums/test-album-id', {
        statusCode: 200,
        body: {
          id: 'test-album-id',
          name: 'Test Album',
          images: [{ url: 'https://example.com/album.jpg' }],
          artists: [{ id: 'artist1', name: 'Test Artist' }],
          release_date: '2023-01-01',
          total_tracks: 12,
        },
      }).as('albumRetry')

      cy.visit('/album/test-album-id')
      cy.wait('@albumError')
      cy.get('[data-testid="retry-button"]').click()
      cy.wait('@albumRetry')
      cy.get('[data-testid="album-header"]').should('be.visible')
    })
  })

  describe('Album Performance', () => {
    it('should load album page quickly', () => {
      const startTime = Date.now()

      cy.intercept('GET', 'https://api.spotify.com/v1/albums/test-album-id', {
        statusCode: 200,
        body: {
          id: 'test-album-id',
          name: 'Test Album',
          images: [{ url: 'https://example.com/album.jpg' }],
          artists: [{ id: 'artist1', name: 'Test Artist' }],
          release_date: '2023-01-01',
          total_tracks: 12,
        },
      }).as('albumDetails')

      cy.visit('/album/test-album-id').then(() => {
        const loadTime = Date.now() - startTime
        expect(loadTime).to.be.lessThan(3000) // 3 seconds max
      })

      cy.wait('@albumDetails')
    })

    it('should cache album data', () => {
      cy.intercept('GET', 'https://api.spotify.com/v1/albums/test-album-id', {
        statusCode: 200,
        body: {
          id: 'test-album-id',
          name: 'Test Album',
          images: [{ url: 'https://example.com/album.jpg' }],
          artists: [{ id: 'artist1', name: 'Test Artist' }],
          release_date: '2023-01-01',
          total_tracks: 12,
        },
      }).as('albumDetails')

      // First visit
      cy.visit('/album/test-album-id')
      cy.wait('@albumDetails')

      // Second visit (should use cache)
      cy.visit('/album/test-album-id')
      cy.get('[data-testid="album-header"]').should('be.visible')

      // Should not make another API call
      cy.get('@albumDetails.all').should('have.length', 1)
    })
  })

  describe('Album Responsive Design', () => {
    it('should display correctly on mobile', () => {
      cy.viewport('iphone-x')
      cy.visit('/albums')

      cy.get('[data-testid="albums-page"]').should('be.visible')
      cy.get('[data-testid="album-card"]').should('be.visible')
    })

    it('should display correctly on tablet', () => {
      cy.viewport('ipad-2')
      cy.visit('/albums')

      cy.get('[data-testid="albums-page"]').should('be.visible')
      cy.get('[data-testid="album-card"]').should('be.visible')
    })

    it('should display correctly on desktop', () => {
      cy.viewport(1920, 1080)
      cy.visit('/albums')

      cy.get('[data-testid="albums-page"]').should('be.visible')
      cy.get('[data-testid="album-card"]').should('be.visible')
    })
  })
})
