describe('Settings Domain', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('Language Settings', () => {
    it('should display language selector', () => {
      cy.get('[data-testid="language-selector"]').should('be.visible')
    })

    it('should change language to English', () => {
      cy.get('[data-testid="language-selector"]').click()
      cy.get('[data-testid="language-en"]').click()

      // Verify language change
      cy.get('h1').should('contain', 'Welcome to Spotify Explorer')
      cy.get('[data-testid="language-selector"]').should('contain', 'EN')
    })

    it('should change language to Portuguese', () => {
      cy.get('[data-testid="language-selector"]').click()
      cy.get('[data-testid="language-pt"]').click()

      // Verify language change
      cy.get('h1').should('contain', 'Bem-vindo ao Spotify Explorer')
      cy.get('[data-testid="language-selector"]').should('contain', 'PT')
    })

    it('should change language to Spanish', () => {
      cy.get('[data-testid="language-selector"]').click()
      cy.get('[data-testid="language-es"]').click()

      // Verify language change
      cy.get('h1').should('contain', 'Bienvenido a Spotify Explorer')
      cy.get('[data-testid="language-selector"]').should('contain', 'ES')
    })

    it('should persist language preference', () => {
      // Change language
      cy.get('[data-testid="language-selector"]').click()
      cy.get('[data-testid="language-en"]').click()

      // Navigate to another page
      cy.visit('/artists')

      // Navigate back
      cy.visit('/')

      // Verify language preference is maintained
      cy.get('h1').should('contain', 'Welcome to Spotify Explorer')
      cy.get('[data-testid="language-selector"]').should('contain', 'EN')
    })

    it('should update all text content when language changes', () => {
      // Change to English
      cy.get('[data-testid="language-selector"]').click()
      cy.get('[data-testid="language-en"]').click()

      cy.get('[data-testid="nav-artists"]').should('contain', 'Artists')
      cy.get('[data-testid="nav-albums"]').should('contain', 'Albums')
      cy.get('[data-testid="nav-search"]').should('contain', 'Search')

      // Change to Portuguese
      cy.get('[data-testid="language-selector"]').click()
      cy.get('[data-testid="language-pt"]').click()

      cy.get('[data-testid="nav-artists"]').should('contain', 'Artistas')
      cy.get('[data-testid="nav-albums"]').should('contain', 'Álbuns')
      cy.get('[data-testid="nav-search"]').should('contain', 'Buscar')
    })
  })

  describe('Theme Settings', () => {
    it('should display theme toggle', () => {
      cy.get('[data-testid="theme-toggle"]').should('be.visible')
    })

    it('should toggle between light and dark themes', () => {
      // Check initial theme (should be dark by default)
      cy.get('html').should('have.class', 'dark')

      // Toggle to light theme
      cy.get('[data-testid="theme-toggle"]').click()
      cy.get('html').should('have.class', 'light')

      // Toggle back to dark theme
      cy.get('[data-testid="theme-toggle"]').click()
      cy.get('html').should('have.class', 'dark')
    })

    it('should persist theme preference', () => {
      // Change to light theme
      cy.get('[data-testid="theme-toggle"]').click()
      cy.get('html').should('have.class', 'light')

      // Navigate to another page
      cy.visit('/artists')

      // Navigate back
      cy.visit('/')

      // Verify theme preference is maintained
      cy.get('html').should('have.class', 'light')
    })

    it('should update UI colors when theme changes', () => {
      // Check dark theme colors
      cy.get('html').should('have.class', 'dark')
      cy.get('body').should('have.class', 'bg-background')
      cy.get('body').should('have.class', 'text-foreground')

      // Change to light theme
      cy.get('[data-testid="theme-toggle"]').click()
      cy.get('html').should('have.class', 'light')
      cy.get('body').should('have.class', 'bg-background')
      cy.get('body').should('have.class', 'text-foreground')
    })

    it('should show correct theme icon', () => {
      // Dark theme should show sun icon
      cy.get('html').should('have.class', 'dark')
      cy.get('[data-testid="theme-toggle"]')
        .find('svg')
        .should('have.class', 'sun')

      // Light theme should show moon icon
      cy.get('[data-testid="theme-toggle"]').click()
      cy.get('html').should('have.class', 'light')
      cy.get('[data-testid="theme-toggle"]')
        .find('svg')
        .should('have.class', 'moon')
    })
  })

  describe('Settings Persistence', () => {
    it('should persist settings across browser sessions', () => {
      // Change settings
      cy.get('[data-testid="language-selector"]').click()
      cy.get('[data-testid="language-en"]').click()
      cy.get('[data-testid="theme-toggle"]').click()

      // Reload page
      cy.reload()

      // Verify settings are persisted
      cy.get('h1').should('contain', 'Welcome to Spotify Explorer')
      cy.get('[data-testid="language-selector"]').should('contain', 'EN')
      cy.get('html').should('have.class', 'light')
    })

    it('should load settings from localStorage on app start', () => {
      // Set settings in localStorage
      cy.window().then((win) => {
        win.localStorage.setItem('language', 'en')
        win.localStorage.setItem('theme', 'light')
      })

      // Reload page
      cy.reload()

      // Verify settings are loaded
      cy.get('h1').should('contain', 'Welcome to Spotify Explorer')
      cy.get('[data-testid="language-selector"]').should('contain', 'EN')
      cy.get('html').should('have.class', 'light')
    })

    it('should handle corrupted localStorage gracefully', () => {
      // Set invalid data in localStorage
      cy.window().then((win) => {
        win.localStorage.setItem('language', 'invalid')
        win.localStorage.setItem('theme', 'invalid')
      })

      // Reload page
      cy.reload()

      // Should fall back to defaults
      cy.get('h1').should('contain', 'Bem-vindo ao Spotify Explorer') // Default Portuguese
      cy.get('html').should('have.class', 'dark') // Default dark theme
    })
  })

  describe('Settings UI/UX', () => {
    it('should show settings in header', () => {
      cy.get('[data-testid="header"]').within(() => {
        cy.get('[data-testid="language-selector"]').should('be.visible')
        cy.get('[data-testid="theme-toggle"]').should('be.visible')
      })
    })

    it('should show settings in mobile menu', () => {
      cy.viewport('iphone-x')

      cy.get('[data-testid="mobile-menu-button"]').click()
      cy.get('[data-testid="mobile-menu"]').within(() => {
        cy.get('[data-testid="language-selector"]').should('be.visible')
        cy.get('[data-testid="theme-toggle"]').should('be.visible')
      })
    })

    it('should provide visual feedback when changing settings', () => {
      // Language change feedback
      cy.get('[data-testid="language-selector"]').click()
      cy.get('[data-testid="language-en"]').click()
      cy.get('[data-testid="language-selector"]').should(
        'have.class',
        'selected',
      )

      // Theme change feedback
      cy.get('[data-testid="theme-toggle"]').click()
      cy.get('[data-testid="theme-toggle"]').should('have.class', 'active')
    })

    it('should be accessible via keyboard', () => {
      // Navigate to language selector with Tab
      cy.get('body').tab()
      cy.get('[data-testid="language-selector"]').should('be.focused')

      // Open language menu with Enter
      cy.get('[data-testid="language-selector"]').type('{enter}')
      cy.get('[data-testid="language-menu"]').should('be.visible')

      // Select English with arrow keys and Enter
      cy.get('[data-testid="language-en"]').type('{enter}')
      cy.get('h1').should('contain', 'Welcome to Spotify Explorer')
    })
  })

  describe('Settings Validation', () => {
    it('should validate language codes', () => {
      // Try to set invalid language
      cy.window().then((win) => {
        win.localStorage.setItem('language', 'invalid')
      })

      cy.reload()

      // Should fall back to default
      cy.get('h1').should('contain', 'Bem-vindo ao Spotify Explorer')
    })

    it('should validate theme values', () => {
      // Try to set invalid theme
      cy.window().then((win) => {
        win.localStorage.setItem('theme', 'invalid')
      })

      cy.reload()

      // Should fall back to default
      cy.get('html').should('have.class', 'dark')
    })

    it('should handle missing settings gracefully', () => {
      // Clear localStorage
      cy.window().then((win) => {
        win.localStorage.clear()
      })

      cy.reload()

      // Should use defaults
      cy.get('h1').should('contain', 'Bem-vindo ao Spotify Explorer')
      cy.get('html').should('have.class', 'dark')
    })
  })

  describe('Settings Performance', () => {
    it('should change settings quickly', () => {
      const startTime = Date.now()

      cy.get('[data-testid="language-selector"]').click()
      cy.get('[data-testid="language-en"]').click()

      cy.get('h1')
        .should('contain', 'Welcome to Spotify Explorer')
        .then(() => {
          const changeTime = Date.now() - startTime
          expect(changeTime).to.be.lessThan(1000) // 1 second max
        })
    })

    it('should not cause page reload when changing settings', () => {
      // Monitor for page reloads
      cy.window().then((win) => {
        const reloadSpy = cy.spy(win, 'location').as('reloadSpy')
      })

      // Change settings
      cy.get('[data-testid="language-selector"]').click()
      cy.get('[data-testid="language-en"]').click()
      cy.get('[data-testid="theme-toggle"]').click()

      // Verify no reload occurred
      cy.get('@reloadSpy').should('not.have.been.called')
    })
  })

  describe('Settings Integration', () => {
    it('should apply settings to all pages', () => {
      // Change settings on home page
      cy.get('[data-testid="language-selector"]').click()
      cy.get('[data-testid="language-en"]').click()
      cy.get('[data-testid="theme-toggle"]').click()

      // Navigate to different pages
      cy.visit('/artists')
      cy.get('html').should('have.class', 'light')
      cy.get('[data-testid="language-selector"]').should('contain', 'EN')

      cy.visit('/albums')
      cy.get('html').should('have.class', 'light')
      cy.get('[data-testid="language-selector"]').should('contain', 'EN')

      cy.visit('/search')
      cy.get('html').should('have.class', 'light')
      cy.get('[data-testid="language-selector"]').should('contain', 'EN')
    })

    it('should update dynamic content when language changes', () => {
      // Change language
      cy.get('[data-testid="language-selector"]').click()
      cy.get('[data-testid="language-en"]').click()

      // Navigate to search page
      cy.visit('/search')
      cy.get('[data-testid="search-input"]').should(
        'have.attr',
        'placeholder',
        'Search for artists, albums, or tracks...',
      )

      // Change language back
      cy.get('[data-testid="language-selector"]').click()
      cy.get('[data-testid="language-pt"]').click()
      cy.get('[data-testid="search-input"]').should(
        'have.attr',
        'placeholder',
        'Buscar por artistas, álbuns ou músicas...',
      )
    })
  })
})
