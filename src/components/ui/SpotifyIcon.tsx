import { forwardRef } from 'react'

export interface SpotifyIconProps {
  icon: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  color?: string
  className?: string
  style?: React.CSSProperties
}

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

const iconSizes = {
  xs: '12px',
  sm: '16px',
  md: '20px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
}

export const SpotifyIcon = forwardRef<HTMLSpanElement, SpotifyIconProps>(
  ({ icon, size = 'md', color = '#FFFFFF', className, style, ...props }, ref) => {
    const iconContent = spotifyIcons[icon as keyof typeof spotifyIcons] || icon

    const iconStyles_ = {
      width: iconSizes[size],
      height: iconSizes[size],
      color,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: iconSizes[size],
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