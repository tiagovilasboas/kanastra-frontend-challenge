import { User } from 'lucide-react'
import React from 'react'

// Artist Item Component
interface ArtistItemProps {
  artist: any
  onClick?: () => void
}

export const ArtistItem: React.FC<ArtistItemProps> = ({ artist, onClick }) => {
  return (
    <div className="text-center space-y-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={onClick}>
      <div className="w-16 h-16 mx-auto rounded-full overflow-hidden">
        {artist.images?.[0] ? (
          <img
            src={artist.images[0].url}
            alt={artist.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <User className="h-6 w-6" />
          </div>
        )}
      </div>
      <div>
        <h4 className="font-medium text-sm text-foreground truncate">{artist.name}</h4>
        <p className="text-xs text-muted-foreground">Artista</p>
      </div>
    </div>
  )
} 