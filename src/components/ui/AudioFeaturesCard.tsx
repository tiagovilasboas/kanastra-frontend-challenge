import React from 'react'
import { useTranslation } from 'react-i18next'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useAudioFeatures } from '@/hooks/useAudioFeatures'

interface AudioFeaturesCardProps {
  trackId: string
  trackName?: string
}

export const AudioFeaturesCard: React.FC<AudioFeaturesCardProps> = ({
  trackId,
  trackName,
}) => {
  const { t } = useTranslation()
  const { audioFeatures, isLoading, error } = useAudioFeatures({ trackId })

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {t('audio:features', 'Características de Áudio')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                <div className="h-2 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !audioFeatures) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {t('audio:features', 'Características de Áudio')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {t(
              'audio:errorLoading',
              'Erro ao carregar características de áudio',
            )}
          </p>
        </CardContent>
      </Card>
    )
  }

  const features = [
    {
      key: 'danceability',
      label: t('audio:danceability', 'Dançabilidade'),
      value: audioFeatures.danceability,
      description: t('audio:danceabilityDesc', 'Quão dançável é a música'),
    },
    {
      key: 'energy',
      label: t('audio:energy', 'Energia'),
      value: audioFeatures.energy,
      description: t('audio:energyDesc', 'Intensidade e atividade da música'),
    },
    {
      key: 'valence',
      label: t('audio:valence', 'Positividade'),
      value: audioFeatures.valence,
      description: t('audio:valenceDesc', 'Positividade musical da faixa'),
    },
    {
      key: 'acousticness',
      label: t('audio:acousticness', 'Acústica'),
      value: audioFeatures.acousticness,
      description: t(
        'audio:acousticnessDesc',
        'Confiança de que a música é acústica',
      ),
    },
    {
      key: 'instrumentalness',
      label: t('audio:instrumentalness', 'Instrumental'),
      value: audioFeatures.instrumentalness,
      description: t(
        'audio:instrumentalnessDesc',
        'Predominância de instrumentos',
      ),
    },
    {
      key: 'liveness',
      label: t('audio:liveness', 'Ao Vivo'),
      value: audioFeatures.liveness,
      description: t('audio:livenessDesc', 'Presença de público na gravação'),
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {t('audio:features')}
          {trackName && (
            <span className="text-sm font-normal text-muted-foreground block">
              {trackName}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {features.map((feature) => (
            <div key={feature.key} className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">{feature.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">
                  {Math.round(feature.value * 100)}
                  {t('common:percent', '%')}
                </span>
              </div>
              <Progress value={feature.value * 100} className="h-2" />
            </div>
          ))}

          {/* Additional info */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <p className="text-xs text-muted-foreground">
                {t('audio:tempo', 'Tempo')}
              </p>
              <p className="text-sm font-medium">
                {Math.round(audioFeatures.tempo)} {t('audio:bpm', 'BPM')}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                {t('audio:key', 'Tom')}
              </p>
              <p className="text-sm font-medium">
                {getKeyName(audioFeatures.key)}{' '}
                {audioFeatures.mode === 1
                  ? t('audio:major', 'Major')
                  : t('audio:minor', 'Minor')}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                {t('audio:loudness', 'Volume')}
              </p>
              <p className="text-sm font-medium">
                {Math.round(audioFeatures.loudness)} {t('audio:db', 'dB')}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                {t('audio:timeSignature', 'Compasso')}
              </p>
              <p className="text-sm font-medium">
                {audioFeatures.time_signature}
                {t('audio:perFour', '/4')}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Helper function to convert key number to note name
function getKeyName(key: number): string {
  const keys = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B']
  return keys[key] || 'N/A'
}
