import { TrendingUp } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface PopularityBarProps {
  popularity: number
  className?: string
}

export const PopularityBar: React.FC<PopularityBarProps> = ({
  popularity,
  className = '',
}) => {
  const { t } = useTranslation()

  // Determina a cor baseada na popularidade
  const getPopularityColor = (value: number) => {
    if (value >= 80) return 'bg-green-500'
    if (value >= 60) return 'bg-blue-500'
    if (value >= 40) return 'bg-yellow-500'
    if (value >= 20) return 'bg-orange-500'
    return 'bg-red-500'
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Header simples */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            {t('popularity:title', 'Popularidade')}
          </span>
        </div>
        <span className="text-sm font-bold text-foreground">
          {popularity}
          {t('common:percent', '%')}
        </span>
      </div>

      {/* Barra de progresso simples */}
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full ${getPopularityColor(popularity)} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${popularity}%` }}
        />
      </div>
    </div>
  )
}
