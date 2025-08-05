import { Mic } from 'lucide-react'
import React from 'react'

import { BaseItem } from './BaseItem'

// Show Item Component
interface ShowItemProps {
  show: any
  onClick?: () => void
}

export const ShowItem: React.FC<ShowItemProps> = ({ show, onClick }) => {
  return (
    <BaseItem
      image={show.images?.[0]?.url}
      title={show.name}
      subtitle={show.publisher || 'Editora desconhecida'}
      icon={<Mic className="h-8 w-8" />}
      onClick={onClick}
    />
  )
} 