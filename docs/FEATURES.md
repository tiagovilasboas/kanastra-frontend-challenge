# 🎯 Funcionalidades

## Busca Avançada de Artistas

A aplicação oferece uma busca poderosa e flexível para encontrar artistas no Spotify.

### Filtros Disponíveis

#### 🎵 Gêneros Musicais

- **rock**: Rock clássico e contemporâneo
- **pop**: Pop mainstream e alternativo
- **hip-hop**: Hip-hop e rap
- **electronic**: Música eletrônica
- **jazz**: Jazz tradicional e contemporâneo
- **classical**: Música clássica
- **country**: Country e folk
- **r&b**: R&B e soul
- **reggae**: Reggae e dancehall
- **blues**: Blues tradicional e moderno
- **folk**: Folk e música tradicional
- **metal**: Metal e heavy metal

#### 📅 Ano de Lançamento

- **Range personalizado**: Defina um período específico
- **Exemplo**: `year:1990-1999` para artistas dos anos 90
- **Ano único**: `year:2020` para artistas de 2020

#### 📊 Popularidade

- **Score de 0-100**: Baseado no número de plays no Spotify
- **Range personalizado**: `popularity:70-100` para artistas populares
- **Filtro mínimo**: `popularity:50` para artistas com pelo menos 50 de popularidade

#### 🌍 Mercado

- **Países específicos**: `market:BR` para Brasil
- **Múltiplos mercados**: `market:BR,US` para Brasil e Estados Unidos
- **Mercado global**: Deixe vazio para todos os mercados

#### 🔞 Conteúdo

- **Conteúdo explícito**: Incluir ou excluir conteúdo explícito
- **Dados externos**: Incluir informações de fontes externas

### Exemplos de Busca

```typescript
// Busca por artistas de rock dos anos 90
'rock year:1990-1999'

// Busca por artistas de hip-hop do Brasil
'hip-hop market:BR'

// Busca por artistas de jazz com alta popularidade
'jazz popularity:70-100'

// Busca por artistas de pop dos anos 2000 no Brasil
'pop year:2000-2009 market:BR'

// Busca por artistas de electronic com popularidade média
'electronic popularity:50-80'

// Busca por artistas de metal dos anos 80
'metal year:1980-1989'
```

### Interface de Busca

#### 🔍 Campo de Busca

- **Debounce automático**: Busca após 500ms de inatividade
- **Busca em tempo real**: Resultados atualizados conforme você digita
- **Limpeza fácil**: Botão para limpar a busca

#### 🎛️ Filtros Avançados

- **Painel expansível**: Clique em "Filtros Avançados" para expandir
- **Contador de filtros**: Mostra quantos filtros estão ativos
- **Limpeza rápida**: Botão para limpar todos os filtros

#### 📱 Responsivo

- **Desktop**: Painel lateral com todos os filtros
- **Mobile**: Modal com filtros organizados
- **Tablet**: Layout adaptativo

## Visualização de Resultados

### 🎨 Cards de Artistas

- **Imagem do artista**: Foto de perfil em alta qualidade
- **Nome do artista**: Nome completo
- **Gêneros**: Lista de gêneros musicais
- **Popularidade**: Score visual de popularidade
- **Seguidores**: Número de seguidores no Spotify

### 📄 Paginação

- **Carregamento infinito**: Role para carregar mais resultados
- **Indicador de loading**: Mostra quando está carregando
- **Contador de resultados**: "Mostrando X de Y artistas"

### 🔗 Navegação

- **Clique no artista**: Vai para a página de detalhes
- **Link externo**: Abre o perfil no Spotify
- **Compartilhamento**: Compartilhe o link do artista

## Página de Detalhes do Artista

### 📊 Informações Gerais

- **Foto de perfil**: Imagem em alta resolução
- **Nome e gêneros**: Informações básicas
- **Seguidores**: Número de seguidores
- **Popularidade**: Score de popularidade

### 🎵 Top Músicas

- **Lista das 10 principais**: Músicas mais populares
- **Preview de áudio**: Ouça 30 segundos de cada música
- **Informações da música**: Duração, álbum, data de lançamento

### 💿 Álbuns

- **Lista de álbuns**: Todos os álbuns do artista
- **Filtros por tipo**: Álbuns, singles, compilações
- **Paginação**: Carregue mais álbuns conforme necessário
- **Informações do álbum**: Data de lançamento, número de faixas

## Funcionalidades Avançadas

### 🌐 Internacionalização

- **Português**: Interface em português brasileiro
- **Inglês**: Interface em inglês
- **Seletor de idioma**: Mude o idioma a qualquer momento

### 🎨 Tema

- **Tema escuro**: Interface moderna e elegante
- **Responsivo**: Adapta-se a diferentes tamanhos de tela
- **Acessibilidade**: Suporte a navegação por teclado

### ⚡ Performance

- **Cache inteligente**: React Query para cache otimizado
- **Carregamento lazy**: Componentes carregados sob demanda
- **Otimização de imagens**: Imagens otimizadas para web
