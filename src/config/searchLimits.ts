// Configuração de limites de busca por página
export interface SearchLimitsConfig {
  default: number
  all: number
  artist: number
  album: number
  track: number
  playlist: number
  show: number
  episode: number
  audiobook: number
}

// Limites padrão para cada contexto
export const SEARCH_LIMITS: SearchLimitsConfig = {
  default: 20, // Limite padrão para buscas individuais
  all: 5, // Limite quando "tudo" está selecionado
  artist: 20, // Limite específico para artistas
  album: 10, // Limite específico para álbuns
  track: 20, // Limite específico para músicas
  playlist: 20, // Limite específico para playlists
  show: 20, // Limite específico para shows
  episode: 20, // Limite específico para episódios
  audiobook: 20, // Limite específico para audiobooks
}

// Configuração específica para mobile
export const MOBILE_SEARCH_LIMITS: SearchLimitsConfig = {
  default: 15, // Limite menor para mobile
  all: 4, // 4 de cada tipo quando "tudo" está selecionado
  artist: 15, // Menos artistas
  album: 10, // 10 álbuns
  track: 15, // Menos músicas
  playlist: 12, // Menos playlists
  show: 10, // Menos shows
  episode: 8, // Menos episódios
  audiobook: 6, // Menos audiobooks
}

// Configuração específica para desktop
export const DESKTOP_SEARCH_LIMITS: SearchLimitsConfig = {
  default: 20, // Limite padrão para buscas individuais
  all: 5, // 5 de cada tipo quando "tudo" está selecionado
  artist: 20, // 20 artistas
  album: 10, // 10 álbuns
  track: 20, // 20 músicas
  playlist: 20, // 20 playlists
  show: 15, // 15 shows
  episode: 12, // 12 episódios
  audiobook: 10, // 10 audiobooks
}

// Função para obter o limite baseado no tipo de busca
export function getSearchLimit(
  types: string[],
  config: SearchLimitsConfig = SEARCH_LIMITS,
): number {
  // Se todos os tipos estão selecionados, usa o limite "all"
  if (types.length === 7) {
    return config.all
  }

  // Se apenas um tipo está selecionado, usa o limite padrão (não o específico)
  if (types.length === 1) {
    return config.default
  }

  // Para múltiplos tipos (mas não todos), usa o limite padrão
  return config.default
}

// Função para obter o limite baseado no tipo específico
export function getLimitByType(
  type: string,
  config: SearchLimitsConfig = SEARCH_LIMITS,
): number {
  // Mapeamento direto dos tipos para as chaves da configuração
  const typeMapping: Record<string, keyof SearchLimitsConfig> = {
    artist: 'artist',
    album: 'album',
    track: 'track',
    playlist: 'playlist',
    show: 'show',
    episode: 'episode',
    audiobook: 'audiobook',
  }

  const configKey = typeMapping[type]
  const limit = configKey ? config[configKey] : config.default

  // Debug logs
  console.log('📊 getLimitByType Debug:', {
    type,
    configKey,
    config,
    limit,
    availableKeys: Object.keys(config),
    typeMapping,
  })

  return limit
}

// Função para obter a configuração baseada no dispositivo
export function getDeviceBasedConfig(): SearchLimitsConfig {
  if (typeof window === 'undefined') {
    return SEARCH_LIMITS // Fallback para SSR
  }

  const isMobile = window.innerWidth < 768
  return isMobile ? MOBILE_SEARCH_LIMITS : DESKTOP_SEARCH_LIMITS
}

// Função para obter o limite baseado no tipo de busca e dispositivo
export function getSearchLimitWithDevice(types: string[]): number {
  const config = getDeviceBasedConfig()

  // Se todos os tipos estão selecionados, usa o limite "all" do dispositivo
  if (types.length === 7) {
    return config.all
  }

  // Para tipos específicos, usa o limite específico do tipo
  if (types.length === 1) {
    const type = types[0]
    return getLimitByType(type, config)
  }

  // Para múltiplos tipos (mas não todos), usa o limite padrão
  return config.default
}
