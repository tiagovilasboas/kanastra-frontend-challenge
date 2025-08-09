import React from 'react'

interface AlbumCardProps {
  album: {
    id: string
    name: string
    images?: Array<{ url: string; width?: number; height?: number }>
    artists: Array<{ name: string }>
    release_date?: string
  }
  onClick?: () => void
  className?: string
}

const AlbumCardComponent: React.FC<AlbumCardProps> = ({
  album,
  onClick,
  className = '',
}) => {
  const releaseYear = album.release_date
    ? new Date(album.release_date).getFullYear()
    : undefined

  return (
    <div
      className={`group cursor-pointer ${className}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.()
        }
      }}
    >
      <div className="space-y-3">
        {/* Square Image */}
        <div className="relative aspect-square w-full">
          <img
            src={album.images?.[0]?.url || '/placeholder-album.png'}
            alt={album.name}
            className="w-full h-full object-cover rounded-lg shadow-lg group-hover:shadow-xl transition-shadow duration-200"
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition-colors duration-200 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg">
                <svg
                  className="w-6 h-6 text-primary-foreground ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-1">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {album.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {album.artists.map((artist) => artist.name).join(', ')}
          </p>
          {releaseYear && (
            <p className="text-sm text-muted-foreground">{releaseYear}</p>
          )}
        </div>
      </div>
    </div>
  )
}

AlbumCardComponent.displayName = 'AlbumCard'

export const AlbumCard = React.memo(AlbumCardComponent)
