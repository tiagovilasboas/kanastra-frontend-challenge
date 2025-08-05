describe('Search Domain', () => {
  beforeEach(() => {
    cy.visit('/search')
  })

  describe('Search Interface', () => {
    it('should display search input field', () => {
      cy.get('[data-testid="search-input"]').should('be.visible')
      cy.get('[data-testid="search-input"]').should('have.attr', 'placeholder')
    })

    it('should display search type selector', () => {
      cy.get('[data-testid="search-type-selector"]').should('be.visible')
      cy.get('[data-testid="search-type-artist"]').should('be.visible')
      cy.get('[data-testid="search-type-album"]').should('be.visible')
      cy.get('[data-testid="search-type-track"]').should('be.visible')
    })

    it('should display search button', () => {
      cy.get('[data-testid="search-button"]').should('be.visible')
    })

    it('should show search filters', () => {
      cy.get('[data-testid="search-filters"]').should('be.visible')
    })
  })

  describe('Search Functionality', () => {
    it('should perform artist search', () => {
      // Mock Spotify search API
      cy.intercept(
        'GET',
        'https://api.spotify.com/v1/search?q=test+artist&type=artist*',
        {
          statusCode: 200,
          body: {
            artists: {
              items: [
                {
                  id: 'artist1',
                  name: 'Test Artist 1',
                  images: [{ url: 'https://example.com/image1.jpg' }],
                  followers: { total: 1000 },
                  genres: ['rock'],
                },
                {
                  id: 'artist2',
                  name: 'Test Artist 2',
                  images: [{ url: 'https://example.com/image2.jpg' }],
                  followers: { total: 2000 },
                  genres: ['pop'],
                },
              ],
              total: 2,
            },
          },
        },
      ).as('artistSearch')

      // Select artist search type
      cy.get('[data-testid="search-type-artist"]').click()

      // Enter search query
      cy.get('[data-testid="search-input"]').type('test artist')

      // Submit search
      cy.get('[data-testid="search-button"]').click()

      // Verify search results
      cy.wait('@artistSearch')
      cy.get('[data-testid="search-results"]').should('be.visible')
      cy.get('[data-testid="artist-card"]').should('have.length', 2)
      cy.get('[data-testid="artist-card"]')
        .first()
        .should('contain', 'Test Artist 1')
    })

    it('should perform album search', () => {
      // Mock Spotify search API
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
              total: 1,
            },
          },
        },
      ).as('albumSearch')

      // Select album search type
      cy.get('[data-testid="search-type-album"]').click()

      // Enter search query
      cy.get('[data-testid="search-input"]').type('test album')

      // Submit search
      cy.get('[data-testid="search-button"]').click()

      // Verify search results
      cy.wait('@albumSearch')
      cy.get('[data-testid="album-card"]').should('have.length', 1)
      cy.get('[data-testid="album-card"]').should('contain', 'Test Album 1')
    })

    it('should perform track search', () => {
      // Mock Spotify search API
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
                  name: 'Test Track 1',
                  artists: [{ name: 'Test Artist' }],
                  album: {
                    name: 'Test Album',
                    images: [{ url: 'https://example.com/track1.jpg' }],
                  },
                  duration_ms: 180000,
                },
              ],
              total: 1,
            },
          },
        },
      ).as('trackSearch')

      // Select track search type
      cy.get('[data-testid="search-type-track"]').click()

      // Enter search query
      cy.get('[data-testid="search-input"]').type('test track')

      // Submit search
      cy.get('[data-testid="search-button"]').click()

      // Verify search results
      cy.wait('@trackSearch')
      cy.get('[data-testid="track-card"]').should('have.length', 1)
      cy.get('[data-testid="track-card"]').should('contain', 'Test Track 1')
    })

    it('should search on Enter key press', () => {
      cy.intercept(
        'GET',
        'https://api.spotify.com/v1/search?q=test&type=artist*',
        {
          statusCode: 200,
          body: { artists: { items: [], total: 0 } },
        },
      ).as('searchOnEnter')

      cy.get('[data-testid="search-input"]').type('test{enter}')

      cy.wait('@searchOnEnter')
    })

    it('should clear search results', () => {
      cy.get('[data-testid="search-input"]').type('test')
      cy.get('[data-testid="search-button"]').click()

      cy.get('[data-testid="clear-search"]').click()
      cy.get('[data-testid="search-input"]').should('have.value', '')
      cy.get('[data-testid="search-results"]').should('not.exist')
    })
  })

  describe('Search Filters', () => {
    it('should apply genre filter', () => {
      cy.get('[data-testid="genre-filter"]').click()
      cy.get('[data-testid="genre-rock"]').click()

      cy.get('[data-testid="search-input"]').type('test')
      cy.get('[data-testid="search-button"]').click()

      // Verify filter is applied in search request
      cy.intercept('GET', '**/search?*genre=rock*', {
        statusCode: 200,
        body: { artists: { items: [], total: 0 } },
      }).as('filteredSearch')

      cy.wait('@filteredSearch')
    })

    it('should apply popularity filter', () => {
      cy.get('[data-testid="popularity-filter"]').click()
      cy.get('[data-testid="popularity-high"]').click()

      cy.get('[data-testid="search-input"]').type('test')
      cy.get('[data-testid="search-button"]').click()

      // Verify filter is applied
      cy.get('[data-testid="active-filters"]').should(
        'contain',
        'High Popularity',
      )
    })

    it('should clear all filters', () => {
      // Apply some filters
      cy.get('[data-testid="genre-filter"]').click()
      cy.get('[data-testid="genre-rock"]').click()

      // Clear filters
      cy.get('[data-testid="clear-filters"]').click()

      // Verify filters are cleared
      cy.get('[data-testid="active-filters"]').should('not.exist')
    })
  })

  describe('Search Results', () => {
    beforeEach(() => {
      // Mock search results
      cy.intercept(
        'GET',
        'https://api.spotify.com/v1/search?q=test&type=artist*',
        {
          statusCode: 200,
          body: {
            artists: {
              items: [
                {
                  id: 'artist1',
                  name: 'Test Artist 1',
                  images: [{ url: 'https://example.com/image1.jpg' }],
                  followers: { total: 1000 },
                  genres: ['rock'],
                },
                {
                  id: 'artist2',
                  name: 'Test Artist 2',
                  images: [{ url: 'https://example.com/image2.jpg' }],
                  followers: { total: 2000 },
                  genres: ['pop'],
                },
              ],
              total: 2,
              limit: 20,
              offset: 0,
            },
          },
        },
      ).as('searchResults')

      cy.get('[data-testid="search-input"]').type('test')
      cy.get('[data-testid="search-button"]').click()
      cy.wait('@searchResults')
    })

    it('should display search results count', () => {
      cy.get('[data-testid="results-count"]').should(
        'contain',
        '2 results found',
      )
    })

    it('should display search results in grid', () => {
      cy.get('[data-testid="search-results-grid"]').should('be.visible')
      cy.get('[data-testid="artist-card"]').should('have.length', 2)
    })

    it('should navigate to artist detail from search result', () => {
      cy.get('[data-testid="artist-card"]').first().click()
      cy.url().should('include', '/artist/artist1')
    })

    it('should display pagination for large result sets', () => {
      // Mock large result set
      cy.intercept(
        'GET',
        'https://api.spotify.com/v1/search?q=test&type=artist*',
        {
          statusCode: 200,
          body: {
            artists: {
              items: Array.from({ length: 20 }, (_, i) => ({
                id: `artist${i}`,
                name: `Test Artist ${i}`,
                images: [{ url: 'https://example.com/image.jpg' }],
                followers: { total: 1000 },
                genres: ['rock'],
              })),
              total: 100,
              limit: 20,
              offset: 0,
            },
          },
        },
      ).as('largeSearchResults')

      cy.get('[data-testid="search-button"]').click()
      cy.wait('@largeSearchResults')

      cy.get('[data-testid="pagination"]').should('be.visible')
    })

    it('should handle empty search results', () => {
      cy.intercept(
        'GET',
        'https://api.spotify.com/v1/search?q=nonexistent&type=artist*',
        {
          statusCode: 200,
          body: {
            artists: {
              items: [],
              total: 0,
            },
          },
        },
      ).as('emptySearch')

      cy.get('[data-testid="search-input"]').clear().type('nonexistent')
      cy.get('[data-testid="search-button"]').click()

      cy.wait('@emptySearch')
      cy.get('[data-testid="no-results"]').should('be.visible')
      cy.get('[data-testid="no-results"]').should('contain', 'No results found')
    })
  })

  describe('Search History', () => {
    it('should save search history', () => {
      cy.get('[data-testid="search-input"]').type('test query')
      cy.get('[data-testid="search-button"]').click()

      // Navigate away and back
      cy.visit('/')
      cy.visit('/search')

      // Check if search history is displayed
      cy.get('[data-testid="search-history"]').should('be.visible')
      cy.get('[data-testid="search-history-item"]').should(
        'contain',
        'test query',
      )
    })

    it('should allow clicking on search history items', () => {
      // Perform a search first
      cy.get('[data-testid="search-input"]').type('test query')
      cy.get('[data-testid="search-button"]').click()

      // Navigate away and back
      cy.visit('/')
      cy.visit('/search')

      // Click on history item
      cy.get('[data-testid="search-history-item"]').first().click()
      cy.get('[data-testid="search-input"]').should('have.value', 'test query')
    })

    it('should clear search history', () => {
      // Perform some searches
      cy.get('[data-testid="search-input"]').type('query 1')
      cy.get('[data-testid="search-button"]').click()

      cy.get('[data-testid="search-input"]').clear().type('query 2')
      cy.get('[data-testid="search-button"]').click()

      // Clear history
      cy.get('[data-testid="clear-history"]').click()
      cy.get('[data-testid="search-history"]').should('not.exist')
    })
  })

  describe('Search Performance', () => {
    it('should debounce search input', () => {
      cy.intercept(
        'GET',
        'https://api.spotify.com/v1/search?q=test&type=artist*',
        {
          statusCode: 200,
          body: { artists: { items: [], total: 0 } },
        },
      ).as('debouncedSearch')

      // Type quickly
      cy.get('[data-testid="search-input"]').type('test', { delay: 50 })

      // Should only make one request after debounce
      cy.wait('@debouncedSearch')
      cy.get('@debouncedSearch.all').should('have.length', 1)
    })

    it('should show loading state during search', () => {
      cy.intercept(
        'GET',
        'https://api.spotify.com/v1/search?q=test&type=artist*',
        {
          delay: 1000,
          statusCode: 200,
          body: { artists: { items: [], total: 0 } },
        },
      ).as('slowSearch')

      cy.get('[data-testid="search-input"]').type('test')
      cy.get('[data-testid="search-button"]').click()

      cy.get('[data-testid="search-loading"]').should('be.visible')
      cy.wait('@slowSearch')
      cy.get('[data-testid="search-loading"]').should('not.exist')
    })
  })

  describe('Search Error Handling', () => {
    it('should handle API errors gracefully', () => {
      cy.intercept(
        'GET',
        'https://api.spotify.com/v1/search?q=test&type=artist*',
        {
          statusCode: 500,
          body: { error: 'Internal Server Error' },
        },
      ).as('searchError')

      cy.get('[data-testid="search-input"]').type('test')
      cy.get('[data-testid="search-button"]').click()

      cy.wait('@searchError')
      cy.get('[data-testid="search-error"]').should('be.visible')
      cy.get('[data-testid="search-error"]').should('contain', 'Search failed')
    })

    it('should handle network errors', () => {
      cy.intercept(
        'GET',
        'https://api.spotify.com/v1/search?q=test&type=artist*',
        {
          forceNetworkError: true,
        },
      ).as('networkError')

      cy.get('[data-testid="search-input"]').type('test')
      cy.get('[data-testid="search-button"]').click()

      cy.wait('@networkError')
      cy.get('[data-testid="search-error"]').should('be.visible')
    })

    it('should retry failed searches', () => {
      cy.intercept(
        'GET',
        'https://api.spotify.com/v1/search?q=test&type=artist*',
        {
          statusCode: 500,
          body: { error: 'Internal Server Error' },
        },
      ).as('failedSearch')

      cy.intercept(
        'GET',
        'https://api.spotify.com/v1/search?q=test&type=artist*',
        {
          statusCode: 200,
          body: { artists: { items: [], total: 0 } },
        },
      ).as('retrySearch')

      cy.get('[data-testid="search-input"]').type('test')
      cy.get('[data-testid="search-button"]').click()

      cy.wait('@failedSearch')
      cy.get('[data-testid="retry-search"]').click()
      cy.wait('@retrySearch')
    })
  })
})
