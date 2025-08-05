describe('Authentication Domain', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('Spotify OAuth Flow', () => {
    it('should redirect to Spotify authorization when clicking login', () => {
      // Mock Spotify authorization URL
      cy.intercept('GET', 'https://accounts.spotify.com/authorize*', {
        statusCode: 200,
        body: '<html>Spotify Auth Page</html>',
      }).as('spotifyAuth')

      // Simulate login button click (assuming there's a login button)
      cy.get('[data-testid="login-button"]').click()

      // Verify redirect to Spotify
      cy.wait('@spotifyAuth')
      cy.url().should('include', 'accounts.spotify.com')
    })

    it('should handle OAuth callback successfully', () => {
      // Mock successful token exchange
      cy.intercept('POST', 'https://accounts.spotify.com/api/token', {
        statusCode: 200,
        body: {
          access_token: 'mock-access-token',
          refresh_token: 'mock-refresh-token',
          expires_in: 3600,
          token_type: 'Bearer',
        },
      }).as('tokenExchange')

      // Visit callback page with mock authorization code
      cy.visit('/callback?code=mock-auth-code&state=mock-state')

      // Verify successful authentication
      cy.wait('@tokenExchange')
      cy.url().should('not.include', '/callback')
      cy.get('[data-testid="user-profile"]').should('be.visible')
    })

    it('should handle OAuth callback errors', () => {
      // Mock failed token exchange
      cy.intercept('POST', 'https://accounts.spotify.com/api/token', {
        statusCode: 400,
        body: { error: 'invalid_grant' },
      }).as('tokenError')

      // Visit callback page with invalid code
      cy.visit('/callback?code=invalid-code&state=mock-state')

      // Verify error handling
      cy.wait('@tokenError')
      cy.get('[data-testid="auth-error"]').should('be.visible')
      cy.get('[data-testid="auth-error"]').should(
        'contain',
        'Authentication failed',
      )
    })

    it('should handle missing authorization code', () => {
      // Visit callback page without code
      cy.visit('/callback')

      // Verify error message
      cy.get('[data-testid="auth-error"]').should('be.visible')
      cy.get('[data-testid="auth-error"]').should(
        'contain',
        'No authorization code provided',
      )
    })
  })

  describe('Token Management', () => {
    it('should refresh expired tokens automatically', () => {
      // Mock expired token response
      cy.intercept('GET', 'https://api.spotify.com/v1/me', {
        statusCode: 401,
        body: { error: { status: 401, message: 'The access token expired' } },
      }).as('expiredToken')

      // Mock successful token refresh
      cy.intercept('POST', 'https://accounts.spotify.com/api/token', {
        statusCode: 200,
        body: {
          access_token: 'new-access-token',
          expires_in: 3600,
          token_type: 'Bearer',
        },
      }).as('tokenRefresh')

      // Mock successful API call after refresh
      cy.intercept('GET', 'https://api.spotify.com/v1/me', {
        statusCode: 200,
        body: { id: 'user123', display_name: 'Test User' },
      }).as('userProfile')

      // Trigger API call that requires authentication
      cy.visit('/profile')

      // Verify token refresh flow
      cy.wait('@expiredToken')
      cy.wait('@tokenRefresh')
      cy.wait('@userProfile')
    })

    it('should handle refresh token failure', () => {
      // Mock failed token refresh
      cy.intercept('POST', 'https://accounts.spotify.com/api/token', {
        statusCode: 400,
        body: { error: 'invalid_grant' },
      }).as('refreshFailed')

      // Trigger API call that requires authentication
      cy.visit('/profile')

      // Verify user is redirected to login
      cy.wait('@refreshFailed')
      cy.url().should('include', '/login')
    })
  })

  describe('Authentication State', () => {
    it('should persist authentication state across page reloads', () => {
      // Mock successful authentication
      cy.intercept('GET', 'https://api.spotify.com/v1/me', {
        statusCode: 200,
        body: { id: 'user123', display_name: 'Test User' },
      }).as('userProfile')

      // Visit authenticated page
      cy.visit('/profile')
      cy.wait('@userProfile')

      // Reload page
      cy.reload()

      // Verify user is still authenticated
      cy.get('[data-testid="user-profile"]').should('be.visible')
    })

    it('should clear authentication state on logout', () => {
      // Mock successful logout
      cy.intercept('POST', '/api/logout', {
        statusCode: 200,
        body: { success: true },
      }).as('logout')

      // Click logout button
      cy.get('[data-testid="logout-button"]').click()

      // Verify logout request
      cy.wait('@logout')

      // Verify user is redirected to home page
      cy.url().should('eq', Cypress.config().baseUrl + '/')

      // Verify authentication state is cleared
      cy.get('[data-testid="login-button"]').should('be.visible')
    })
  })
})
