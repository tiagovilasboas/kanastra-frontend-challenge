/* eslint-disable formatjs/no-literal-string-in-jsx */
import { MantineProvider } from '@mantine/core'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import App from './App'

// Mock the Greeting component
vi.mock('@/features/greeter/components/Greeting', () => ({
  Greeting: () => (
    <div data-testid="greeting-component">Greeting Component</div>
  ),
}))

describe('App component', () => {
  it('renders header and theme toggle button', () => {
    render(
      <MantineProvider defaultColorScheme="light">
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </MantineProvider>,
    )

    const logo = screen.getByRole('link', { name: /react boilerplate/i })
    expect(logo).toBeInTheDocument()

    const themeToggleButton = screen.getByRole('button', {
      name: /alternar tema/i,
    })
    expect(themeToggleButton).toBeInTheDocument()
  })
})
