import { SpotifyRepository } from '@/repositories/spotify/SpotifyRepository'
import { SpotifySearchType, SpotifyTypeMapping } from '@/types/spotify'
import { logger } from '@/utils/logger'

// Interface para resultados de busca tipados
export interface SearchResult<T extends SpotifySearchType> {
  items: SpotifyTypeMapping[T][]
  total: number
  hasMore: boolean
}

// Interface para resultados agregados
export interface AggregatedSearchResults {
  artists: SearchResult<SpotifySearchType.ARTIST>
  albums: SearchResult<SpotifySearchType.ALBUM>
  tracks: SearchResult<SpotifySearchType.TRACK>
  playlists: SearchResult<SpotifySearchType.PLAYLIST>
  shows: SearchResult<SpotifySearchType.SHOW>
  episodes: SearchResult<SpotifySearchType.EPISODE>
  audiobooks: SearchResult<SpotifySearchType.AUDIOBOOK>
}

// Interface para estado de busca
export interface SearchState {
  isLoading: boolean
  isLoadingMore: boolean
  error: string | null
  hasMore: boolean
  totalResults: number
}

// Utility class for result processing
export class SearchResultProcessor {
  /**
   * Processa resultados de busca para um tipo específico
   */
  static processResults<T extends SpotifySearchType>(
    response: Record<string, unknown>,
    type: T,
    paging?: { limit?: number; offset?: number },
  ): SearchResult<T> {
    const key = `${type}s` as keyof typeof response
    const data = response[key] as
      | { items?: unknown[]; total?: number }
      | undefined

    const offset = paging?.offset || 0
    const limit = paging?.limit

    logger.debug(`Processing ${key}:`, { data, response, limit, offset })

    if (!data) {
      logger.debug(`No data found for ${key}`)
      return {
        items: [],
        total: 0,
        hasMore: false,
      } as SearchResult<T>
    }

    const items = (data.items || []) as SpotifyTypeMapping[T][]
    const total = data.total || 0

    // Calcula hasMore como: (offset + items.length) < total
    const hasMore = offset + items.length < total

    const result = {
      items,
      total,
      hasMore,
    } as SearchResult<T>

    logger.debug(`Result for ${key}:`, result)
    return result
  }

  /**
   * Agrega resultados de múltiplos tipos
   */
  static aggregateResults(
    responses: Array<{
      type: SpotifySearchType
      response: Record<string, unknown> | null
    }>,
  ): AggregatedSearchResults {
    const results: Record<string, SearchResult<SpotifySearchType>> = {
      artists: { items: [], total: 0, hasMore: false },
      albums: { items: [], total: 0, hasMore: false },
      tracks: { items: [], total: 0, hasMore: false },
      playlists: { items: [], total: 0, hasMore: false },
      shows: { items: [], total: 0, hasMore: false },
      episodes: { items: [], total: 0, hasMore: false },
      audiobooks: { items: [], total: 0, hasMore: false },
    }

    responses.forEach(({ type, response }) => {
      if (response) {
        const key = `${type}s` as keyof AggregatedSearchResults
        results[key] = this.processResults(response, type)
      }
    })

    return results as unknown as AggregatedSearchResults
  }

  /**
   * Calcula o total de resultados
   */
  static calculateTotalResults(results: AggregatedSearchResults): number {
    return Object.values(results).reduce(
      (total, result) => total + result.total,
      0,
    )
  }

  /**
   * Verifica se há mais resultados disponíveis
   */
  static hasMoreResults(results: AggregatedSearchResults): boolean {
    return Object.values(results).some((result) => result.hasMore)
  }

  /**
   * Processa a resposta de busca otimizada para múltiplos tipos
   */
  static processMultipleTypesResponse(
    response: Record<string, unknown>,
    types: SpotifySearchType[],
    limit?: number,
    offset?: number,
  ): AggregatedSearchResults {
    const results: Record<string, SearchResult<SpotifySearchType>> = {
      artists: { items: [], total: 0, hasMore: false },
      albums: { items: [], total: 0, hasMore: false },
      tracks: { items: [], total: 0, hasMore: false },
      playlists: { items: [], total: 0, hasMore: false },
      shows: { items: [], total: 0, hasMore: false },
      episodes: { items: [], total: 0, hasMore: false },
      audiobooks: { items: [], total: 0, hasMore: false },
    }

    // Debug: log the response structure
    logger.debug('Spotify API Response:', response)
    logger.debug('Search Types:', types)
    logger.debug('Processing with limit and offset', { limit, offset })

    types.forEach((type) => {
      // Pula o sentinel ALL, pois ele não mapeia para nenhum tipo específico
      if (type === SpotifySearchType.ALL) {
        return
      }

      const key = `${type}s` as keyof AggregatedSearchResults
      logger.debug(`Processing ${key}:`, response[key])
      results[key] = this.processResults(response, type, { limit, offset })
    })

    logger.debug('Aggregated Results:', results)
    return results as unknown as AggregatedSearchResults
  }
}

// Class for building search queries
export class SearchQueryBuilder {
  /**
   * Constrói query avançada com filtros compatíveis com Spotify
   */
  static buildAdvancedQuery(
    baseQuery: string,
    filters: {
      artistName?: string
      albumName?: string
      genres?: string[]
      genre?: string
      yearFrom?: number
      yearTo?: number
    },
  ): string {
    let query = baseQuery.trim()

    // Add artist name filter
    if (filters.artistName && filters.artistName.trim()) {
      query += ` artist:${filters.artistName.trim()}`
    }

    // Add album name filter
    if (filters.albumName && filters.albumName.trim()) {
      query += ` album:${filters.albumName.trim()}`
    }

    // Add genre filters (support both arrays and single values)
    if (filters.genres && filters.genres.length > 0) {
      const genreFilters = filters.genres
        .map((genre) => `genre:${genre}`)
        .join(' ')
      query += ` ${genreFilters}`
    } else if (filters.genre && filters.genre.trim()) {
      query += ` genre:${filters.genre.trim()}`
    }

    // Adiciona filtro de ano (sintaxe year:YYYY ou year:YYYY-YYYY)
    if (filters.yearFrom || filters.yearTo) {
      if (filters.yearFrom && filters.yearTo) {
        const yearFilter = `year:${filters.yearFrom}-${filters.yearTo}`
        query += ` ${yearFilter}`
      } else if (filters.yearFrom) {
        const yearFilter = `year:${filters.yearFrom}`
        query += ` ${yearFilter}`
      } else if (filters.yearTo) {
        const yearFilter = `year:${filters.yearTo}`
        query += ` ${yearFilter}`
      }
    }

    return query.trim()
  }

  /**
   * Valida query de busca
   */
  static validateQuery(query: string): { isValid: boolean; error?: string } {
    if (!query || query.trim().length === 0) {
      return { isValid: false, error: 'Query não pode estar vazia' }
    }

    if (query.trim().length < 2) {
      return { isValid: false, error: 'Query deve ter pelo menos 2 caracteres' }
    }

    if (query.trim().length > 100) {
      return { isValid: false, error: 'Query muito longa' }
    }

    return { isValid: true }
  }
}

// Classe para gerenciamento de estado de busca
export class SearchStateManager {
  /**
   * Cria estado inicial
   */
  static createInitialState(): SearchState {
    return {
      isLoading: false,
      isLoadingMore: false,
      error: null,
      hasMore: false,
      totalResults: 0,
    }
  }

  /**
   * Atualiza estado para loading
   */
  static setLoading(state: SearchState): SearchState {
    return {
      ...state,
      isLoading: true,
      error: null,
    }
  }

  /**
   * Atualiza estado para loading more
   */
  static setLoadingMore(state: SearchState): SearchState {
    return {
      ...state,
      isLoadingMore: true,
    }
  }

  /**
   * Atualiza estado com sucesso
   */
  static setSuccess(
    state: SearchState,
    totalResults: number,
    hasMore: boolean,
  ): SearchState {
    return {
      ...state,
      isLoading: false,
      isLoadingMore: false,
      error: null,
      totalResults,
      hasMore,
    }
  }

  /**
   * Atualiza estado com erro
   */
  static setError(state: SearchState, error: string): SearchState {
    return {
      ...state,
      isLoading: false,
      isLoadingMore: false,
      error,
    }
  }
}

// Main search service class
export class SearchService {
  private repository: SpotifyRepository

  constructor(repository: SpotifyRepository) {
    this.repository = repository
  }

  /**
   * Executa busca para múltiplos tipos
   */
  async searchMultipleTypes(
    query: string,
    types: SpotifySearchType[],
    filters: Record<string, unknown>,
    limit: number,
    offset: number = 0,
  ): Promise<{
    results: AggregatedSearchResults
    state: SearchState
  }> {
    try {
      const advancedQuery = SearchQueryBuilder.buildAdvancedQuery(
        query,
        filters,
      )

      // Garante que market esteja sempre presente
      const market = (filters.market as string) ?? 'BR'
      const filtersWithMarket = { ...filters, market }

      // Detecta se é modo "All" (mais de 1 tipo OU todos os tipos OU sentinel ALL)
      const isAllMode =
        types.length > 1 ||
        types.length === 7 ||
        types.includes(SpotifySearchType.ALL)

      // Se há sentinel ALL, expande para todos os tipos
      const searchTypes = types.includes(SpotifySearchType.ALL)
        ? [
            SpotifySearchType.ARTIST,
            SpotifySearchType.ALBUM,
            SpotifySearchType.TRACK,
            SpotifySearchType.PLAYLIST,
            SpotifySearchType.SHOW,
            SpotifySearchType.EPISODE,
            SpotifySearchType.AUDIOBOOK,
          ]
        : types

      // Aplica limite de 5 para modo "All", caso contrário usa o limite fornecido
      const adjustedLimit = isAllMode ? 5 : limit

      logger.debug('🔍 SearchService Debug Limits:', {
        types,
        searchTypes,
        typesLength: types.length,
        isAllMode,
        providedLimit: limit,
        adjustedLimit,
        offset,
        market,
      })

      const response = await this.repository.searchMultipleTypes(
        advancedQuery,
        searchTypes,
        filtersWithMarket,
        adjustedLimit,
        offset,
      )

      // Process Spotify API results
      logger.debug('SearchService.searchMultipleTypes - Response:', response)
      logger.debug('SearchService.searchMultipleTypes - Types:', types)
      logger.debug(
        'SearchService.searchMultipleTypes - SearchTypes:',
        searchTypes,
      )

      const results = SearchResultProcessor.processMultipleTypesResponse(
        response,
        searchTypes,
        adjustedLimit,
        offset,
      )
      const totalResults = SearchResultProcessor.calculateTotalResults(results)
      const hasMore = SearchResultProcessor.hasMoreResults(results)

      logger.debug(
        'SearchService.searchMultipleTypes - Processed Results:',
        results,
      )
      logger.debug(
        'SearchService.searchMultipleTypes - Total Results:',
        totalResults,
      )
      logger.debug('SearchService.searchMultipleTypes - Has More:', hasMore)

      const state = SearchStateManager.setSuccess(
        SearchStateManager.createInitialState(),
        totalResults,
        hasMore,
      )

      logger.debug('SearchService.searchMultipleTypes - Final State:', state)
      return { results, state }
    } catch (error) {
      logger.error('Search service error', error)
      const state = SearchStateManager.setError(
        SearchStateManager.createInitialState(),
        error instanceof Error ? error.message : 'Erro na busca',
      )

      return { results: this.getEmptyResults(), state }
    }
  }

  /**
   * Busca apenas artistas
   */
  async searchArtists(
    query: string,
    filters: Record<string, unknown>,
    limit: number = 20,
    offset: number = 0,
  ): Promise<{
    results: SearchResult<SpotifySearchType.ARTIST>
    state: SearchState
  }> {
    try {
      const validation = SearchQueryBuilder.validateQuery(query)
      if (!validation.isValid) {
        throw new Error(validation.error)
      }

      const advancedQuery = SearchQueryBuilder.buildAdvancedQuery(
        query,
        filters,
      )

      // Garante que market esteja sempre presente
      const market = (filters.market as string) ?? 'BR'

      const response = await this.repository.searchArtists(
        advancedQuery,
        limit,
        offset,
        market,
      )

      const results = SearchResultProcessor.processResults(
        response,
        SpotifySearchType.ARTIST,
        { limit, offset },
      )
      const state = SearchStateManager.setSuccess(
        SearchStateManager.createInitialState(),
        results.total,
        results.hasMore,
      )

      return { results, state }
    } catch (error) {
      logger.error('Artist search error', error)
      const state = SearchStateManager.setError(
        SearchStateManager.createInitialState(),
        error instanceof Error ? error.message : 'Erro desconhecido',
      )

      return {
        results: { items: [], total: 0, hasMore: false },
        state,
      }
    }
  }

  /**
   * Busca apenas álbuns
   */
  async searchAlbums(
    query: string,
    filters: Record<string, unknown>,
    limit: number = 20,
    offset: number = 0,
  ): Promise<{
    results: SearchResult<SpotifySearchType.ALBUM>
    state: SearchState
  }> {
    try {
      const validation = SearchQueryBuilder.validateQuery(query)
      if (!validation.isValid) {
        throw new Error(validation.error)
      }

      const advancedQuery = SearchQueryBuilder.buildAdvancedQuery(
        query,
        filters,
      )

      // Garante que market esteja sempre presente
      const market = (filters.market as string) ?? 'BR'

      const response = await this.repository.searchAlbums(
        advancedQuery,
        limit,
        offset,
        market,
      )

      const results = SearchResultProcessor.processResults(
        response,
        SpotifySearchType.ALBUM,
        { limit, offset },
      )

      const state = SearchStateManager.setSuccess(
        SearchStateManager.createInitialState(),
        results.total,
        results.hasMore,
      )

      return { results, state }
    } catch (error) {
      logger.error('Album search error', error)
      const state = SearchStateManager.setError(
        SearchStateManager.createInitialState(),
        error instanceof Error ? error.message : 'Erro desconhecido',
      )

      return {
        results: { items: [], total: 0, hasMore: false },
        state,
      }
    }
  }

  /**
   * Busca apenas músicas
   */
  async searchTracks(
    query: string,
    filters: Record<string, unknown>,
    limit: number = 20,
    offset: number = 0,
  ): Promise<{
    results: SearchResult<SpotifySearchType.TRACK>
    state: SearchState
  }> {
    try {
      const validation = SearchQueryBuilder.validateQuery(query)
      if (!validation.isValid) {
        throw new Error(validation.error)
      }

      const advancedQuery = SearchQueryBuilder.buildAdvancedQuery(
        query,
        filters,
      )

      // Garante que market esteja sempre presente
      const market = (filters.market as string) ?? 'BR'

      const response = await this.repository.searchTracks(
        advancedQuery,
        limit,
        offset,
        market,
      )

      const results = SearchResultProcessor.processResults(
        response,
        SpotifySearchType.TRACK,
        { limit, offset },
      )
      const state = SearchStateManager.setSuccess(
        SearchStateManager.createInitialState(),
        results.total,
        results.hasMore,
      )

      return { results, state }
    } catch (error) {
      logger.error('Track search error', error)
      const state = SearchStateManager.setError(
        SearchStateManager.createInitialState(),
        error instanceof Error ? error.message : 'Erro desconhecido',
      )

      return {
        results: { items: [], total: 0, hasMore: false },
        state,
      }
    }
  }

  /**
   * Busca apenas playlists
   */
  async searchPlaylists(
    query: string,
    filters: Record<string, unknown>,
    limit: number = 20,
    offset: number = 0,
  ): Promise<{
    results: SearchResult<SpotifySearchType.PLAYLIST>
    state: SearchState
  }> {
    try {
      const validation = SearchQueryBuilder.validateQuery(query)
      if (!validation.isValid) {
        throw new Error(validation.error)
      }

      const advancedQuery = SearchQueryBuilder.buildAdvancedQuery(
        query,
        filters,
      )

      // Garante que market esteja sempre presente
      const market = (filters.market as string) ?? 'BR'

      const response = await this.repository.searchPlaylists(
        advancedQuery,
        limit,
        offset,
        market,
      )

      const results = SearchResultProcessor.processResults(
        response,
        SpotifySearchType.PLAYLIST,
        { limit, offset },
      )
      const state = SearchStateManager.setSuccess(
        SearchStateManager.createInitialState(),
        results.total,
        results.hasMore,
      )

      return { results, state }
    } catch (error) {
      logger.error('Playlist search error', error)
      const state = SearchStateManager.setError(
        SearchStateManager.createInitialState(),
        error instanceof Error ? error.message : 'Erro desconhecido',
      )

      return {
        results: { items: [], total: 0, hasMore: false },
        state,
      }
    }
  }

  /**
   * Busca apenas shows
   */
  async searchShows(
    query: string,
    filters: Record<string, unknown>,
    limit: number = 20,
    offset: number = 0,
  ): Promise<{
    results: SearchResult<SpotifySearchType.SHOW>
    state: SearchState
  }> {
    try {
      const validation = SearchQueryBuilder.validateQuery(query)
      if (!validation.isValid) {
        throw new Error(validation.error)
      }

      const advancedQuery = SearchQueryBuilder.buildAdvancedQuery(
        query,
        filters,
      )

      // Garante que market esteja sempre presente
      const market = (filters.market as string) ?? 'BR'

      const response = await this.repository.searchShows(
        advancedQuery,
        limit,
        offset,
        market,
      )

      const results = SearchResultProcessor.processResults(
        response,
        SpotifySearchType.SHOW,
        { limit, offset },
      )
      const state = SearchStateManager.setSuccess(
        SearchStateManager.createInitialState(),
        results.total,
        results.hasMore,
      )

      return { results, state }
    } catch (error) {
      logger.error('Show search error', error)
      const state = SearchStateManager.setError(
        SearchStateManager.createInitialState(),
        error instanceof Error ? error.message : 'Erro desconhecido',
      )

      return {
        results: { items: [], total: 0, hasMore: false },
        state,
      }
    }
  }

  /**
   * Busca apenas episódios
   */
  async searchEpisodes(
    query: string,
    filters: Record<string, unknown>,
    limit: number = 20,
    offset: number = 0,
  ): Promise<{
    results: SearchResult<SpotifySearchType.EPISODE>
    state: SearchState
  }> {
    try {
      const validation = SearchQueryBuilder.validateQuery(query)
      if (!validation.isValid) {
        throw new Error(validation.error)
      }

      const advancedQuery = SearchQueryBuilder.buildAdvancedQuery(
        query,
        filters,
      )

      // Garante que market esteja sempre presente
      const market = (filters.market as string) ?? 'BR'

      const response = await this.repository.searchEpisodes(
        advancedQuery,
        limit,
        offset,
        market,
      )

      const results = SearchResultProcessor.processResults(
        response,
        SpotifySearchType.EPISODE,
        { limit, offset },
      )
      const state = SearchStateManager.setSuccess(
        SearchStateManager.createInitialState(),
        results.total,
        results.hasMore,
      )

      return { results, state }
    } catch (error) {
      logger.error('Episode search error', error)
      const state = SearchStateManager.setError(
        SearchStateManager.createInitialState(),
        error instanceof Error ? error.message : 'Erro desconhecido',
      )

      return {
        results: { items: [], total: 0, hasMore: false },
        state,
      }
    }
  }

  /**
   * Busca apenas audiobooks
   */
  async searchAudiobooks(
    query: string,
    filters: Record<string, unknown>,
    limit: number = 20,
    offset: number = 0,
  ): Promise<{
    results: SearchResult<SpotifySearchType.AUDIOBOOK>
    state: SearchState
  }> {
    try {
      const validation = SearchQueryBuilder.validateQuery(query)
      if (!validation.isValid) {
        throw new Error(validation.error)
      }

      const advancedQuery = SearchQueryBuilder.buildAdvancedQuery(
        query,
        filters,
      )

      // Garante que market esteja sempre presente
      const market = (filters.market as string) ?? 'BR'

      const response = await this.repository.searchAudiobooks(
        advancedQuery,
        limit,
        offset,
        market,
      )

      const results = SearchResultProcessor.processResults(
        response,
        SpotifySearchType.AUDIOBOOK,
        { limit, offset },
      )
      const state = SearchStateManager.setSuccess(
        SearchStateManager.createInitialState(),
        results.total,
        results.hasMore,
      )

      return { results, state }
    } catch (error) {
      logger.error('Audiobook search error', error)
      const state = SearchStateManager.setError(
        SearchStateManager.createInitialState(),
        error instanceof Error ? error.message : 'Erro desconhecido',
      )

      return {
        results: { items: [], total: 0, hasMore: false },
        state,
      }
    }
  }

  /**
   * Executa busca para "Tudo" com limite fixo de 5 itens por tipo
   */
  async searchAllTypes(
    query: string,
    types: SpotifySearchType[],
    filters: Record<string, unknown>,
    offset: number = 0,
  ): Promise<{
    results: AggregatedSearchResults
    state: SearchState
  }> {
    try {
      const advancedQuery = SearchQueryBuilder.buildAdvancedQuery(
        query,
        filters,
      )

      // Garante que market esteja sempre presente
      const market = (filters.market as string) ?? 'BR'
      const filtersWithMarket = { ...filters, market }

      // Limite fixo de 5 para busca "Tudo"
      const allLimit = 5

      logger.debug('🔍 SearchService.searchAllTypes - Debug:', {
        query,
        types,
        allLimit,
        offset,
        market,
      })

      const response = await this.repository.searchMultipleTypes(
        advancedQuery,
        types,
        filtersWithMarket,
        allLimit,
        offset,
      )

      // Processa os resultados da API do Spotify
      logger.debug('SearchService.searchAllTypes - Response:', response)
      logger.debug('SearchService.searchAllTypes - Types:', types)

      const results = SearchResultProcessor.processMultipleTypesResponse(
        response,
        types,
        allLimit,
        offset,
      )
      const totalResults = SearchResultProcessor.calculateTotalResults(results)
      const hasMore = SearchResultProcessor.hasMoreResults(results)

      logger.debug('SearchService.searchAllTypes - Processed Results:', results)
      logger.debug(
        'SearchService.searchAllTypes - Total Results:',
        totalResults,
      )
      logger.debug('SearchService.searchAllTypes - Has More:', hasMore)

      const state = SearchStateManager.setSuccess(
        SearchStateManager.createInitialState(),
        totalResults,
        hasMore,
      )

      logger.debug('SearchService.searchAllTypes - Final State:', state)
      return { results, state }
    } catch (error) {
      logger.error('Search all types service error', error)
      const state = SearchStateManager.setError(
        SearchStateManager.createInitialState(),
        error instanceof Error ? error.message : 'Erro na busca',
      )

      return { results: this.getEmptyResults(), state }
    }
  }

  /**
   * Carrega mais resultados
   */
  async loadMore(
    query: string,
    types: SpotifySearchType[],
    filters: Record<string, unknown>,
    currentResults: AggregatedSearchResults,
    offset: number,
  ): Promise<{
    results: AggregatedSearchResults
    state: SearchState
  }> {
    try {
      const advancedQuery = SearchQueryBuilder.buildAdvancedQuery(
        query,
        filters,
      )

      // Garante que market esteja sempre presente
      const market = (filters.market as string) ?? 'BR'
      const filtersWithMarket = { ...filters, market }

      // Fixed limit of 20 for loadMore
      const adjustedLimit = 20

      // Chama o repository e obtém a resposta bruta da API
      const apiResponse = await this.repository.searchMultipleTypes(
        advancedQuery,
        types,
        filtersWithMarket,
        adjustedLimit,
        offset,
      )

      // Processa a resposta antes de retornar
      const parsed = SearchResultProcessor.processMultipleTypesResponse(
        apiResponse,
        types,
        adjustedLimit,
        offset,
      )
      const totalResults = SearchResultProcessor.calculateTotalResults(parsed)
      const hasMore = SearchResultProcessor.hasMoreResults(parsed)
      const state = SearchStateManager.setSuccess(
        SearchStateManager.createInitialState(),
        totalResults,
        hasMore,
      )

      return { results: parsed, state }
    } catch (error) {
      logger.error('Load more service error', error)
      const state = SearchStateManager.setError(
        SearchStateManager.createInitialState(),
        error instanceof Error ? error.message : 'Erro ao carregar mais',
      )

      return { results: currentResults, state }
    }
  }

  /**
   * Retorna resultados vazios
   */
  private getEmptyResults(): AggregatedSearchResults {
    const emptyResult = { items: [], total: 0, hasMore: false }

    return {
      artists: emptyResult,
      albums: emptyResult,
      tracks: emptyResult,
      playlists: emptyResult,
      shows: emptyResult,
      episodes: emptyResult,
      audiobooks: emptyResult,
    }
  }
}
