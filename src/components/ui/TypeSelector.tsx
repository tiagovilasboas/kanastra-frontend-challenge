import React from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import { useSearchStore } from '@/stores/searchStore'
import { SpotifySearchType } from '@/types/spotify'

import { Button } from './button'

// Mapeamento de tipos da API para tabs
const TYPE_TO_TAB_MAP = {
  [SpotifySearchType.ARTIST]: 'artists',
  [SpotifySearchType.ALBUM]: 'albums',
  [SpotifySearchType.PLAYLIST]: 'playlists',
  [SpotifySearchType.TRACK]: 'musicas',
  [SpotifySearchType.SHOW]: 'podcasts',
  [SpotifySearchType.EPISODE]: 'episodios',
} as const

export type TabType =
  | 'all'
  | 'artists'
  | 'albums'
  | 'playlists'
  | 'musicas'
  | 'podcasts'
  | 'episodios'

interface TypeSelectorProps {
  className?: string
}

export const TypeSelector: React.FC<TypeSelectorProps> = ({ className }) => {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const { searchQuery } = useSearchStore()

  // Extrai parâmetros da URL - prioriza query da URL, depois do store
  const searchParams = new URLSearchParams(location.search)
  const urlQuery = searchParams.get('q')
  const storeQuery = searchQuery || ''
  const query = urlQuery || storeQuery || ''
  const market = searchParams.get('market') || 'BR'

  // Debug logging for query extraction
  if (import.meta.env.DEV) {
    console.log('🔍 TypeSelector - Query extraction:', {
      urlQuery: searchParams.get('q'),
      storeQuery: searchQuery,
      finalQuery: query,
      market,
      location: location.pathname + location.search,
    })
  }

  // Determina a tab ativa baseada na URL
  const getActiveTab = (): TabType => {
    const path = location.pathname

    // Debug logging
    if (import.meta.env.DEV) {
      console.log('🔍 TypeSelector - getActiveTab:', {
        path,
        searchParams: Object.fromEntries(searchParams.entries()),
        query,
        searchQuery,
      })
    }

    // Se está em /search, verifica se há um tipo específico na query
    if (path === '/search') {
      const type = searchParams.get('type')
      if (type && type in TYPE_TO_TAB_MAP) {
        return TYPE_TO_TAB_MAP[type as keyof typeof TYPE_TO_TAB_MAP]
      }
      return 'all'
    }

    // Se está em uma rota específica, mapeia para a tab correspondente
    if (path === '/search/artist' || path === '/search/artists')
      return 'artists'
    if (path === '/search/album' || path === '/search/albums') return 'albums'
    if (path === '/search/playlist' || path === '/search/playlists')
      return 'playlists'
    if (path === '/search/track' || path === '/search/tracks') return 'musicas'
    if (path === '/search/show' || path === '/search/shows') return 'podcasts'
    if (path === '/search/episode' || path === '/search/episodes')
      return 'episodios'

    return 'all'
  }

  const activeTab = getActiveTab()

  // Navega para a tab selecionada
  const handleTabChange = (tab: TabType) => {
    // Sempre usa a query disponível (URL ou store)
    const currentQuery = query || searchQuery || ''

    if (!currentQuery.trim()) {
      // Debug logging for empty query
      if (import.meta.env.DEV) {
        console.log(
          '🔍 TypeSelector - handleTabChange: No query, skipping navigation',
          {
            tab,
            query,
            searchQuery,
            currentQuery,
          },
        )
      }
      return // Não navega se não há query
    }

    const newParams = new URLSearchParams()
    newParams.set('q', currentQuery)
    newParams.set('market', market)

    if (import.meta.env.DEV) {
      console.log('🔍 TypeSelector - URL construction:', {
        currentQuery,
        market,
        newParams: newParams.toString(),
        hasQuery: !!currentQuery,
        queryLength: currentQuery.length,
      })
    }

    let finalUrl: string

    if (tab === 'all') {
      // Para "All", vai para /search com query params
      finalUrl = `/search?${newParams.toString()}`
    } else {
      // Para tipos específicos, vai para /search/:type com query params
      // Mapeia para o formato correto da URL
      const urlTypeMap = {
        artists: 'artist',
        albums: 'album',
        playlists: 'playlist',
        musicas: 'track',
        podcasts: 'show',
        episodios: 'episode',
        audiobooks: 'audiobook',
      }
      const urlType = urlTypeMap[tab] || tab
      finalUrl = `/search/${urlType}?${newParams.toString()}`
    }

    // Enhanced debug logging
    if (import.meta.env.DEV) {
      console.log('🔍 TypeSelector - Navigation Debug:', {
        currentPath: location.pathname,
        currentSearch: location.search,
        tab,
        query,
        searchQuery,
        currentQuery,
        market,
        finalUrl,
        newParams: newParams.toString(),
        timestamp: new Date().toISOString(),
      })
    }

    // Navigate immediately without delay
    if (import.meta.env.DEV) {
      console.log('🔍 TypeSelector - About to navigate to:', finalUrl)
    }
    navigate(finalUrl)
  }

  const tabs = [
    { id: 'all' as const, label: t('search:all', 'Tudo') },
    { id: 'playlists' as const, label: t('search:playlists', 'Playlists') },
    { id: 'musicas' as const, label: t('search:tracks', 'Músicas') },
    { id: 'artists' as const, label: t('search:artists', 'Artistas') },
    { id: 'albums' as const, label: t('search:albums', 'Álbuns') },
    { id: 'podcasts' as const, label: t('search:shows', 'Podcasts') },
    { id: 'episodios' as const, label: t('search:episodes', 'Episódios') },
  ]

  return (
    <div className={`flex flex-wrap gap-2 ${className || ''}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id

        return (
          <Button
            key={tab.id}
            variant={isActive ? 'default' : 'secondary'}
            size="sm"
            onClick={() => handleTabChange(tab.id)}
            disabled={!query} // Desabilita se não há query
            className={`px-4 py-2 rounded-full transition-all duration-200 font-medium ${
              isActive
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            } ${!query ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {tab.label}
          </Button>
        )
      })}
    </div>
  )
}
