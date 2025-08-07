import { AlertCircle, Search } from 'lucide-react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { SearchHeader } from '@/components/search'
import { TrackList } from '@/components/ui'
import { GridSkeleton, TrackListSkeleton } from '@/components/ui'
import { AlbumCard } from '@/components/ui/AlbumCard'
import { ArtistCard } from '@/components/ui/ArtistCard'
import { AudiobookCard } from '@/components/ui/AudiobookCard'
import { Card, CardContent } from '@/components/ui/card'
import { EpisodeCard } from '@/components/ui/EpisodeCard'
import { LoadMoreButton } from '@/components/ui/LoadMoreButton'
import { PlaylistCard } from '@/components/ui/PlaylistCard'
import { ShowCard } from '@/components/ui/ShowCard'
import { SimpleFilterInput } from '@/components/ui/SimpleFilterInput'
import { TypeSelector } from '@/components/ui/TypeSelector'
import { useSpotifySearchByType } from '@/hooks/useSpotifySearchByType'
import { SpotifySearchType } from '@/types/spotify'
import {
  SpotifyAlbum,
  SpotifyArtist,
  SpotifyAudiobook,
  SpotifyEpisode,
  SpotifyPlaylist,
  SpotifyShow,
  SpotifyTrack,
} from '@/types/spotify'

// Mapeamento de tipos da URL para tipos da API
const URL_TYPE_TO_API_TYPE = {
  artist: SpotifySearchType.ARTIST,
  artists: SpotifySearchType.ARTIST,
  album: SpotifySearchType.ALBUM,
  albums: SpotifySearchType.ALBUM,
  playlist: SpotifySearchType.PLAYLIST,
  playlists: SpotifySearchType.PLAYLIST,
  track: SpotifySearchType.TRACK,
  tracks: SpotifySearchType.TRACK,
  show: SpotifySearchType.SHOW,
  shows: SpotifySearchType.SHOW,
  episode: SpotifySearchType.EPISODE,
  episodes: SpotifySearchType.EPISODE,
  audiobook: SpotifySearchType.AUDIOBOOK,
  audiobooks: SpotifySearchType.AUDIOBOOK,
} as const

export const SearchByTypePage: React.FC = () => {
  const { type } = useParams<{ type: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const query = searchParams.get('q') || ''
  const market = searchParams.get('market') || 'BR'

  // Estado para o filtro local
  const [localFilter, setLocalFilter] = useState('')

  // Debug URL parameters
  if (import.meta.env.DEV) {
    console.log('🔍 SearchByTypePage URL Debug:', {
      type,
      searchParams: Object.fromEntries(searchParams.entries()),
      query,
      market,
      fullUrl: window.location.href,
      queryLength: query.length,
      queryTrimmed: query.trim(),
      hasQuery: !!query.trim(),
    })
  }

  // Converte o tipo da URL para o tipo da API
  const apiType = type
    ? URL_TYPE_TO_API_TYPE[type as keyof typeof URL_TYPE_TO_API_TYPE]
    : null

  // Hook para busca infinita - sempre chamado, mas só usado se apiType for válido
  const { flatItems, isFetching, fetchNextPage, hasNextPage, total } =
    useSpotifySearchByType({
      q: query,
      type: apiType || SpotifySearchType.ARTIST, // fallback para evitar erro
      market,
      includeExternal: false,
    })

  // Filtra os itens baseado no filtro local
  const filteredItems = flatItems.filter((item: unknown) => {
    if (!localFilter.trim()) return true

    const itemName = (item as { name?: string })?.name || ''
    return itemName.toLowerCase().includes(localFilter.toLowerCase())
  })

  // Mapeamento de placeholders para cada tipo
  const getFilterPlaceholder = () => {
    switch (apiType) {
      case SpotifySearchType.ARTIST:
        return 'search:filterArtists'
      case SpotifySearchType.ALBUM:
        return 'search:filterAlbums'
      case SpotifySearchType.TRACK:
        return 'search:filterTracks'
      case SpotifySearchType.PLAYLIST:
        return 'search:filterPlaylists'
      case SpotifySearchType.SHOW:
        return 'search:filterShows'
      case SpotifySearchType.EPISODE:
        return 'search:filterEpisodes'
      case SpotifySearchType.AUDIOBOOK:
        return 'search:filterAudiobooks'
      default:
        return 'search:filterItems'
    }
  }

  if (!apiType) {
    return (
      <div className="min-h-screen bg-background p-3 sm:p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="flex items-center gap-3 p-6">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <div>
                <h3 className="font-semibold text-destructive">
                  {t('search:invalidType', 'Tipo de busca inválido')}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t(
                    'search:invalidTypeDescription',
                    'O tipo de busca especificado não é válido.',
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Usar flatItems diretamente
  const allItems = filteredItems
  const totalItems = total

  // Debug logs
  if (import.meta.env.DEV) {
    console.log('🔍 SearchByTypePage Debug:', {
      query,
      apiType,
      market,
      allItems: allItems.length,
      totalItems,
      hasNextPage,
      localFilter,
    })
  }

  // Renderiza os itens baseado no tipo
  const renderItems = () => {
    // Show skeletons while fetching first page
    if (isFetching && flatItems.length === 0) {
      const skeletonMap: Partial<
        Record<SpotifySearchType, React.ReactElement>
      > = {
        [SpotifySearchType.ARTIST]: <GridSkeleton shape="circle" count={20} />,
        [SpotifySearchType.ALBUM]: <GridSkeleton count={20} />,
        [SpotifySearchType.TRACK]: <TrackListSkeleton rows={20} />,
        [SpotifySearchType.PLAYLIST]: <GridSkeleton count={20} />,
        [SpotifySearchType.SHOW]: <GridSkeleton count={20} />,
        [SpotifySearchType.EPISODE]: <GridSkeleton count={20} />,
        [SpotifySearchType.AUDIOBOOK]: <GridSkeleton />,
      }
      return apiType ? skeletonMap[apiType] : null
    }
    // Special rendering for tracks: use TrackList like in Artist page
    if (apiType === SpotifySearchType.TRACK) {
      return (
        <div className="space-y-6">
          <TrackList
            tracks={allItems as SpotifyTrack[]}
            onTrackClick={(track) => {
              if (track.external_urls?.spotify) {
                window.open(
                  track.external_urls.spotify,
                  '_blank',
                  'noopener,noreferrer',
                )
              }
            }}
          />
          {hasNextPage && (
            <div className="flex justify-center pt-4">
              <LoadMoreButton
                onLoadMore={fetchNextPage}
                isLoading={isFetching}
                hasMore={hasNextPage}
                totalResults={totalItems}
                currentCount={allItems.length}
              />
            </div>
          )}
        </div>
      )
    }
    if (allItems.length === 0) {
      return (
        <Card className="text-center">
          <CardContent className="p-8">
            <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {localFilter.trim()
                ? t(
                    'search:noFilteredResultsTitle',
                    'Nenhum resultado encontrado para o filtro',
                  )
                : t('search:noResultsTitle', 'Nenhum resultado encontrado')}
            </h3>
            <p className="text-muted-foreground">
              {localFilter.trim()
                ? t(
                    'search:noFilteredResultsDescription',
                    'Não encontramos resultados para "{{query}}" com o filtro "{{filter}}". Tente com outras palavras-chave.',
                    { query, filter: localFilter },
                  )
                : t(
                    'search:noResultsDescription',
                    'Não encontramos resultados para "{{query}}". Tente com outras palavras-chave.',
                    { query },
                  )}
            </p>
          </CardContent>
        </Card>
      )
    }

    // Handlers para navegação
    const handleArtistClick = (artistId: string) => {
      navigate(`/artist/${artistId}`)
    }

    const handleItemClick = (item: unknown) => {
      const spotifyItem = item as { external_urls?: { spotify?: string } }
      if (spotifyItem.external_urls?.spotify) {
        window.open(
          spotifyItem.external_urls.spotify,
          '_blank',
          'noopener,noreferrer',
        )
      }
    }

    return (
      <div className="space-y-4">
        {/* Lista de itens com cards específicos */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {allItems
            .filter(
              (item): item is NonNullable<typeof item> =>
                item !== null && item !== undefined,
            )
            .map((item: unknown, index: number) => {
              switch (apiType) {
                case SpotifySearchType.ARTIST:
                  return (
                    <ArtistCard
                      key={`${(item as SpotifyArtist).id}-${index}`}
                      artist={item as SpotifyArtist}
                      onClick={() =>
                        handleArtistClick((item as SpotifyArtist).id)
                      }
                    />
                  )

                case SpotifySearchType.ALBUM:
                  return (
                    <AlbumCard
                      key={`${(item as SpotifyAlbum).id}-${index}`}
                      album={item as SpotifyAlbum}
                      onClick={() => handleItemClick(item)}
                    />
                  )

                case SpotifySearchType.PLAYLIST:
                  return (
                    <PlaylistCard
                      key={`${(item as SpotifyPlaylist).id}-${index}`}
                      playlist={item as SpotifyPlaylist}
                      onClick={() => handleItemClick(item)}
                    />
                  )

                case SpotifySearchType.SHOW:
                  return (
                    <ShowCard
                      key={`${(item as SpotifyShow).id}-${index}`}
                      show={item as SpotifyShow}
                      onClick={() => handleItemClick(item)}
                    />
                  )

                case SpotifySearchType.EPISODE:
                  return (
                    <EpisodeCard
                      key={`${(item as SpotifyEpisode).id}-${index}`}
                      episode={item as SpotifyEpisode}
                      onClick={() => handleItemClick(item)}
                    />
                  )

                case SpotifySearchType.AUDIOBOOK:
                  return (
                    <AudiobookCard
                      key={`${(item as SpotifyAudiobook).id}-${index}`}
                      audiobook={item as SpotifyAudiobook}
                      onClick={() => handleItemClick(item)}
                    />
                  )

                default:
                  return (
                    <div
                      key={`${(item as SpotifyArtist | SpotifyAlbum | SpotifyPlaylist | SpotifyShow | SpotifyEpisode | SpotifyAudiobook | SpotifyTrack).id}-${index}`}
                      className="bg-card rounded-lg p-4 border"
                    >
                      <div className="space-y-2">
                        <div className="aspect-square bg-muted rounded-md mb-2" />
                        <h3 className="font-medium text-sm line-clamp-2">
                          {
                            (
                              item as
                                | SpotifyArtist
                                | SpotifyAlbum
                                | SpotifyPlaylist
                                | SpotifyShow
                                | SpotifyEpisode
                                | SpotifyAudiobook
                                | SpotifyTrack
                            ).name
                          }
                        </h3>
                      </div>
                    </div>
                  )
              }
            })}
        </div>

        {/* Botão "Carregar mais" */}
        {hasNextPage && (
          <div className="flex justify-center pt-4">
            <LoadMoreButton
              onLoadMore={fetchNextPage}
              isLoading={isFetching}
              hasMore={hasNextPage}
              totalResults={totalItems}
              currentCount={allItems.length}
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Header */}
        <SearchHeader />

        {/* Type Selector and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <TypeSelector />
          <SimpleFilterInput
            value={localFilter}
            onChange={setLocalFilter}
            placeholderKey={getFilterPlaceholder()}
            className="w-full sm:w-auto"
          />
        </div>

        {/* Results */}
        {renderItems()}

        {/* Results Count */}
        {allItems.length > 0 && (
          <div className="text-sm text-muted-foreground text-center">
            {localFilter.trim()
              ? t(
                  'search:showingFilteredResults',
                  'Mostrando {{count}} resultados filtrados de {{total}}',
                  {
                    count: allItems.length,
                    total: flatItems.length,
                  },
                )
              : t('search:showingResults', 'Mostrando {{count}} de {{total}}', {
                  count: allItems.length,
                  total: totalItems,
                })}
          </div>
        )}
      </div>
    </div>
  )
}
