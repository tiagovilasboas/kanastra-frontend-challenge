import { Users } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface FollowersCountProps {
  count: number
  className?: string
}

export const FollowersCount: React.FC<FollowersCountProps> = ({
  count,
  className = '',
}) => {
  const { t } = useTranslation()

  const formatFollowers = (followers: number): string => {
    if (followers >= 1000000000) {
      return `${(followers / 1000000000).toFixed(1)}B`
    }
    if (followers >= 1000000) {
      return `${(followers / 1000000).toFixed(1)}M`
    }
    if (followers >= 1000) {
      return `${(followers / 1000).toFixed(1)}K`
    }
    return followers.toLocaleString()
  }

  const getFollowersText = (count: number): string => {
    if (count === 1) {
      return t('followers:singular', 'seguidor')
    }
    return t('followers:plural', 'seguidores')
  }

  const getFollowersColor = (count: number): string => {
    if (count >= 10000000) return 'text-green-500'
    if (count >= 1000000) return 'text-blue-500'
    if (count >= 100000) return 'text-purple-500'
    if (count >= 10000) return 'text-orange-500'
    return 'text-muted-foreground'
  }

  const getFollowersIcon = (count: number): string => {
    if (count >= 10000000) return '👑'
    if (count >= 1000000) return '🌟'
    if (count >= 100000) return '⭐'
    if (count >= 10000) return '💫'
    return '👥'
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1">
        <span className="text-lg">{getFollowersIcon(count)}</span>
        <Users className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="flex items-baseline gap-1">
        <span className={`text-lg font-bold ${getFollowersColor(count)}`}>
          {formatFollowers(count)}
        </span>
        <span className="text-sm text-muted-foreground">
          {getFollowersText(count)}
        </span>
      </div>
    </div>
  )
}
