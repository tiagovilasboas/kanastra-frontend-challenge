/**
 * Constantes centralizadas para limites da API Spotify.
 * Remove magic numbers do código e facilita ajustes de performance.
 */

export const API_LIMITS = {
  /** Limites de busca */
  SEARCH: {
    /** Limite padrão para buscas individuais */
    DEFAULT: 20,
    /** Limite quando "tudo" está selecionado (modo All) */
    ALL_MODE: 5,
    /** Limite para preview/preview de seções */
    PREVIEW: 6,
    /** Limite para carregar mais resultados */
    LOAD_MORE: 20,
  },
  /** Limites de paginação */
  PAGINATION: {
    /** Limite padrão de itens por página */
    DEFAULT: 20,
    /** Limite máximo permitido pela API */
    MAX: 50,
    /** Limite mínimo para busca */
    MIN: 1,
  },
  /** Limites específicos por tipo de conteúdo */
  CONTENT: {
    /** Limite para artistas populares na home */
    POPULAR_ARTISTS: 10,
    /** Limite para álbuns em destaque */
    FEATURED_ALBUMS: 6,
    /** Limite para playlists recomendadas */
    RECOMMENDED_PLAYLISTS: 8,
  },
  /** Limites de cache */
  CACHE: {
    /** Tempo de vida do cache em segundos */
    TTL: 300, // 5 minutos
    /** Número máximo de itens em cache */
    MAX_ITEMS: 1000,
  },
} as const

/**
 * Configuração de limites por tipo de busca
 */
export const SEARCH_LIMITS: Record<string, number> = {
  default: API_LIMITS.SEARCH.DEFAULT,
  all: API_LIMITS.SEARCH.ALL_MODE,
  artist: API_LIMITS.SEARCH.DEFAULT,
  album: API_LIMITS.SEARCH.DEFAULT,
  track: API_LIMITS.SEARCH.DEFAULT,
  playlist: API_LIMITS.SEARCH.DEFAULT,
  show: API_LIMITS.SEARCH.DEFAULT,
  episode: API_LIMITS.SEARCH.DEFAULT,
  audiobook: API_LIMITS.SEARCH.DEFAULT,
} as const

/**
 * Valida se um limite está dentro dos parâmetros aceitáveis
 */
export function validateLimit(limit: number): number {
  if (limit < API_LIMITS.PAGINATION.MIN) {
    return API_LIMITS.PAGINATION.MIN
  }
  if (limit > API_LIMITS.PAGINATION.MAX) {
    return API_LIMITS.PAGINATION.MAX
  }
  return limit
}

/**
 * Obtém o limite apropriado baseado no contexto
 */
export function getSearchLimit(type: string, isAllMode = false): number {
  if (isAllMode) {
    return API_LIMITS.SEARCH.ALL_MODE
  }

  return SEARCH_LIMITS[type] || API_LIMITS.SEARCH.DEFAULT
}
