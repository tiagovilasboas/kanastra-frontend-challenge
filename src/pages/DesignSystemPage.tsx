import { Grid, Group, Stack, Text, Title } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import { Button, Card } from '@/components/ui'
import { Container } from '@/components/layout'
import { spotifyStyles } from '@/lib/design-system/utils'

export default function DesignSystemPage() {
  const { t } = useTranslation()

  return (
    <Container>
      <Stack gap="xl" p="xl">
        <div>
          <Title
            order={1}
            style={{
              ...spotifyStyles.textPrimary,
              ...spotifyStyles.fontWeightBold,
              marginBottom: '16px',
            }}
          >
            {t('designSystem.title')}
          </Title>
          <Text
            style={{
              ...spotifyStyles.textSecondary,
              ...spotifyStyles.textLg,
            }}
          >
            {t('designSystem.subtitle')}
          </Text>
        </div>

        {/* Buttons Section */}
        <Card variant="elevated" size="lg">
          <Stack gap="lg">
            <Title order={2} style={spotifyStyles.textPrimary}>
              {t('designSystem.buttons')}
            </Title>
            
            <Group gap="md">
              <Button variant="primary" size="sm">
                {t('designSystem.primarySmall')}
              </Button>
              <Button variant="primary" size="md">
                {t('designSystem.primaryMedium')}
              </Button>
              <Button variant="primary" size="lg">
                {t('designSystem.primaryLarge')}
              </Button>
            </Group>

            <Group gap="md">
              <Button variant="secondary" size="md">
                {t('designSystem.secondary')}
              </Button>
              <Button variant="ghost" size="md">
                {t('designSystem.ghost')}
              </Button>
              <Button variant="danger" size="md">
                {t('designSystem.danger')}
              </Button>
            </Group>
          </Stack>
        </Card>

        {/* Cards Section */}
        <Card variant="elevated" size="lg">
          <Stack gap="lg">
            <Title order={2} style={spotifyStyles.textPrimary}>
              {t('designSystem.cards')}
            </Title>
            
            <Grid gutter="md">
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card variant="default" size="md">
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
                <Card variant="elevated" size="md">
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
                <Card variant="interactive" size="md">
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

        {/* Colors Section */}
        <Card variant="elevated" size="lg">
          <Stack gap="lg">
            <Title order={2} style={spotifyStyles.textPrimary}>
              {t('designSystem.colorPalette')}
            </Title>
            
            <Grid gutter="md">
              <Grid.Col span={{ base: 12, md: 3 }}>
                <div
                  style={{
                    backgroundColor: '#1db954',
                    height: '60px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontWeight: 'bold',
                  }}
                >
                  {t('designSystem.primary')}
                </div>
                <Text size="sm" style={spotifyStyles.textSecondary} mt="xs">
                  #1db954
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
                    color: '#ffffff',
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
                    color: '#ffffff',
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
                    color: '#ffffff',
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
      </Stack>
    </Container>
  )
} 