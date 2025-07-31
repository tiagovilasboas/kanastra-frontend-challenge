import '@testing-library/jest-dom'

import { MantineProvider } from '@mantine/core'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import App from './App'

describe('App component', () => {
  it('renders header with title', () => {
    render(
      <MantineProvider>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </MantineProvider>,
    )

    const title = screen.getByRole('heading', {
      name: /kanastra frontend challenge/i,
    })
    expect(title).toBeInTheDocument()
  })
})
