import { Image as ImageIcon, Music } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface PlaceholderImageProps {
  type?:
    | 'artist'
    | 'album'
    | 'track'
    | 'playlist'
    | 'show'
    | 'episode'
    | 'audiobook'
  className?: string
}

// Generic gray placeholder with icon when no image available
export const PlaceholderImage: React.FC<PlaceholderImageProps> = ({
  type = 'album',
  className = '',
}) => {
  const { t } = useTranslation()
  const renderIcon = () => {
    switch (type) {
      case 'artist':
        return <Music className="w-8 h-8 text-muted-foreground" />
      default:
        return <ImageIcon className="w-8 h-8 text-muted-foreground" />
    }
  }

  return (
    <div
      className={`w-full h-full flex items-center justify-center bg-muted ${className}`}
      aria-label={t('ui:placeholderImage')}
    >
      {renderIcon()}
    </div>
  )
}
