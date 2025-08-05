describe('Favorites Domain', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('Favorites Page', () => {
    beforeEach(() => {
      cy.visit('/favorites')
    })

    it('should display favorites page', () => {
      cy.get('[data-testid="favorites-page"]').should('be.visible')
      cy.get('h1').should('contain', 'Favorites')
    })

    it('should show empty state when no favorites', () => {
      cy.get('[data-testid="empty-favorites"]').should('be.visible')
      cy.get('[data-testid="empty-favorites"]').should(
        'contain',
        'No favorites yet',
      )
    })

    it('should display favorite artists', () => {
      // Mock favorites data
      cy.window().then((win) => {
        win.localStorage.setItem(
          'favorites',
          JSON.stringify({
            artists: [
              {
                id: 'artist1',
                name: 'Favorite Artist 1',
                images: [{ url: 'https://example.com/artist1.jpg' }],
                followers: { total: 1000 },
                genres: ['rock'],
              },
              {
                id: 'artist2',
                name: 'Favorite Artist 2',
                images: [{ url: 'https://example.com/artist2.jpg' }],
                followers: { total: 2000 },
                genres: ['pop'],
              },
            ],
            albums: [],
            tracks: [],
          }),
        )
      })

      cy.reload()
      cy.get('[data-testid="favorite-artists"]').should('be.visible')
      cy.get('[data-testid="artist-card"]').should('have.length', 2)
    })

    it('should display favorite albums', () => {
      // Mock favorites data
      cy.window().then((win) => {
        win.localStorage.setItem(
          'favorites',
          JSON.stringify({
            artists: [],
            albums: [
              {
                id: 'album1',
                name: 'Favorite Album 1',
                images: [{ url: 'https://example.com/album1.jpg' }],
                artists: [{ name: 'Test Artist' }],
                release_date: '2023-01-01',
              },
              {
                id: 'album2',
                name: 'Favorite Album 2',
                images: [{ url: 'https://example.com/album2.jpg' }],
                artists: [{ name: 'Test Artist' }],
                release_date: '2022-01-01',
              },
            ],
            tracks: [],
          }),
        )
      })

      cy.reload()
      cy.get('[data-testid="favorite-albums"]').should('be.visible')
      cy.get('[data-testid="album-card"]').should('have.length', 2)
    })

    it('should display favorite tracks', () => {
      // Mock favorites data
      cy.window().then((win) => {
        win.localStorage.setItem(
          'favorites',
          JSON.stringify({
            artists: [],
            albums: [],
            tracks: [
              {
                id: 'track1',
                name: 'Favorite Track 1',
                artists: [{ name: 'Test Artist' }],
                album: {
                  name: 'Test Album',
                  images: [{ url: 'https://example.com/album.jpg' }],
                },
                duration_ms: 180000,
              },
              {
                id: 'track2',
                name: 'Favorite Track 2',
                artists: [{ name: 'Test Artist' }],
                album: {
                  name: 'Test Album',
                  images: [{ url: 'https://example.com/album.jpg' }],
                },
                duration_ms: 200000,
              },
            ],
          }),
        )
      })

      cy.reload()
      cy.get('[data-testid="favorite-tracks"]').should('be.visible')
      cy.get('[data-testid="track-item"]').should('have.length', 2)
    })

    it('should show favorites count', () => {
      // Mock favorites data
      cy.window().then((win) => {
        win.localStorage.setItem(
          'favorites',
          JSON.stringify({
            artists: [{ id: 'artist1', name: 'Artist 1' }],
            albums: [{ id: 'album1', name: 'Album 1' }],
            tracks: [{ id: 'track1', name: 'Track 1' }],
          }),
        )
      })

      cy.reload()
      cy.get('[data-testid="favorites-count"]').should('contain', '3 favorites')
    })
  })

  describe('Adding to Favorites', () => {
    it('should add artist to favorites', () => {
      cy.visit('/artist/test-artist-id')

      // Mock artist details
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

      // Add to favorites
      cy.get('[data-testid="favorite-button"]').click()
      cy.get('[data-testid="favorite-button"]').should(
        'have.class',
        'favorited',
      )

      // Check favorites page
      cy.visit('/favorites')
      cy.get('[data-testid="artist-card"]').should('contain', 'Test Artist')
    })

    it('should add album to favorites', () => {
      cy.visit('/album/test-album-id')

      // Mock album details
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

      // Add to favorites
      cy.get('[data-testid="favorite-button"]').click()
      cy.get('[data-testid="favorite-button"]').should(
        'have.class',
        'favorited',
      )

      // Check favorites page
      cy.visit('/favorites')
      cy.get('[data-testid="album-card"]').should('contain', 'Test Album')
    })

    it('should add track to favorites', () => {
      cy.visit('/search')

      // Mock track search
      cy.intercept(
        'GET',
        'https://api.spotify.com/v1/search?q=test+track&type=track*',
        {
          statusCode: 200,
          body: {
            tracks: {
              items: [
                {
                  id: 'track1',
                  name: 'Test Track',
                  artists: [{ name: 'Test Artist' }],
                  album: {
                    name: 'Test Album',
                    images: [{ url: 'https://example.com/album.jpg' }],
                  },
                  duration_ms: 180000,
                },
              ],
            },
          },
        },
      ).as('trackSearch')

      cy.get('[data-testid="search-type-track"]').click()
      cy.get('[data-testid="search-input"]').type('test track')
      cy.get('[data-testid="search-button"]').click()

      cy.wait('@trackSearch')

      // Add to favorites
      cy.get('[data-testid="favorite-button"]').first().click()
      cy.get('[data-testid="favorite-button"]')
        .first()
        .should('have.class', 'favorited')

      // Check favorites page
      cy.visit('/favorites')
      cy.get('[data-testid="track-item"]').should('contain', 'Test Track')
    })

    it('should show favorite button state correctly', () => {
      // Add artist to favorites first
      cy.window().then((win) => {
        win.localStorage.setItem(
          'favorites',
          JSON.stringify({
            artists: [{ id: 'test-artist-id', name: 'Test Artist' }],
            albums: [],
            tracks: [],
          }),
        )
      })

      cy.visit('/artist/test-artist-id')

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

      // Should show as favorited
      cy.get('[data-testid="favorite-button"]').should(
        'have.class',
        'favorited',
      )
    })
  })

  describe('Removing from Favorites', () => {
    it('should remove artist from favorites', () => {
      // Add artist to favorites first
      cy.window().then((win) => {
        win.localStorage.setItem(
          'favorites',
          JSON.stringify({
            artists: [{ id: 'test-artist-id', name: 'Test Artist' }],
            albums: [],
            tracks: [],
          }),
        )
      })

      cy.visit('/artist/test-artist-id')

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

      // Remove from favorites
      cy.get('[data-testid="favorite-button"]').click()
      cy.get('[data-testid="favorite-button"]').should(
        'not.have.class',
        'favorited',
      )

      // Check favorites page
      cy.visit('/favorites')
      cy.get('[data-testid="empty-favorites"]').should('be.visible')
    })

    it('should remove album from favorites', () => {
      // Add album to favorites first
      cy.window().then((win) => {
        win.localStorage.setItem(
          'favorites',
          JSON.stringify({
            artists: [],
            albums: [{ id: 'test-album-id', name: 'Test Album' }],
            tracks: [],
          }),
        )
      })

      cy.visit('/album/test-album-id')

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

      // Remove from favorites
      cy.get('[data-testid="favorite-button"]').click()
      cy.get('[data-testid="favorite-button"]').should(
        'not.have.class',
        'favorited',
      )

      // Check favorites page
      cy.visit('/favorites')
      cy.get('[data-testid="empty-favorites"]').should('be.visible')
    })

    it('should remove track from favorites', () => {
      // Add track to favorites first
      cy.window().then((win) => {
        win.localStorage.setItem(
          'favorites',
          JSON.stringify({
            artists: [],
            albums: [],
            tracks: [{ id: 'track1', name: 'Test Track' }],
          }),
        )
      })

      cy.visit('/favorites')

      // Remove from favorites
      cy.get('[data-testid="favorite-button"]').first().click()
      cy.get('[data-testid="track-item"]').should('not.exist')
      cy.get('[data-testid="empty-favorites"]').should('be.visible')
    })
  })

  describe('Favorites Navigation', () => {
    it('should navigate to artist detail from favorites', () => {
      // Add artist to favorites
      cy.window().then((win) => {
        win.localStorage.setItem(
          'favorites',
          JSON.stringify({
            artists: [{ id: 'artist1', name: 'Test Artist' }],
            albums: [],
            tracks: [],
          }),
        )
      })

      cy.visit('/favorites')
      cy.get('[data-testid="artist-card"]').click()
      cy.url().should('include', '/artist/artist1')
    })

    it('should navigate to album detail from favorites', () => {
      // Add album to favorites
      cy.window().then((win) => {
        win.localStorage.setItem(
          'favorites',
          JSON.stringify({
            artists: [],
            albums: [{ id: 'album1', name: 'Test Album' }],
            tracks: [],
          }),
        )
      })

      cy.visit('/favorites')
      cy.get('[data-testid="album-card"]').click()
      cy.url().should('include', '/album/album1')
    })

    it('should show favorites in navigation', () => {
      cy.get('[data-testid="nav-favorites"]').should('be.visible')
      cy.get('[data-testid="nav-favorites"]').click()
      cy.url().should('include', '/favorites')
    })
  })

  describe('Favorites Persistence', () => {
    it('should persist favorites across browser sessions', () => {
      // Add artist to favorites
      cy.visit('/artist/test-artist-id')

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

      // Reload page
      cy.reload()

      // Verify favorite is still there
      cy.get('[data-testid="favorite-button"]').should(
        'have.class',
        'favorited',
      )
    })

    it('should handle corrupted favorites data gracefully', () => {
      // Set invalid favorites data
      cy.window().then((win) => {
        win.localStorage.setItem('favorites', 'invalid json')
      })

      cy.visit('/favorites')
      cy.get('[data-testid="empty-favorites"]').should('be.visible')
    })

    it('should handle missing favorites data gracefully', () => {
      // Clear favorites
      cy.window().then((win) => {
        win.localStorage.removeItem('favorites')
      })

      cy.visit('/favorites')
      cy.get('[data-testid="empty-favorites"]').should('be.visible')
    })
  })

  describe('Favorites Performance', () => {
    it('should add to favorites quickly', () => {
      const startTime = Date.now()

      cy.visit('/artist/test-artist-id')

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

      cy.get('[data-testid="favorite-button"]')
        .should('have.class', 'favorited')
        .then(() => {
          const addTime = Date.now() - startTime
          expect(addTime).to.be.lessThan(1000) // 1 second max
        })
    })

    it('should load favorites page quickly', () => {
      const startTime = Date.now()

      cy.visit('/favorites').then(() => {
        const loadTime = Date.now() - startTime
        expect(loadTime).to.be.lessThan(2000) // 2 seconds max
      })
    })
  })

  describe('Favorites Error Handling', () => {
    it('should handle localStorage errors gracefully', () => {
      // Mock localStorage to throw error
      cy.window().then((win) => {
        const originalSetItem = win.localStorage.setItem
        win.localStorage.setItem = () => {
          throw new Error('localStorage error')
        }
      })

      cy.visit('/artist/test-artist-id')

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

      // Should not crash when adding to favorites
      cy.get('[data-testid="favorite-button"]').click()
      cy.get('[data-testid="favorite-button"]').should('be.visible')
    })
  })
})
