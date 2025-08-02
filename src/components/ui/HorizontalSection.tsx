import React from 'react'

import { HorizontalCard } from './HorizontalCard'

interface HorizontalSectionProps {
  title: string
  items: Array<{
    id: string
    title: string
    subtitle?: string
    image?: string
  }>
  onItemClick?: (id: string) => void
  className?: string
}

export const HorizontalSection: React.FC<HorizontalSectionProps> = ({
  title,
  items,
  onItemClick,
  className = '',
}) => {
  return (
    <section className={`horizontal-section ${className}`}>
      <h2 className="horizontal-section-title">{title}</h2>
      <div className="horizontal-section-content">
        {items.map((item) => (
          <HorizontalCard
            key={item.id}
            id={item.id}
            title={item.title}
            subtitle={item.subtitle}
            image={item.image}
            onClick={() => onItemClick?.(item.id)}
          />
        ))}
      </div>
    </section>
  )
} 