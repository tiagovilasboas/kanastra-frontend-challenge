import React from 'react'

import { AlbumsSection } from '@/components/search/AlbumsSection'
import { ArtistsSection } from '@/components/search/ArtistsSection'
import { EpisodesSection } from '@/components/search/EpisodesSection'
import { PlaylistsSection } from '@/components/search/PlaylistsSection'
import { ShowsSection } from '@/components/search/ShowsSection'
import { AggregatedSearchResults } from '@/services/SearchService'

interface SearchSectionsProps {
  /** Resultado completo retornado pelo hook useSpotifySearch */
  results: AggregatedSearchResults
  /** Callback para navegação quando o usuário clica em “Ver tudo” de cada seção */
  onSectionClick: (type: string) => void
}

/**
 * Renderiza dinamicamente as seções de resultados (artistas, álbuns, playlists…)
 * respeitando o princípio SRP: esta responsabilidade sai da página e fica
 * concentrada em um componente dedicado.
 */
export const SearchSections: React.FC<SearchSectionsProps> = ({
  results,
  onSectionClick,
}) => {
  return (
    <>
      {/* Artists Section */}
      {results.artists.items.length > 0 && (
        <ArtistsSection
          artists={results.artists.items}
          onSectionClick={() => onSectionClick('artist')}
        />
      )}

      {/* Albums Section */}
      {results.albums.items.length > 0 && (
        <AlbumsSection
          albums={results.albums.items}
          onSectionClick={() => onSectionClick('album')}
        />
      )}

      {/* Playlists Section */}
      {results.playlists.items.length > 0 && (
        <PlaylistsSection
          playlists={results.playlists.items}
          onSectionClick={() => onSectionClick('playlist')}
        />
      )}

      {/* Shows Section */}
      {results.shows.items.length > 0 && (
        <ShowsSection
          shows={results.shows.items}
          onSectionClick={() => onSectionClick('show')}
          total={results.shows.total}
        />
      )}

      {/* Episodes Section */}
      {results.episodes.items.length > 0 && (
        <EpisodesSection
          episodes={results.episodes.items}
          onSectionClick={() => onSectionClick('episode')}
          total={results.episodes.total}
        />
      )}
    </>
  )
}
