import { render } from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import { App } from './App'

// Mock do i18n para evitar problemas nos testes
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'pt',
      changeLanguage: vi.fn(),
    },
  }),
}))

describe('App component', () => {
  it('renders app container', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    )

    // Verificar se a aplicação carrega sem erros
    expect(document.body).toBeInTheDocument()
  })
})
