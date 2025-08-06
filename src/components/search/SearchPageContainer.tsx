import { AlertCircle, Loader2, Search } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import {
  BestResultCard,
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  ContentGrid,
  ContentSection,
  SearchLayout,
  SearchResultsLayout,
  type SearchTab,
  SearchTabs,
} from '@/components/ui'

interface SearchPageContainerProps {
  searchQuery: string
  onTabChange: (tabId: string) => void
  tabs: SearchTab[]
  bestResult?: {
    imageUrl: string
    title: string
    subtitle: string
    type: string
    onClick?: () => void
  }
  sections: Array<{
    id: string
    title: string
    children: React.ReactNode
    onViewAllClick?: () => void
    showViewAll?: boolean
  }>
  isLoading?: boolean
  error?: string
}

export const SearchPageContainer: React.FC<SearchPageContainerProps> = ({
  searchQuery,
  onTabChange,
  tabs,
  bestResult,
  sections,
  isLoading = false,
  error,
}) => {
  const { t } = useTranslation()

  // Loading State
  if (isLoading) {
    return (
      <SearchLayout>
        <div className="p-4 space-y-6">
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            <span className="text-muted-foreground">
              {t('search:searching', 'Buscando...')}
            </span>
          </div>
          <ContentGrid>
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className="aspect-square animate-pulse rounded-lg bg-muted"
              />
            ))}
          </ContentGrid>
        </div>
      </SearchLayout>
    )
  }

  // Error State
  if (error) {
    return (
      <SearchLayout>
        <div className="p-4">
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="flex items-center gap-3 p-6">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <div>
                <h3 className="font-semibold text-destructive">
                  {t('search:errorTitle', 'Erro na busca')}
                </h3>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </SearchLayout>
    )
  }

  // Welcome State (no search query)
  if (!searchQuery) {
    return (
      <SearchLayout>
        <div className="p-4">
          <Card className="text-center">
            <CardContent className="p-8">
              <Search className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <CardTitle className="text-2xl mb-2">
                {t('search:welcomeTitle', 'O que você quer ouvir hoje?')}
              </CardTitle>
              <CardDescription className="text-lg">
                {t(
                  'search:welcomeDescription',
                  'Procure por artistas, álbuns, músicas, playlists e muito mais.',
                )}
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </SearchLayout>
    )
  }

  // No Results State
  if (searchQuery && sections.length === 0 && !bestResult) {
    return (
      <SearchLayout>
        <div className="p-4">
          <Card className="text-center">
            <CardContent className="p-8">
              <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <CardTitle className="text-xl mb-2">
                {t('search:noResultsTitle', 'Nenhum resultado encontrado')}
              </CardTitle>
              <CardDescription>
                {t(
                  'search:noResultsDescription',
                  'Não encontramos resultados para "{{query}}". Tente com outras palavras-chave.',
                  {
                    query: searchQuery,
                  },
                )}
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </SearchLayout>
    )
  }

  // Results State
  return (
    <SearchLayout>
      {/* Tabs */}
      <SearchTabs tabs={tabs} onTabChange={onTabChange} />

      {/* Results */}
      <SearchResultsLayout
        bestResult={
          bestResult && (
            <BestResultCard
              imageUrl={bestResult.imageUrl}
              title={bestResult.title}
              subtitle={bestResult.subtitle}
              type={bestResult.type}
              onClick={bestResult.onClick}
            />
          )
        }
      >
        {sections.map((section) => (
          <ContentSection
            key={section.id}
            title={section.title}
            onViewAllClick={section.onViewAllClick}
            showViewAll={section.showViewAll}
          >
            {section.children}
          </ContentSection>
        ))}
      </SearchResultsLayout>
    </SearchLayout>
  )
}
