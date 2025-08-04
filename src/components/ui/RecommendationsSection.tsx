import { Music, Sparkles, Target } from 'lucide-react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { useRecommendations } from '@/hooks/useRecommendations'
import { SpotifyTrack } from '@/types/spotify'

interface RecommendationsSectionProps {
  seedArtists?: string[]
  seedGenres?: string[]
  seedTracks?: string[]
}

export const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({
  seedArtists = [],
  seedGenres = [],
  seedTracks = [],
}) => {
  const { t } = useTranslation()

  const [targetEnergy, setTargetEnergy] = useState([0.5])
  const [targetDanceability, setTargetDanceability] = useState([0.5])
  const [targetValence, setTargetValence] = useState([0.5])
  const [targetTempo, setTargetTempo] = useState([120])
  const [targetPopularity, setTargetPopularity] = useState([50])
  const [limit, setLimit] = useState(20)

  const {
    recommendations,
    isLoading: isLoadingRecommendations,
    error,
  } = useRecommendations({
    params: {
      seed_artists: seedArtists,
      seed_genres: seedGenres,
      seed_tracks: seedTracks,
      target_energy: targetEnergy[0],
      target_danceability: targetDanceability[0],
      target_valence: targetValence[0],
      target_tempo: targetTempo[0],
      target_popularity: targetPopularity[0],
      limit,
    },
    enabled:
      seedArtists.length > 0 || seedGenres.length > 0 || seedTracks.length > 0,
  })

  const handleTrackClick = (track: SpotifyTrack) => {
    if (track.external_urls?.spotify) {
      window.open(track.external_urls.spotify, '_blank', 'noopener,noreferrer')
    }
  }

  if (
    seedArtists.length === 0 &&
    seedGenres.length === 0 &&
    seedTracks.length === 0
  ) {
    return (
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">
            {t('recommendations:title')}
          </h2>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <Music className="w-12 h-12 text-muted-foreground mx-auto" />
              <h3 className="text-lg font-semibold">
                {t('recommendations:noSeeds')}
              </h3>
              <p className="text-muted-foreground">
                {t('recommendations:noSeedsDesc')}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">
          {t('recommendations:title')}
        </h2>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              <h3 className="text-lg font-semibold">
                {t('recommendations:filters')}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Energy */}
              <div className="space-y-2">
                <Label>{t('recommendations:energy')}</Label>
                <Slider
                  value={targetEnergy}
                  onValueChange={setTargetEnergy}
                  max={1}
                  min={0}
                  step={0.01}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  {Math.round(targetEnergy[0] * 100)}
                  {t('common:percent', '%')}
                </p>
              </div>

              {/* Danceability */}
              <div className="space-y-2">
                <Label>{t('recommendations:danceability')}</Label>
                <Slider
                  value={targetDanceability}
                  onValueChange={setTargetDanceability}
                  max={1}
                  min={0}
                  step={0.01}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  {Math.round(targetDanceability[0] * 100)}
                  {t('common:percent', '%')}
                </p>
              </div>

              {/* Valence */}
              <div className="space-y-2">
                <Label>{t('recommendations:valence')}</Label>
                <Slider
                  value={targetValence}
                  onValueChange={setTargetValence}
                  max={1}
                  min={0}
                  step={0.01}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  {Math.round(targetValence[0] * 100)}
                  {t('common:percent', '%')}
                </p>
              </div>

              {/* Tempo */}
              <div className="space-y-2">
                <Label>{t('recommendations:tempo')}</Label>
                <Slider
                  value={targetTempo}
                  onValueChange={setTargetTempo}
                  max={200}
                  min={60}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  {targetTempo[0]} {t('audio:bpm', 'BPM')}
                </p>
              </div>

              {/* Popularity */}
              <div className="space-y-2">
                <Label>{t('recommendations:popularity')}</Label>
                <Slider
                  value={targetPopularity}
                  onValueChange={setTargetPopularity}
                  max={100}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  {targetPopularity[0]}
                  {t('common:percent', '%')}
                </p>
              </div>

              {/* Limit */}
              <div className="space-y-2">
                <Label>{t('recommendations:limit')}</Label>
                <Select
                  value={limit.toString()}
                  onValueChange={(value) => setLimit(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">
                      {t('recommendations:limit5', '5')}
                    </SelectItem>
                    <SelectItem value="10">
                      {t('recommendations:limit10', '10')}
                    </SelectItem>
                    <SelectItem value="20">
                      {t('recommendations:limit20', '20')}
                    </SelectItem>
                    <SelectItem value="50">
                      {t('recommendations:limit50', '50')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {isLoadingRecommendations ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: limit }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-4">
                <div className="aspect-square bg-muted rounded-lg mb-3"></div>
                <div className="h-4 bg-muted rounded w-3/4 mb-1"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-destructive">{t('recommendations:error')}</p>
          </CardContent>
        </Card>
      ) : recommendations.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {t('recommendations:resultsWithCount', {
                count: recommendations.length,
                defaultValue: 'Results ({count})',
              })}
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {recommendations.map((track) => (
              <Card
                key={track.id}
                className="hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => handleTrackClick(track)}
              >
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                      {track.album.images && track.album.images.length > 0 ? (
                        <img
                          src={track.album.images[0].url}
                          alt={track.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <Music className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <h4 className="font-semibold text-sm line-clamp-1">
                      {track.name}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {track.artists.map((artist) => artist.name).join(', ')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {track.album.name}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <Music className="w-12 h-12 text-muted-foreground mx-auto" />
              <h3 className="text-lg font-semibold">
                {t('recommendations:noResults')}
              </h3>
              <p className="text-muted-foreground">
                {t('recommendations:noResultsDesc')}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  )
}
