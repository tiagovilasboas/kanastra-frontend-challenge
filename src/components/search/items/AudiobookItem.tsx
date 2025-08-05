import { BookOpen } from 'lucide-react'
import React from 'react'

import { BaseItem } from './BaseItem'

// Audiobook Item Component
interface AudiobookItemProps {
  audiobook: any
  onClick?: () => void
}

export const AudiobookItem: React.FC<AudiobookItemProps> = ({ audiobook, onClick }) => {
  const subtitle = audiobook.authors?.map((author: any) => author?.name || 'Autor desconhecido').join(', ') || 'Autor desconhecido'
  
  return (
    <BaseItem
      image={audiobook.images?.[0]?.url}
      title={audiobook.name}
      subtitle={subtitle}
      icon={<BookOpen className="h-8 w-8" />}
      onClick={onClick}
    />
  )
} 