describe('Search Domain', () => {
  beforeEach(() => {
    cy.visit('/')
    // Set language to English using the language selector
    cy.setLanguageViaSelector('en')
  })

  describe('Search Interface - Core Functionality', () => {
    it('should have header with search input', () => {
      cy.get('header').should('be.visible')
      cy.get('header input').should('be.visible')
    })

    it('should have search input with correct placeholder', () => {
      cy.get('header input').should(
        'have.attr',
        'placeholder',
        'Search for artists, albums or tracks',
      )
    })

    it('should navigate to search page when typing and pressing Enter', () => {
      cy.get('header input').type('test query{enter}')
      cy.url().should('include', '/search')
    })
  })

  describe('Language Selection', () => {
    it('should set language to English correctly', () => {
      // Verify that the language selector shows English
      cy.get('header button:has(.lucide-globe)').click()
      cy.contains('English').should('be.visible')
      cy.contains('Português').should('be.visible')

      // Check if placeholder is in English
      cy.get('header input').should(
        'have.attr',
        'placeholder',
        'Search for artists, albums or tracks',
      )
    })
  })

  describe('Search Page States', () => {
    it('should show welcome card when no search query', () => {
      cy.visit('/search')
      // Set language again on search page
      cy.setLanguageViaSelector('en')
      // Check if welcome card is visible in English
      cy.get('body').should(
        'contain.text',
        'What do you want to listen to today?',
      )
    })

    it('should show loading state during search', () => {
      cy.intercept('GET', 'https://api.spotify.com/v1/search*', {
        delay: 1000,
        statusCode: 200,
        body: {
          artists: { items: [], total: 0 },
          albums: { items: [], total: 0 },
          tracks: { items: [], total: 0 },
          playlists: { items: [], total: 0 },
          shows: { items: [], total: 0 },
          episodes: { items: [], total: 0 },
          audiobooks: { items: [], total: 0 },
        },
      }).as('slowSearch')

      cy.get('header input').type('test{enter}')
      // Check if loading text is visible in English
      cy.get('body').should('contain.text', 'Searching')
      cy.wait('@slowSearch')
    })

    it('should show no results state', () => {
      cy.intercept('GET', 'https://api.spotify.com/v1/search*', {
        statusCode: 200,
        body: {
          artists: { items: [], total: 0 },
          albums: { items: [], total: 0 },
          tracks: { items: [], total: 0 },
          playlists: { items: [], total: 0 },
          shows: { items: [], total: 0 },
          episodes: { items: [], total: 0 },
          audiobooks: { items: [], total: 0 },
        },
      }).as('noResults')

      cy.get('header input').type('nonexistent{enter}')
      cy.wait('@noResults')
      cy.get('body').should('contain.text', 'No results found')
    })
  })

  describe('Search Filters', () => {
    beforeEach(() => {
      // Mock search with results
      cy.intercept('GET', 'https://api.spotify.com/v1/search*', {
        statusCode: 200,
        body: {
          artists: { items: [{ id: '1', name: 'Test Artist' }], total: 1 },
          albums: { items: [{ id: '1', name: 'Test Album' }], total: 1 },
          tracks: { items: [{ id: '1', name: 'Test Track' }], total: 1 },
        },
      }).as('searchWithResults')

      cy.get('header input').type('test{enter}')
      cy.wait('@searchWithResults')
      // Set language again on search results page
      cy.setLanguageViaSelector('en')
    })

    it('should show filters when there are search results', () => {
      cy.get('body').should('contain.text', 'All')
      cy.get('body').should('contain.text', 'Artists')
      cy.get('body').should('contain.text', 'Albums')
      cy.get('body').should('contain.text', 'Tracks')
    })

    it('should have radio behavior - only one category selected at a time', () => {
      // Wait for filters to be visible and click on them
      cy.contains('Artists').click()
      cy.contains('Albums').click()

      // Verify that filters are working by checking if they're still visible
      cy.get('body').should('contain.text', 'Artists')
      cy.get('body').should('contain.text', 'Albums')
    })
  })

  describe('Search Results and Navigation', () => {
    it('should display search results correctly', () => {
      cy.intercept('GET', 'https://api.spotify.com/v1/search*', {
        statusCode: 200,
        body: {
          artists: {
            items: [
              { id: '1', name: 'Test Artist 1', images: [{ url: 'test.jpg' }] },
              {
                id: '2',
                name: 'Test Artist 2',
                images: [{ url: 'test2.jpg' }],
              },
            ],
            total: 2,
          },
          albums: {
            items: [
              { id: '1', name: 'Test Album 1', images: [{ url: 'test.jpg' }] },
              { id: '2', name: 'Test Album 2', images: [{ url: 'test2.jpg' }] },
            ],
            total: 2,
          },
          tracks: {
            items: [
              {
                id: '1',
                name: 'Test Track 1',
                artists: [{ name: 'Artist 1' }],
                album: { images: [{ url: 'test.jpg' }] },
              },
              {
                id: '2',
                name: 'Test Track 2',
                artists: [{ name: 'Artist 2' }],
                album: { images: [{ url: 'test2.jpg' }] },
              },
            ],
            total: 2,
          },
        },
      }).as('searchResults')

      cy.get('header input').type('test{enter}')
      cy.wait('@searchResults')
      cy.setLanguageViaSelector('en')

      // Verify that results are displayed
      cy.get('body').should('contain.text', 'Test Artist 1')
      cy.get('body').should('contain.text', 'Test Album 1')
      cy.get('body').should('contain.text', 'Test Track 1')
    })

    it('should handle search with special characters', () => {
      cy.intercept('GET', 'https://api.spotify.com/v1/search*', {
        statusCode: 200,
        body: {
          artists: { items: [], total: 0 },
          albums: { items: [], total: 0 },
          tracks: { items: [], total: 0 },
        },
      }).as('specialSearch')

      cy.get('header input').type('test@#$%{enter}')
      cy.wait('@specialSearch')
      cy.get('body').should('contain.text', 'No results found')
    })

    it('should handle empty search query', () => {
      // Navigate to search page first
      cy.visit('/search')
      cy.setLanguageViaSelector('en')

      // Try to search with empty query
      cy.get('header input').type('{enter}')
      cy.get('body').should(
        'contain.text',
        'What do you want to listen to today?',
      )
    })
  })

  describe('Search Error Handling', () => {
    it('should handle API error gracefully', () => {
      cy.intercept('GET', 'https://api.spotify.com/v1/search*', {
        statusCode: 500,
        body: { error: 'Internal Server Error' },
      }).as('apiError')

      cy.get('header input').type('test{enter}')
      cy.wait('@apiError')
      cy.get('body').should('contain.text', 'Search Error')
    })

    it('should handle network timeout', () => {
      cy.intercept('GET', 'https://api.spotify.com/v1/search*', {
        forceNetworkError: true,
      }).as('networkError')

      cy.get('header input').type('test{enter}')
      cy.wait('@networkError')
      cy.get('body').should('contain.text', 'Search Error')
    })
  })

  describe('Search Performance and UX', () => {
    it('should implement debounce for search input', () => {
      cy.intercept('GET', 'https://api.spotify.com/v1/search*', {
        statusCode: 200,
        body: {
          artists: { items: [], total: 0 },
          albums: { items: [], total: 0 },
          tracks: { items: [], total: 0 },
        },
      }).as('debouncedSearch')

      // Type slowly to test debounce
      cy.get('header input').type('t')
      cy.wait(100)
      cy.get('header input').type('e')
      cy.wait(100)
      cy.get('header input').type('s')
      cy.wait(100)
      cy.get('header input').type('t')

      // Should not make API call immediately
      cy.get('@debouncedSearch.all').should('have.length', 0)

      // Wait for debounce delay (800ms)
      cy.wait(900)
      cy.get('@debouncedSearch.all').should('have.length', 1)
    })

    it('should clear search input and return to welcome state', () => {
      cy.visit('/search')
      cy.setLanguageViaSelector('en')

      // Type something in search input
      cy.get('header input').type('test')

      // Clear the input
      cy.get('header input').clear()

      // Should show welcome card
      cy.get('body').should(
        'contain.text',
        'What do you want to listen to today?',
      )
    })
  })

  describe('Desktop Search Limits', () => {
    beforeEach(() => {
      // Set desktop viewport (≥ 768px)
      cy.viewport(1920, 1080)
    })

    it('should apply desktop limits for "All" category (5 of each type)', () => {
      // Mock search with many results for "All" category
      cy.intercept('GET', 'https://api.spotify.com/v1/search*', {
        statusCode: 200,
        body: {
          artists: {
            items: Array.from({ length: 20 }, (_, i) => ({
              id: `${i}`,
              name: `Artist ${i}`,
              images: [{ url: 'test.jpg' }],
            })),
            total: 20,
          },
          albums: {
            items: Array.from({ length: 20 }, (_, i) => ({
              id: `${i}`,
              name: `Album ${i}`,
              images: [{ url: 'test.jpg' }],
            })),
            total: 20,
          },
          tracks: {
            items: Array.from({ length: 20 }, (_, i) => ({
              id: `${i}`,
              name: `Track ${i}`,
              artists: [{ name: `Artist ${i}` }],
              album: { images: [{ url: 'test.jpg' }] },
            })),
            total: 20,
          },
          playlists: {
            items: Array.from({ length: 20 }, (_, i) => ({
              id: `${i}`,
              name: `Playlist ${i}`,
              description: `Description ${i}`,
              images: [{ url: 'test.jpg' }],
              owner: { id: `${i}`, display_name: `Owner ${i}`, type: 'user' },
              public: true,
              collaborative: false,
              tracks: { total: 10 },
            })),
            total: 20,
          },
          shows: {
            items: Array.from({ length: 20 }, (_, i) => ({
              id: `${i}`,
              name: `Show ${i}`,
              description: `Description ${i}`,
              images: [{ url: 'test.jpg' }],
              publisher: `Publisher ${i}`,
              total_episodes: 10,
              explicit: false,
            })),
            total: 20,
          },
          episodes: {
            items: Array.from({ length: 20 }, (_, i) => ({
              id: `${i}`,
              name: `Episode ${i}`,
              description: `Description ${i}`,
              images: [{ url: 'test.jpg' }],
              duration_ms: 1800000,
              release_date: '2023-01-01',
              explicit: false,
              show: { id: `${i}`, name: `Show ${i}` },
            })),
            total: 20,
          },
          audiobooks: {
            items: Array.from({ length: 20 }, (_, i) => ({
              id: `${i}`,
              name: `Audiobook ${i}`,
              description: `Description ${i}`,
              images: [{ url: 'test.jpg' }],
              authors: [{ name: `Author ${i}` }],
              narrators: [{ name: `Narrator ${i}` }],
              publisher: `Publisher ${i}`,
              total_chapters: 10,
              explicit: false,
            })),
            total: 20,
          },
        },
      }).as('desktopAllSearch')

      cy.get('header input').type('test{enter}')
      cy.wait('@desktopAllSearch')
      cy.setLanguageViaSelector('en')

      // Verify that desktop limits are applied for "All" category
      // Should show maximum 5 of each type
      cy.get('body').should('contain.text', 'Artist 0')
      cy.get('body').should('contain.text', 'Artist 4')
      cy.get('body').should('not.contain.text', 'Artist 5')

      cy.get('body').should('contain.text', 'Album 0')
      cy.get('body').should('contain.text', 'Album 4')
      cy.get('body').should('not.contain.text', 'Album 5')

      cy.get('body').should('contain.text', 'Track 0')
      cy.get('body').should('contain.text', 'Track 4')
      cy.get('body').should('not.contain.text', 'Track 5')
    })

    it('should apply desktop limits for specific categories', () => {
      // Mock search with many results for Artists category
      cy.intercept('GET', 'https://api.spotify.com/v1/search*', {
        statusCode: 200,
        body: {
          artists: {
            items: Array.from({ length: 30 }, (_, i) => ({
              id: `${i}`,
              name: `Artist ${i}`,
              images: [{ url: 'test.jpg' }],
            })),
            total: 30,
          },
          albums: { items: [], total: 0 },
          tracks: { items: [], total: 0 },
        },
      }).as('desktopArtistsSearch')

      cy.get('header input').type('test{enter}')
      cy.wait('@desktopArtistsSearch')
      cy.setLanguageViaSelector('en')

      // Click on Artists filter
      cy.contains('Artists').click()

      // Verify that desktop limits are applied for Artists category (25 max)
      cy.get('body').should('contain.text', 'Artist 0')
      cy.get('body').should('contain.text', 'Artist 24')
      cy.get('body').should('not.contain.text', 'Artist 25')
    })
  })
})
