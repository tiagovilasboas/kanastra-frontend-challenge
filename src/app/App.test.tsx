import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { AppProvider } from '../app/providers/app-provider'
import App from './App'

describe('App component', () => {
  it('renders main content area', () => {
    render(
      <AppProvider>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </AppProvider>,
    )

    const mainContent = screen.getByRole('main')
    expect(mainContent).toBeInTheDocument()
    expect(mainContent).toHaveClass('main-content')
  })
})
