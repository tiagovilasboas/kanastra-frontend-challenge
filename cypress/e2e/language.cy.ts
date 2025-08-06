describe('Language Selector E2E', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should display language selector and allow language switching', () => {
    // Verify language selector is visible
    cy.get('[data-testid="language-selector"]').should('be.visible')

    // Click on language selector to open dropdown
    cy.get('[data-testid="language-selector"]').click()

    // Verify dropdown is visible
    cy.get('[data-testid="language-dropdown"]').should('be.visible')

    // Verify both language options are available
    cy.get('[data-testid="language-option-pt"]').should('be.visible')
    cy.get('[data-testid="language-option-en"]').should('be.visible')

    // Verify Portuguese option shows correct text and flag
    cy.get('[data-testid="language-option-pt"]').should('contain', 'Português')
    cy.get('[data-testid="language-option-pt"]').should('contain', '🇧🇷')

    // Verify English option shows correct text and flag
    cy.get('[data-testid="language-option-en"]').should('contain', 'English')
    cy.get('[data-testid="language-option-en"]').should('contain', '🇺🇸')
  })

  it('should switch to English and update UI text', () => {
    // Click on language selector
    cy.get('[data-testid="language-selector"]').click()

    // Click on English option
    cy.get('[data-testid="language-option-en"]').click()

    // Wait for language change to be applied
    cy.wait(500)

    // Verify language has changed by checking UI text
    // The header should show "Spotify Explorer" in English
    cy.get('header').should('contain', 'Spotify Explorer')

    // Verify search placeholder is in English
    cy.get('[data-testid="search-input"]').should(
      'have.attr',
      'placeholder',
      'Search for artists',
    )

    // Verify language selector still shows current language
    cy.get('[data-testid="language-selector"]').should('be.visible')
  })

  it('should switch to Portuguese and update UI text', () => {
    // First switch to English to ensure we can test Portuguese switch
    cy.get('[data-testid="language-selector"]').click()
    cy.get('[data-testid="language-option-en"]').click()
    cy.wait(500)

    // Now switch back to Portuguese
    cy.get('[data-testid="language-selector"]').click()
    cy.get('[data-testid="language-option-pt"]').click()

    // Wait for language change to be applied
    cy.wait(500)

    // Verify language has changed by checking UI text
    // The header should show "Spotify Explorer" (same in Portuguese)
    cy.get('header').should('contain', 'Spotify Explorer')

    // Verify search placeholder is in Portuguese
    cy.get('[data-testid="search-input"]').should(
      'have.attr',
      'placeholder',
      'Buscar por artistas',
    )

    // Verify language selector still shows current language
    cy.get('[data-testid="language-selector"]').should('be.visible')
  })

  it('should maintain language selection across page navigation', () => {
    // Switch to English
    cy.get('[data-testid="language-selector"]').click()
    cy.get('[data-testid="language-option-en"]').click()
    cy.wait(500)

    // Navigate to search page
    cy.visit('/search')

    // Verify language is still English
    cy.get('[data-testid="search-input"]').should(
      'have.attr',
      'placeholder',
      'Search for artists',
    )

    // Navigate to artists page
    cy.visit('/artists')

    // Verify language is still English
    cy.get('h1').should('contain', 'Popular Artists')

    // Navigate back to home
    cy.visit('/')

    // Verify language is still English
    cy.get('[data-testid="search-input"]').should(
      'have.attr',
      'placeholder',
      'Search for artists',
    )
  })

  it('should close dropdown when clicking outside', () => {
    // Open language dropdown
    cy.get('[data-testid="language-selector"]').click()
    cy.get('[data-testid="language-dropdown"]').should('be.visible')

    // Click outside the dropdown (on the header)
    cy.get('header').click()

    // Verify dropdown is closed
    cy.get('[data-testid="language-dropdown"]').should('not.exist')
  })

  it('should handle rapid language switching', () => {
    // Rapidly switch between languages
    cy.get('[data-testid="language-selector"]').click()
    cy.get('[data-testid="language-option-en"]').click()
    cy.wait(200)

    cy.get('[data-testid="language-selector"]').click()
    cy.get('[data-testid="language-option-pt"]').click()
    cy.wait(200)

    cy.get('[data-testid="language-selector"]').click()
    cy.get('[data-testid="language-option-en"]').click()
    cy.wait(500)

    // Verify final language is applied correctly
    cy.get('[data-testid="search-input"]').should(
      'have.attr',
      'placeholder',
      'Search for artists',
    )
  })
})
