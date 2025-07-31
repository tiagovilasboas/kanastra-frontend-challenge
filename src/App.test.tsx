import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import App from './App'
import { AppProvider } from './app/providers/app-provider'

describe('App component', () => {
  it('renders header with title', () => {
    render(
      <AppProvider>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </AppProvider>,
    )

    const title = screen.getByRole('heading', {
      name: /kanastra frontend challenge/i,
    })
    expect(title).toBeInTheDocument()
  })
})
