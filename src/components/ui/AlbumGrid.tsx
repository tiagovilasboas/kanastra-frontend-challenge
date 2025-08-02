import { Search } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { HorizontalCard } from './HorizontalCard'

interface Album {
  id: string
  title: string
  artist?: string
  image?: string
  releaseDate: string
  trackCount: number
  albumType: string
}

interface AlbumGridProps {
  albums: Album[]
  title?: string
  onAlbumClick?: (id: string) => void
  onSearch?: (query: string) => void
  totalCount?: number
  currentCount?: number
  className?: string
}

export const AlbumGrid: React.FC<AlbumGridProps> = ({
  albums,
  title,
  onAlbumClick,
  onSearch,
  className = '',
}) => {
  const { t } = useTranslation()
  const defaultTitle = t('ui:albums.title', 'Álbuns')
  const [searchQuery, setSearchQuery] = React.useState('')

  const filteredAlbums = albums.filter(album =>
    album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (album.artist && album.artist.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    onSearch?.(query)
  }

  return (
    <div className={`album-grid-container ${className}`}>
      {/* Header */}
      <div className="album-grid-header">
        <div className="album-grid-title-section">
          <h1 className="album-grid-title">{title || defaultTitle}</h1>
          <span className="album-grid-counter">
            {t('ui:albums.counter', '{{count}} de {{total}}', { count: filteredAlbums.length, total: albums.length })}
          </span>
        </div>
        
        {/* Search Bar */}
        <div className="album-grid-search">
          <div className="album-grid-search-input">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder={t('ui:albums.filterPlaceholder', 'Filtrar álbuns...')}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="album-grid-search-field"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="album-grid">
        {filteredAlbums.map((album) => (
          <HorizontalCard
            key={album.id}
            id={album.id}
            title={album.title}
            subtitle={album.artist}
            image={album.image}
            onClick={() => onAlbumClick?.(album.id)}
            showDetails={true}
            releaseDate={album.releaseDate}
            trackCount={album.trackCount}
            albumType={album.albumType}
            className="album-grid-card"
          />
        ))}
      </div>

      {filteredAlbums.length === 0 && (
        <div className="album-grid-empty">
          <p>{t('ui:albums.noAlbumsFound', 'Nenhum álbum encontrado')}</p>
        </div>
      )}
    </div>
  )
} 