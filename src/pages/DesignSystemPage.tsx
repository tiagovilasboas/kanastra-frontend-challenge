import { Grid, Group, Stack, Text, Title } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import { Container } from '@/components/layout'
import { Button, Card, SpotifyIcon } from '@/components/ui'
import { spotifyStyles } from '@/lib/design-system/utils'

export default function DesignSystemPage() {
  const { t } = useTranslation()

  return (
    <Container variant="mobile-first">
      <Stack gap="xl" p="xl">
        <div>
          <Title
            order={1}
            style={{
              ...spotifyStyles.textPrimary,
              ...spotifyStyles.fontWeightBold,
              ...spotifyStyles.text4xl,
              marginBottom: '16px',
              background: 'linear-gradient(135deg, #1DB954 0%, #1ed760 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {t('designSystem:title')}
          </Title>
          <Text
            style={{
              ...spotifyStyles.textSecondary,
              ...spotifyStyles.textLg,
              ...spotifyStyles.leadingRelaxed,
            }}
          >
            {t('designSystem:subtitle')}
          </Text>
        </div>

        {/* Buttons Section */}
        <Card variant="elevated">
          <Stack gap="lg">
            <Title order={2} style={spotifyStyles.textPrimary}>
              {t('designSystem.buttons')}
            </Title>

            <Group gap="md">
              <Button variant="spotify" size="sm">
                {t('designSystem.primarySmall')}
              </Button>
              <Button variant="spotify">
                {t('designSystem.primaryMedium')}
              </Button>
              <Button variant="spotify">
                {t('designSystem.primaryLarge')}
              </Button>
            </Group>

            <Group gap="md">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">{t('designSystem.secondary')}</Button>
              <Button variant="ghost">{t('designSystem.ghost')}</Button>
              <Button variant="danger">{t('designSystem.danger')}</Button>
            </Group>
          </Stack>
        </Card>

        {/* Cards Section */}
        <Card variant="elevated">
          <Stack gap="lg">
            <Title order={2} style={spotifyStyles.textPrimary}>
              {t('designSystem.cards')}
            </Title>

            <Grid gutter="md">
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card variant="default">
                  <Stack gap="sm">
                    <Title order={3} style={spotifyStyles.textPrimary}>
                      {t('designSystem.defaultCard')}
                    </Title>
                    <Text style={spotifyStyles.textSecondary}>
                      {t('designSystem.defaultCardDesc')}
                    </Text>
                  </Stack>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card variant="elevated">
                  <Stack gap="sm">
                    <Title order={3} style={spotifyStyles.textPrimary}>
                      {t('designSystem.elevatedCard')}
                    </Title>
                    <Text style={spotifyStyles.textSecondary}>
                      {t('designSystem.elevatedCardDesc')}
                    </Text>
                  </Stack>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card variant="interactive">
                  <Stack gap="sm">
                    <Title order={3} style={spotifyStyles.textPrimary}>
                      {t('designSystem.interactiveCard')}
                    </Title>
                    <Text style={spotifyStyles.textSecondary}>
                      {t('designSystem.interactiveCardDesc')}
                    </Text>
                  </Stack>
                </Card>
              </Grid.Col>
            </Grid>
          </Stack>
        </Card>

        {/* Icons Section */}
        <Card variant="elevated">
          <Stack gap="lg">
            <Title order={2} style={spotifyStyles.textPrimary}>
              Spotify Icons
            </Title>

            <Grid gutter="md">
              <Grid.Col span={{ base: 6, md: 3 }}>
                <Stack gap="sm" align="center">
                  <SpotifyIcon icon="play" />
                  <Text size="sm" style={spotifyStyles.textSecondary}>
                    Play
                  </Text>
                </Stack>
              </Grid.Col>

              <Grid.Col span={{ base: 6, md: 3 }}>
                <Stack gap="sm" align="center">
                  <SpotifyIcon icon="pause" />
                  <Text size="sm" style={spotifyStyles.textSecondary}>
                    Pause
                  </Text>
                </Stack>
              </Grid.Col>

              <Grid.Col span={{ base: 6, md: 3 }}>
                <Stack gap="sm" align="center">
                  <SpotifyIcon icon="heart" />
                  <Text size="sm" style={spotifyStyles.textSecondary}>
                    Heart
                  </Text>
                </Stack>
              </Grid.Col>

              <Grid.Col span={{ base: 6, md: 3 }}>
                <Stack gap="sm" align="center">
                  <SpotifyIcon icon="search" />
                  <Text size="sm" style={spotifyStyles.textSecondary}>
                    Search
                  </Text>
                </Stack>
              </Grid.Col>
            </Grid>
          </Stack>
        </Card>

        {/* Colors Section */}
        <Card variant="elevated">
          <Stack gap="lg">
            <Title order={2} style={spotifyStyles.textPrimary}>
              {t('designSystem.colorPalette')}
            </Title>

            <Grid gutter="md">
              <Grid.Col span={{ base: 12, md: 3 }}>
                <div
                  style={{
                    background:
                      'linear-gradient(135deg, #1DB954 0%, #1ed760 100%)',
                    height: '60px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontWeight: 'bold',
                  }}
                >
                  {t('designSystem.primary')}
                </div>
                <Text size="sm" style={spotifyStyles.textSecondary} mt="xs">
                  #1DB954
                </Text>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 3 }}>
                <div
                  style={{
                    backgroundColor: '#121212',
                    height: '60px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontWeight: 'bold',
                    border: '1px solid #282828',
                  }}
                >
                  {t('designSystem.background')}
                </div>
                <Text size="sm" style={spotifyStyles.textSecondary} mt="xs">
                  #121212
                </Text>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 3 }}>
                <div
                  style={{
                    backgroundColor: '#181818',
                    height: '60px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontWeight: 'bold',
                    border: '1px solid #282828',
                  }}
                >
                  {t('designSystem.secondary')}
                </div>
                <Text size="sm" style={spotifyStyles.textSecondary} mt="xs">
                  #181818
                </Text>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 3 }}>
                <div
                  style={{
                    backgroundColor: '#282828',
                    height: '60px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontWeight: 'bold',
                  }}
                >
                  {t('designSystem.tertiary')}
                </div>
                <Text size="sm" style={spotifyStyles.textSecondary} mt="xs">
                  #282828
                </Text>
              </Grid.Col>
            </Grid>
          </Stack>
        </Card>

        {/* Typography Section */}
        <Card variant="elevated">
          <Stack gap="lg">
            <Title order={2} style={spotifyStyles.textPrimary}>
              Typography
            </Title>

            <Stack gap="md">
              <div>
                <Text
                  style={{
                    ...spotifyStyles.text5xl,
                    ...spotifyStyles.fontWeightBold,
                  }}
                >
                  Heading 1 - 36px Bold
                </Text>
                <Text style={spotifyStyles.textSecondary}>
                  Circular font family
                </Text>
              </div>

              <div>
                <Text
                  style={{
                    ...spotifyStyles.text3xl,
                    ...spotifyStyles.fontWeightSemibold,
                  }}
                >
                  Heading 2 - 28px Semibold
                </Text>
                <Text style={spotifyStyles.textSecondary}>
                  Circular font family
                </Text>
              </div>

              <div>
                <Text
                  style={{
                    ...spotifyStyles.textLg,
                    ...spotifyStyles.fontWeightMedium,
                  }}
                >
                  Body Large - 18px Medium
                </Text>
                <Text style={spotifyStyles.textSecondary}>
                  Circular font family
                </Text>
              </div>

              <div>
                <Text
                  style={{
                    ...spotifyStyles.textBase,
                    ...spotifyStyles.fontWeightNormal,
                  }}
                >
                  Body Base - 14px Normal
                </Text>
                <Text style={spotifyStyles.textSecondary}>
                  Circular font family
                </Text>
              </div>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Container>
  )
}
