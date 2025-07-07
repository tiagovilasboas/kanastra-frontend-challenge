/* eslint-disable formatjs/no-literal-string-in-jsx */
import {
  Badge,
  Container,
  List,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'

import {
  IconBolt,
  IconChecklist,
  IconDeviceLaptop,
  IconGitCommit,
  IconTestPipe,
  IconWorld,
} from '@tabler/icons-react'

export function Component() {
  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <Title order={1} ta="center">
          Sobre este Projeto
        </Title>

        <Text size="lg" ta="center" c="dimmed">
          Boilerplate React + Vite completo, pensado para entregar produtividade
          máxima e código limpo desde o primeiro commit.
        </Text>

        <Title order={2} size="h3">
          Principais Tecnologias
        </Title>
        <List
          spacing="sm"
          size="md"
          icon={
            <ThemeIcon color="blue" variant="light" radius="xl">
              <IconBolt size={16} />
            </ThemeIcon>
          }
        >
          <List.Item>Vite 7 – build ultrarrápido e HMR instantâneo.</List.Item>
          <List.Item>React 19 + TypeScript estrito.</List.Item>
          <List.Item>
            Mantine 8 – biblioteca de componentes acessível e tematizável.
          </List.Item>
          <List.Item>Emotion para estilização CSS-in-JS.</List.Item>
          <List.Item
            icon={
              <ThemeIcon color="green" variant="light" radius="xl">
                <IconTestPipe size={16} />
              </ThemeIcon>
            }
          >
            Vitest & Testing Library para testes rápidos e integrados ao Vite.
          </List.Item>
          <List.Item
            icon={
              <ThemeIcon color="orange" variant="light" radius="xl">
                <IconGitCommit size={16} />
              </ThemeIcon>
            }
          >
            Husky, lint-staged, Commitlint & Commitizen garantindo qualidade de
            código e histórico padronizado.
          </List.Item>
          <List.Item
            icon={
              <ThemeIcon color="grape" variant="light" radius="xl">
                <IconChecklist size={16} />
              </ThemeIcon>
            }
          >
            ESLint (a11y, import-sort) & Prettier com sort-imports automático.
          </List.Item>
          <List.Item
            icon={
              <ThemeIcon color="cyan" variant="light" radius="xl">
                <IconWorld size={16} />
              </ThemeIcon>
            }
          >
            PWA Ready via vite-plugin-pwa.
          </List.Item>
        </List>

        <Title order={2} size="h3">
          Scripts úteis
        </Title>
        <List
          spacing="sm"
          size="md"
          icon={
            <ThemeIcon color="teal" variant="light" radius="xl">
              <IconDeviceLaptop size={16} />
            </ThemeIcon>
          }
        >
          <List.Item>
            <Badge variant="light">npm run dev</Badge> – inicia o server (porta
            fixa 5173).
          </List.Item>
          <List.Item>
            <Badge variant="light">npm run build</Badge> – build de produção e
            divisão de chunks.
          </List.Item>
          <List.Item>
            <Badge variant="light">npm run format</Badge> – Prettier + ESLint
            fix.
          </List.Item>
          <List.Item>
            <Badge variant="light">npm run test:ci</Badge> – testes + coverage
            (workflow CI).
          </List.Item>
        </List>
      </Stack>
    </Container>
  )
}
