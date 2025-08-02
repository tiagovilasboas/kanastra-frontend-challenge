import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent,render, screen } from '@testing-library/react'
import { beforeEach,describe, expect, it, vi } from 'vitest'

import { SpotifyArtist } from '@/types/spotify'

import { ArtistCard } from '../ArtistCard'

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      // Handle specific translation keys for tests
      if (key === 'ui:artistCard.popularityWithValue') {
        return `${options?.value || 0}%`
      }
      if (key === 'ui:artistCard.popularity') {
        return 'Popularidade'
      }
      if (key === 'ui:artistCard.followers') {
        return 'Seguidores'
      }
      if (key === 'ui:artistCard.playArtist') {
        return 'Reproduzir artista'
      }
      if (key === 'searchInput:clearSearch') {
        return 'Limpar busca'
      }
      return key
    },
    i18n: {
      language: 'pt',
      changeLanguage: vi.fn(),
    },
  }),
}))

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}))

// Helper function to render with QueryClient
const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  )
}

describe('ArtistCard', () => {
  const mockArtist: SpotifyArtist = {
    id: 'artist-123',
    name: 'Drake',
    images: [
      {
        url: 'https://example.com/drake.jpg',
        height: 300,
        width: 300,
      },
    ],
    popularity: 95,
    followers: {
      total: 50000000,
    },
    genres: ['hip-hop', 'rap', 'r&b'],
    external_urls: {
      spotify: 'https://open.spotify.com/artist/drake',
    },
  }

  const mockOnClick = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render artist name', () => {
      renderWithQueryClient(<ArtistCard artist={mockArtist} onClick={mockOnClick} />)
      
      expect(screen.getByText('Drake')).toBeInTheDocument()
    })

    it('should render artist image', () => {
      renderWithQueryClient(<ArtistCard artist={mockArtist} onClick={mockOnClick} />)
      
      const image = screen.getByAltText('Drake')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('src', 'https://example.com/drake.jpg')
    })

    it('should render popularity badge', () => {
      renderWithQueryClient(<ArtistCard artist={mockArtist} onClick={mockOnClick} />)
      
      expect(screen.getByText('95%')).toBeInTheDocument()
    })

    it('should render followers count when showFollowers is true', () => {
      renderWithQueryClient(<ArtistCard artist={mockArtist} onClick={mockOnClick} showFollowers={true} />)
      
      expect(screen.getByText('50.0M')).toBeInTheDocument()
    })

    it('should render genres when showGenres is true', () => {
      renderWithQueryClient(<ArtistCard artist={mockArtist} onClick={mockOnClick} showGenres={true} />)
      
      expect(screen.getByText('Hip-hop')).toBeInTheDocument()
      expect(screen.getByText('Rap')).toBeInTheDocument()
      expect(screen.getByText('R&B')).toBeInTheDocument()
    })
  })

  describe('image handling', () => {
    it('should use fallback image when no images provided', () => {
      const artistWithoutImages = { ...mockArtist, images: [] }
      renderWithQueryClient(<ArtistCard artist={artistWithoutImages} onClick={mockOnClick} />)
      
      const image = screen.getByAltText('Drake')
      expect(image).toHaveAttribute('src', '/placeholder-artist.jpg')
    })

    it('should use first image from array', () => {
      const artistWithMultipleImages = {
        ...mockArtist,
        images: [
          { url: 'https://example.com/drake1.jpg', height: 300, width: 300 },
          { url: 'https://example.com/drake2.jpg', height: 300, width: 300 },
        ],
      }
      renderWithQueryClient(<ArtistCard artist={artistWithMultipleImages} onClick={mockOnClick} />)
      
      const image = screen.getByAltText('Drake')
      expect(image).toHaveAttribute('src', 'https://example.com/drake1.jpg')
    })

    it('should handle image load error', () => {
      renderWithQueryClient(<ArtistCard artist={mockArtist} onClick={mockOnClick} />)
      
      const image = screen.getByAltText('Drake')
      fireEvent.error(image)
      
      expect(image).toHaveAttribute('src', '/placeholder-artist.jpg')
    })
  })

  describe('popularity display', () => {
    it('should display high popularity correctly', () => {
      const highPopularityArtist = { ...mockArtist, popularity: 100 }
      renderWithQueryClient(<ArtistCard artist={highPopularityArtist} onClick={mockOnClick} />)
      
      expect(screen.getByText('100%')).toBeInTheDocument()
    })

    it('should display low popularity correctly', () => {
      const lowPopularityArtist = { ...mockArtist, popularity: 10 }
      renderWithQueryClient(<ArtistCard artist={lowPopularityArtist} onClick={mockOnClick} />)
      
      expect(screen.getByText('10%')).toBeInTheDocument()
    })

    it('should handle undefined popularity', () => {
      const artistWithoutPopularity = { ...mockArtist, popularity: undefined }
      renderWithQueryClient(<ArtistCard artist={artistWithoutPopularity} onClick={mockOnClick} />)
      
      expect(screen.queryByText(/%/)).not.toBeInTheDocument()
    })
  })

  describe('followers display', () => {
    it('should format millions correctly', () => {
      const artistWithMillions = { ...mockArtist, followers: { total: 25000000 } }
      renderWithQueryClient(<ArtistCard artist={artistWithMillions} onClick={mockOnClick} showFollowers={true} />)
      
      expect(screen.getByText('25.0M')).toBeInTheDocument()
    })

    it('should format thousands correctly', () => {
      const artistWithThousands = { ...mockArtist, followers: { total: 25000 } }
      renderWithQueryClient(<ArtistCard artist={artistWithThousands} onClick={mockOnClick} showFollowers={true} />)
      
      expect(screen.getByText('25.0K')).toBeInTheDocument()
    })

    it('should format small numbers correctly', () => {
      const artistWithSmallNumber = { ...mockArtist, followers: { total: 250 } }
      renderWithQueryClient(<ArtistCard artist={artistWithSmallNumber} onClick={mockOnClick} showFollowers={true} />)
      
      expect(screen.getByText('250')).toBeInTheDocument()
    })

    it('should handle undefined followers', () => {
      const artistWithoutFollowers = { ...mockArtist, followers: undefined }
      renderWithQueryClient(<ArtistCard artist={artistWithoutFollowers} onClick={mockOnClick} showFollowers={true} />)
      
      expect(screen.queryByText(/M|K|\d+/)).not.toBeInTheDocument()
    })
  })

  describe('genres display', () => {
    it('should display multiple genres', () => {
      renderWithQueryClient(<ArtistCard artist={mockArtist} onClick={mockOnClick} showGenres={true} />)
      
      expect(screen.getByText('Hip-hop')).toBeInTheDocument()
      expect(screen.getByText('Rap')).toBeInTheDocument()
      expect(screen.getByText('R&B')).toBeInTheDocument()
    })

    it('should handle empty genres array', () => {
      const artistWithoutGenres = { ...mockArtist, genres: [] }
      renderWithQueryClient(<ArtistCard artist={artistWithoutGenres} onClick={mockOnClick} showGenres={true} />)
      
      expect(screen.queryByText(/hip-hop|rap|r&b/)).not.toBeInTheDocument()
    })

    it('should handle undefined genres', () => {
      const artistWithoutGenres = { ...mockArtist, genres: undefined }
      renderWithQueryClient(<ArtistCard artist={artistWithoutGenres} onClick={mockOnClick} showGenres={true} />)
      
      expect(screen.queryByText(/hip-hop|rap|r&b/)).not.toBeInTheDocument()
    })

    it('should limit displayed genres', () => {
      const artistWithManyGenres = {
        ...mockArtist,
        genres: ['genre1', 'genre2', 'genre3', 'genre4', 'genre5', 'genre6'],
      }
      renderWithQueryClient(<ArtistCard artist={artistWithManyGenres} onClick={mockOnClick} showGenres={true} />)
      
      expect(screen.getByText('Genre1')).toBeInTheDocument()
      expect(screen.getByText('Genre2')).toBeInTheDocument()
      expect(screen.getByText('Genre3')).toBeInTheDocument()
      expect(screen.queryByText('genre4')).not.toBeInTheDocument()
      expect(screen.queryByText('genre5')).not.toBeInTheDocument()
      expect(screen.queryByText('genre6')).not.toBeInTheDocument()
    })
  })

  describe('interactions', () => {
    it('should call onClick when card is clicked', () => {
      renderWithQueryClient(<ArtistCard artist={mockArtist} onClick={mockOnClick} />)
      
      const card = screen.getByTestId('artist-card')
      fireEvent.click(card)
      
      expect(mockOnClick).toHaveBeenCalledWith(mockArtist)
    })

    it('should call onClick when Enter key is pressed', () => {
      renderWithQueryClient(<ArtistCard artist={mockArtist} onClick={mockOnClick} />)
      
      const card = screen.getByTestId('artist-card')
      fireEvent.keyDown(card, { key: 'Enter', code: 'Enter' })
      
      expect(mockOnClick).toHaveBeenCalledWith(mockArtist)
    })

    it('should not call onClick when other keys are pressed', () => {
      renderWithQueryClient(<ArtistCard artist={mockArtist} onClick={mockOnClick} />)
      
      const card = screen.getByTestId('artist-card')
      fireEvent.keyDown(card, { key: 'Space', code: 'Space' })
      
      expect(mockOnClick).not.toHaveBeenCalled()
    })
  })

  describe('accessibility', () => {
    it('should have proper tabindex', () => {
      renderWithQueryClient(<ArtistCard artist={mockArtist} onClick={mockOnClick} />)
      
      const card = screen.getByTestId('artist-card')
      expect(card).toHaveAttribute('tabindex', '0')
    })

    it('should have proper alt text for image', () => {
      renderWithQueryClient(<ArtistCard artist={mockArtist} onClick={mockOnClick} />)
      
      const image = screen.getByAltText('Drake')
      expect(image).toBeInTheDocument()
    })
  })



  describe('edge cases', () => {
    it('should handle artist with very long name', () => {
      const artistWithLongName = { ...mockArtist, name: 'A'.repeat(100) }
      renderWithQueryClient(<ArtistCard artist={artistWithLongName} onClick={mockOnClick} />)
      
      expect(screen.getByText('A'.repeat(100))).toBeInTheDocument()
    })

    it('should handle artist with special characters in name', () => {
      const artistWithSpecialChars = { ...mockArtist, name: 'Drake & Future' }
      renderWithQueryClient(<ArtistCard artist={artistWithSpecialChars} onClick={mockOnClick} />)
      
      expect(screen.getByText('Drake & Future')).toBeInTheDocument()
    })

    it('should handle artist with emoji in name', () => {
      const artistWithEmoji = { ...mockArtist, name: '🎵 Drake 🎶' }
      renderWithQueryClient(<ArtistCard artist={artistWithEmoji} onClick={mockOnClick} />)
      
      expect(screen.getByText('🎵 Drake 🎶')).toBeInTheDocument()
    })

    it('should handle zero followers', () => {
      const artistWithZeroFollowers = { ...mockArtist, followers: { total: 0 } }
      renderWithQueryClient(<ArtistCard artist={artistWithZeroFollowers} onClick={mockOnClick} showFollowers={true} />)
      
      expect(screen.getByText('0')).toBeInTheDocument()
    })

    it('should handle very large follower count', () => {
      const artistWithLargeFollowers = { ...mockArtist, followers: { total: 999999999 } }
      renderWithQueryClient(<ArtistCard artist={artistWithLargeFollowers} onClick={mockOnClick} showFollowers={true} />)
      
      expect(screen.getByText('1000.0M')).toBeInTheDocument()
    })
  })


}) 