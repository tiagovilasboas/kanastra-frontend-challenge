import { Settings } from 'lucide-react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { MobileNavigation } from '@/components/layout'
import { AlbumGrid, NowPlaying } from '@/components/ui'
import { HorizontalSection } from '@/components/ui'

interface MobileLayoutProps {
  onSearch?: (query: string) => void
}

export const MobileLayout: React.FC<MobileLayoutProps> = () => {
  const { t } = useTranslation()
  const [activeSection, setActiveSection] = useState<
    'home' | 'search' | 'library' | 'download' | 'profile'
  >('home')

  // Mock data for demonstration
  const mockPlaylists = [
    {
      id: '1',
      title: 'Pagonejo',
      subtitle: 'Pagonejo 2025 | Melhores do Pagod...',
      image: '/placeholder-album.jpg',
    },
    {
      id: '2',
      title: 'O melhor da década pra você',
      subtitle: 'O melhor da década pra você',
      image: '/placeholder-album.jpg',
    },
    {
      id: '3',
      title: 'JOÃO CAR MELHORE!',
      subtitle: 'Sertanejo universitário',
      image: '/placeholder-album.jpg',
    },
  ]

  const mockHits = [
    {
      id: '4',
      title: 'PAGODEIRA',
      subtitle: 'Pagodeira',
      image: '/placeholder-album.jpg',
    },
    {
      id: '5',
      title: 'ESQUENTA SERTANEJO',
      subtitle: 'Esquenta Sertanejo',
      image: '/placeholder-album.jpg',
    },
    {
      id: '6',
      title: 'TOP BRA',
      subtitle: 'Top Brasil',
      image: '/placeholder-album.jpg',
    },
  ]

  const mockRecommendations = [
    {
      id: '7',
      title: 'Buteco Sertanejo',
      subtitle: 'Sertanejo raiz',
      image: '/placeholder-album.jpg',
    },
    {
      id: '8',
      title: 'Modão Sertanejo',
      subtitle: 'Sertanejo tradicional',
      image: '/placeholder-album.jpg',
    },
    {
      id: '9',
      title: 'Festa Sertan',
      subtitle: 'Sertanejo universitário',
      image: '/placeholder-album.jpg',
    },
  ]

  // Mock albums data similar to the image
  const mockAlbums = [
    {
      id: '10',
      title: 'Os Caras da Rua, Pt. 1 (Ao Vivo)',
      artist: 'Os Caras da Rua',
      image: '/placeholder-album.jpg',
      releaseDate: '19 de dezembro de 2024',
      trackCount: 9,
      albumType: 'ALBUM',
    },
    {
      id: '11',
      title: 'Pagobinho 2.0 (Ao Vivo)',
      artist: 'Pagobinho',
      image: '/placeholder-album.jpg',
      releaseDate: '22 de outubro de 2024',
      trackCount: 13,
      albumType: 'ALBUM',
    },
    {
      id: '12',
      title: 'Pagobinho, Pt. 2',
      artist: 'Pagobinho',
      image: '/placeholder-album.jpg',
      releaseDate: '12 de setembro de 2024',
      trackCount: 10,
      albumType: 'ALBUM',
    },
    {
      id: '13',
      title: 'Pagobinho',
      artist: 'Pagobinho & Fabinho',
      image: '/placeholder-album.jpg',
      releaseDate: '16 de fevereiro de 2024',
      trackCount: 7,
      albumType: 'ALBUM',
    },
    {
      id: '14',
      title: 'Churrasco Universitário',
      artist: 'Churrasco Universitário',
      image: '/placeholder-album.jpg',
      releaseDate: '7 de fevereiro de 2016',
      trackCount: 13,
      albumType: 'ALBUM',
    },
    {
      id: '15',
      title: 'Não Falta Nada Lá em Casa (Ao Vivo)',
      artist: 'Os Caras da Rua',
      image: '/placeholder-album.jpg',
      releaseDate: '29 de junho de 2025',
      trackCount: 1,
      albumType: 'SINGLE',
    },
    {
      id: '16',
      title: 'Pra Decidir (Os Caras Da Rua)',
      artist: 'Os Caras da Rua',
      image: '/placeholder-album.jpg',
      releaseDate: '12 de junho de 2025',
      trackCount: 1,
      albumType: 'SINGLE',
    },
    {
      id: '17',
      title: 'Cadê Ela',
      artist: 'Pagobinho',
      image: '/placeholder-album.jpg',
      releaseDate: '26 de dezembro de 2024',
      trackCount: 1,
      albumType: 'SINGLE',
    },
  ]

  const mockTrack = {
    name: 'Caso Indefinido - Ao Vivo',
    artist: 'Cristiano Araújo',
    albumArt: '/placeholder-album.jpg',
  }

  const handleSectionChange = (section: typeof activeSection) => {
    setActiveSection(section)
  }

  const handlePlaylistClick = (id: string) => {
    console.log('Playlist clicked:', id)
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return t('greeting:goodMorning', 'Bom dia')
    if (hour < 18) return t('greeting:goodAfternoon', 'Boa tarde')
    return t('greeting:goodEvening', 'Boa noite')
  }

  return (
    <div className="mobile-layout">
      {/* Header */}
      <header className="mobile-header">
        <div className="mobile-header-content">
          <h1 className="mobile-greeting">{getGreeting()}</h1>
          <button
            className="mobile-settings-button"
            aria-label={t('ui:settings', 'Configurações')}
          >
            <Settings size={24} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mobile-main-content">
        {activeSection === 'home' && (
          <div className="mobile-home-content">
            <HorizontalSection
              title=""
              items={mockPlaylists}
              onItemClick={handlePlaylistClick}
            />

            <HorizontalSection
              title={t('home:biggestHits', 'Os maiores hits do momento')}
              items={mockHits}
              onItemClick={handlePlaylistClick}
            />

            <HorizontalSection
              title={t('home:moreOfWhatYouLike', 'Mais do que você curte')}
              items={mockRecommendations}
              onItemClick={handlePlaylistClick}
            />
          </div>
        )}

        {activeSection === 'search' && (
          <div className="mobile-search-content">
            <AlbumGrid
              albums={mockAlbums}
              title="Álbuns"
              onAlbumClick={handlePlaylistClick}
            />
          </div>
        )}

        {activeSection === 'library' && (
          <div className="mobile-library-content">
            <h2>{t('navigation:library', 'Sua Biblioteca')}</h2>
            <p>
              {t(
                'navigation:libraryMessage',
                'Sua biblioteca de músicas aparecerá aqui',
              )}
            </p>
          </div>
        )}

        {activeSection === 'download' && (
          <div className="mobile-download-content">
            <h2>{t('navigation:download', 'Baixar aplicativo')}</h2>
            <p>
              {t(
                'navigation:downloadMessage',
                'Baixe o aplicativo para ouvir offline',
              )}
            </p>
          </div>
        )}

        {activeSection === 'profile' && (
          <div className="mobile-profile-content">
            <h2>{t('navigation:profile', 'Perfil')}</h2>
            <p>
              {t(
                'navigation:profileMessage',
                'Gerencie sua conta e configurações',
              )}
            </p>
          </div>
        )}
      </main>

      {/* Now Playing Bar */}
      <NowPlaying
        track={mockTrack}
        isPlaying={false}
        onPlayPause={() => console.log('Play/Pause clicked')}
        onLike={() => console.log('Like clicked')}
      />

      {/* Mobile Navigation */}
      <MobileNavigation
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />
    </div>
  )
}
