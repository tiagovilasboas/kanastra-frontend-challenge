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

  // Extrai parâmetros da URL
  const searchParams = new URLSearchParams(location.search)
  const query = searchParams.get('q') || searchQuery || ''
  const market = searchParams.get('market') || 'BR'

  // Determina a tab ativa baseada na URL
  const getActiveTab = (): TabType => {
    const path = location.pathname

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
    if (!query) return // Não navega se não há query

    const newParams = new URLSearchParams()
    newParams.set('q', query)
    newParams.set('market', market)

    if (tab === 'all') {
      // Para "All", vai para /search com query params
      navigate(`/search?${newParams.toString()}`)
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
      const finalUrl = `/search/${urlType}?${newParams.toString()}`

      // Debug log
      if (import.meta.env.DEV) {
        console.log('🔍 TypeSelector Navigation Debug:', {
          tab,
          urlType,
          finalUrl,
          query,
          market,
        })
      }

      navigate(finalUrl)
    }
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
