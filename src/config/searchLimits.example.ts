// Exemplo de configuração personalizada de limites de busca
// Copie este arquivo para searchLimits.custom.ts e ajuste conforme necessário

import { SearchLimitsConfig } from './searchLimits'

// Configuração personalizada para diferentes contextos
export const CUSTOM_SEARCH_LIMITS: SearchLimitsConfig = {
  default: 15,      // Limite padrão reduzido
  all: 3,          // Apenas 3 de cada tipo quando "tudo" está selecionado
  artist: 25,      // Mais artistas
  album: 30,       // Mais álbuns
  track: 20,       // Limite padrão para músicas
  playlist: 15,    // Menos playlists
  show: 10,        // Menos shows
  episode: 8,      // Menos episódios
  audiobook: 5,    // Menos audiobooks
}

// Configuração para dispositivos móveis (atualizada)
export const MOBILE_SEARCH_LIMITS: SearchLimitsConfig = {
  default: 15,      // Limite padrão para tipos específicos
  all: 4,          // 4 de cada tipo quando "tudo" está selecionado
  artist: 15,      // 15 artistas
  album: 10,       // 10 álbuns
  track: 15,       // 15 músicas
  playlist: 12,    // 12 playlists
  show: 10,        // 10 shows
  episode: 8,      // 8 episódios
  audiobook: 6,    // 6 audiobooks
}

// Configuração para desktop com mais recursos (atualizada)
export const DESKTOP_SEARCH_LIMITS: SearchLimitsConfig = {
  default: 25,      // Limite padrão para tipos específicos
  all: 5,          // 5 de cada tipo quando "tudo" está selecionado
  artist: 25,      // 25 artistas
  album: 10,       // 10 álbuns
  track: 25,       // 25 músicas
  playlist: 20,    // 20 playlists
  show: 15,        // 15 shows
  episode: 12,     // 12 episódios
  audiobook: 10,   // 10 audiobooks
}

// Como usar:
// 1. Importe a configuração desejada
// 2. Passe para a função getSearchLimit como segundo parâmetro
// 
// Exemplo:
// import { getSearchLimit } from './searchLimits'
// import { CUSTOM_SEARCH_LIMITS } from './searchLimits.example'
// 
// const limit = getSearchLimit(types, CUSTOM_SEARCH_LIMITS) 