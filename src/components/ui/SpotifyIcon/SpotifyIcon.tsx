import React from 'react'

interface MusicIconProps {
  size?: number
  className?: string
}

export const MusicIcon: React.FC<MusicIconProps> = ({
  size = 24,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Custom Music Icon - Not Spotify's trademark */}
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"
        fill="currentColor"
      />
    </svg>
  )
}
