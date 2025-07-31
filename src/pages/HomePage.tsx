import { Container, Stack, Text, Title } from '@mantine/core'
import { useTranslation } from 'react-i18next'

export default function HomePage() {
  const { t } = useTranslation()

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg" align="center">
        <Title order={1} ta="center">
          {t('welcome.title')}
        </Title>
        <Text size="lg" ta="center" c="dimmed">
          {t('welcome.subtitle')}
        </Text>
      </Stack>
    </Container>
  )
}
