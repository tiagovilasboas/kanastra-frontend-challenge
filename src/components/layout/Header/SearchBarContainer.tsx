import React from 'react'

import { useSearchBar } from '@/hooks/useSearchBar'

import { Header } from './Header'

/**
 * Container responsável por injetar a lógica de busca (useSearchBar)
 * e repassar props para o componente Header, mantendo-o puramente
 * apresentacional.
 */
export const SearchBarContainer: React.FC<{
  onMenuToggle?: () => void
  searchPlaceholder?: string
}> = ({ onMenuToggle, searchPlaceholder }) => {
  const { searchQuery, handleSearchChange, handleSearchKeyPress } =
    useSearchBar()

  return (
    <Header
      onMenuToggle={onMenuToggle}
      searchPlaceholder={searchPlaceholder}
      searchQuery={searchQuery}
      onSearchChange={handleSearchChange}
      onSearchKeyPress={handleSearchKeyPress}
    />
  )
}
