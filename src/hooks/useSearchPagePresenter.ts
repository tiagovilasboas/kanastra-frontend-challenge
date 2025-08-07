import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { SearchTab } from '@/components/ui/SearchTabs'
import { useSpotifySearch } from '@/hooks/useSpotifySearch'
import { useSearchStore } from '@/stores/searchStore'

interface UseSearchPagePresenterReturn {
  searchQuery: string
  searchState: ReturnType<typeof useSpotifySearch>['searchState']
  results: ReturnType<typeof useSpotifySearch>['results']
  hasResults: boolean
  tabs: SearchTab[]
  handleSectionClick: (type: string) => void
  handleTabChange: (tabId: string) => void
}

/**
 * Encapsula toda a lógica (estado + handlers) da página de busca principal.
 * A View (SearchPage) passa a ser puramente apresentacional.
 */
export function useSearchPagePresenter(): UseSearchPagePresenterReturn {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { searchQuery } = useSearchStore()

  const { searchState, results } = useSpotifySearch()

  // Se há resultados em pelo menos uma das coleções
  const hasResults =
    results.artists.items.length > 0 ||
    results.albums.items.length > 0 ||
    results.tracks.items.length > 0 ||
    results.playlists.items.length > 0 ||
    results.shows.items.length > 0 ||
    results.episodes.items.length > 0 ||
    results.audiobooks.items.length > 0

  const handleSectionClick = (type: string) => {
    const queryParams = new URLSearchParams({
      q: searchQuery,
      market: 'BR',
    })
    navigate(`/search/${type}?${queryParams.toString()}`)
  }

  // Tabs configuration
  const tabs: SearchTab[] = [
    { id: 'all', label: t('search:all', 'Tudo'), isActive: true },
    { id: 'playlist', label: t('search:playlists', 'Playlists') },
    { id: 'track', label: t('search:tracks', 'Músicas') },
    { id: 'artist', label: t('search:artists', 'Artistas') },
    { id: 'album', label: t('search:albums', 'Álbuns') },
    { id: 'show', label: t('search:shows', 'Podcasts e programas') },
    { id: 'episode', label: t('search:episodes', 'Episódios') },
  ]

  const handleTabChange = (tabId: string) => {
    if (tabId === 'all') return

    const queryParams = new URLSearchParams(searchParams)
    navigate(`/search/${tabId}?${queryParams.toString()}`)
  }

  return {
    searchQuery,
    searchState,
    results,
    hasResults,
    tabs,
    handleSectionClick,
    handleTabChange,
  }
}
