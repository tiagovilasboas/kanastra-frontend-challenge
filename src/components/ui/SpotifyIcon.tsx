import { forwardRef } from 'react'

import { iconStyles } from '@/lib/design-system/utils'

export interface SpotifyIconProps {
  icon: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  color?: string
  className?: string
  style?: React.CSSProperties
}

// Ícones comuns do Spotify
const spotifyIcons = {
  play: '▶️',
  pause: '⏸️',
  next: '⏭️',
  previous: '⏮️',
  shuffle: '🔀',
  repeat: '🔁',
  heart: '❤️',
  heartOutline: '🤍',
  search: '🔍',
  home: '🏠',
  library: '📚',
  create: '➕',
  liked: '💚',
  download: '⬇️',
  share: '📤',
  more: '⋯',
  volume: '🔊',
  mute: '🔇',
  settings: '⚙️',
  profile: '👤',
}

export const SpotifyIcon = forwardRef<HTMLSpanElement, SpotifyIconProps>(
  ({ icon, size = 'md', color = '#FFFFFF', className, style, ...props }, ref) => {
    const iconContent = spotifyIcons[icon as keyof typeof spotifyIcons] || icon

    const iconStyles_ = {
      ...iconStyles.size[size],
      color,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: iconStyles.size[size].width,
      lineHeight: 1,
      ...style,
    }

    return (
      <span
        ref={ref}
        className={className}
        style={iconStyles_}
        {...props}
      >
        {iconContent}
      </span>
    )
  }
)

SpotifyIcon.displayName = 'SpotifyIcon' 