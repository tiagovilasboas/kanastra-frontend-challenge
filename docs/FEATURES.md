# 🎯 Funcionalidades

## Busca Inteligente e Segmentada

A aplicação oferece uma busca poderosa e inteligente para encontrar artistas, álbuns e músicas no Spotify, com segmentação automática de resultados.

### 🎵 Tipos de Conteúdo

#### **Artistas**

- **Busca Segmentada**: Resultados organizados por relevância
  - **Resultados Exatos**: Correspondências perfeitas com o termo de busca
  - **Artistas Similares**: Artistas com estilo musical similar
  - **Artistas Relacionados**: Artistas frequentemente ouvidos juntos
  - **Outros Artistas**: Demais resultados da busca
- **Cards Interativos**: Layout Spotify-like com hover effects
- **Informações Detalhadas**: Gêneros, popularidade, seguidores

#### **Álbuns**

- **Grid Responsivo**: Layout adaptativo para diferentes telas
- **Informações Completas**: Título, artista, data de lançamento
- **Capa do Álbum**: Imagem em alta qualidade com fallback
- **Paginação**: "Carregar Mais" para resultados adicionais

#### **Músicas**

- **Lista Horizontal**: Layout similar ao Spotify
- **Informações Detalhadas**: Título, artista, álbum, duração
- **Indicador Explícito**: Marcação para conteúdo explícito
- **Capa do Álbum**: Imagem pequena para identificação visual

### 🔍 Filtros Avançados

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
- **Placeholder dinâmico**: Texto adaptativo ao tipo de busca

#### 🎛️ Seletor de Tipos

- **Radio buttons**: Seleção única entre artistas, álbuns, músicas
- **Ocultação inteligente**: Esconde quando não há busca ativa
- **Estados visuais**: Indicação clara do tipo selecionado

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

- **Imagem circular**: Foto de perfil em formato circular
- **Nome do artista**: Nome completo com truncamento
- **Tipo de artista**: Indicação visual do tipo de conteúdo
- **Hover effects**: Animações suaves e play button overlay
- **Click externo**: Abre perfil no Spotify em nova aba

### 🎵 Cards de Álbuns

- **Capa quadrada**: Imagem do álbum em formato quadrado
- **Informações concisas**: Título, data e artistas em uma linha
- **Hover effects**: Animações e play button overlay
- **Click externo**: Abre álbum no Spotify em nova aba

### 🎶 Lista de Músicas

- **Layout horizontal**: Similar ao Spotify
- **Número da faixa**: Indicação da posição
- **Capa do álbum**: Imagem pequena para identificação
- **Informações completas**: Título, artista, álbum, duração
- **Indicador explícito**: Marcação para conteúdo explícito
- **Click externo**: Abre música no Spotify em nova aba

### 📄 Paginação

- **Carregar Mais**: Botão para álbuns e músicas
- **Indicador de loading**: Mostra quando está carregando
- **Contador de resultados**: "Mostrando X de Y resultados"
- **Sem paginação**: Artistas não têm "Carregar Mais"

## Página de Detalhes do Artista

### 📊 Informações Gerais

- **Foto de perfil**: Imagem em alta resolução
- **Nome e gêneros**: Informações básicas
- **Seguidores**: Número de seguidores
- **Popularidade**: Score de popularidade
- **Botão de refresh**: Atualização com skeleton loading

### 🎵 Top Músicas

- **Lista horizontal**: Layout similar ao Spotify
- **Header com colunas**: #, Título, Álbum, Duração
- **10 principais**: Músicas mais populares do artista
- **Informações completas**: Duração, álbum, artistas
- **Click externo**: Abre música no Spotify em nova aba

### 💿 Álbuns

- **Grid responsivo**: Layout adaptativo
- **Paginação**: Navegação entre páginas
- **Informações do álbum**: Data de lançamento, número de faixas
- **Filtros por tipo**: Álbuns, singles, compilações
- **Click externo**: Abre álbum no Spotify em nova aba

## Páginas Específicas

### 🏠 Página Inicial

- **Artistas Populares**: Grid com artistas em destaque
- **Estado limpo**: Reset automático de buscas anteriores
- **Navegação intuitiva**: Links para busca e outras páginas

### 🎨 Página de Artistas

- **Lista completa**: Todos os artistas populares
- **Filtro por nome**: Busca em tempo real
- **Grid responsivo**: Layout adaptativo

### 💿 Página de Álbuns

- **Álbuns populares**: Lista de álbuns em destaque
- **Filtro por nome/artista**: Busca flexível
- **Grid responsivo**: Layout adaptativo

### ❤️ Página de Favoritos

- **Funcionalidade futura**: Em desenvolvimento
- **Mensagem informativa**: "Em breve" com descrição

## Funcionalidades Avançadas

### 🌐 Internacionalização

- **Português**: Interface em português brasileiro
- **Inglês**: Interface em inglês
- **Seletor de idioma**: Mude o idioma a qualquer momento
- **Interpolação dinâmica**: Variáveis em traduções funcionando
- **Organização por domínio**: Traduções organizadas por contexto

### 🎨 Interface Spotify-like

- **Design moderno**: Interface limpa e elegante
- **Hover effects**: Animações suaves e interativas
- **Skeletons inteligentes**: Loading states consistentes
- **Responsivo**: Adapta-se a diferentes tamanhos de tela
- **Acessibilidade**: Suporte a navegação por teclado

### ⚡ Performance

- **Cache inteligente**: React Query para cache otimizado
- **Carregamento lazy**: Componentes carregados sob demanda
- **Otimização de imagens**: Imagens otimizadas para web
- **Debounce**: Otimização de busca em tempo real
- **Estado global**: Zustand para gerenciamento eficiente

### 📱 Experiência Mobile

- **Header responsivo**: Adaptação para iPhone e dispositivos móveis
- **Navegação otimizada**: Sidebar e navegação mobile-friendly
- **Touch-friendly**: Elementos otimizados para toque
- **Grid adaptativo**: Layout que se ajusta ao tamanho da tela

### 🔐 Autenticação Inteligente

- **Modo público**: Busca básica sem login (client credentials)
- **Modo autenticado**: Funcionalidades completas com OAuth 2.0
- **Persistência de token**: Gerenciamento automático de sessão
- **Fallback inteligente**: Funciona mesmo sem autenticação
