import {
  getDeviceBasedConfig,
  getSearchLimitWithDevice,
} from '@/config/searchLimits'
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

// Classe utilitária para processamento de resultados
export class SearchResultProcessor {
  /**
   * Processa resultados de busca para um tipo específico
   */
  static processResults<T extends SpotifySearchType>(
    response: Record<string, unknown>,
    type: T,
  ): SearchResult<T> {
    const key = `${type}s` as keyof typeof response
    const data = response[key] as
      | { items?: unknown[]; total?: number }
      | undefined

    console.log(`Processing ${key}:`, { data, response })

    if (!data) {
      console.log(`No data found for ${key}`)
      return {
        items: [],
        total: 0,
        hasMore: false,
      } as SearchResult<T>
    }

    const result = {
      items: (data.items || []) as SpotifyTypeMapping[T][],
      total: data.total || 0,
      hasMore: (data.items?.length || 0) < (data.total || 0),
    } as SearchResult<T>

    console.log(`Result for ${key}:`, result)
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
    console.log('Spotify API Response:', response)
    console.log('Search Types:', types)

    types.forEach((type) => {
      const key = `${type}s` as keyof AggregatedSearchResults
      console.log(`Processing ${key}:`, response[key])
      results[key] = this.processResults(response, type)
    })

    console.log('Aggregated Results:', results)
    return results as unknown as AggregatedSearchResults
  }
}

// Classe para construção de queries de busca
export class SearchQueryBuilder {
  /**
   * Constrói query avançada com filtros
   */
  static buildAdvancedQuery(
    baseQuery: string,
    filters: {
      genres?: string[]
      yearFrom?: number
      yearTo?: number
      popularityFrom?: number
      popularityTo?: number
    },
  ): string {
    let query = baseQuery.trim()

    // Adiciona filtros de gênero
    if (filters.genres && filters.genres.length > 0) {
      const genreFilters = filters.genres
        .map((genre) => `genre:${genre}`)
        .join(' ')
      query += ` ${genreFilters}`
    }

    // Adiciona filtro de ano
    if (filters.yearFrom || filters.yearTo) {
      const yearFilter = `year:${filters.yearFrom || '*'}-${filters.yearTo || '*'}`
      query += ` ${yearFilter}`
    }

    // Adiciona filtro de popularidade
    if (filters.popularityFrom || filters.popularityTo) {
      const popularityFilter = `popularity:${filters.popularityFrom || 0}-${filters.popularityTo || 100}`
      query += ` ${popularityFilter}`
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

// Classe principal do serviço de busca
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
      const config = getDeviceBasedConfig()

      // Se todos os tipos estão selecionados ("Tudo"), usa o limite "all" para cada tipo
      // Caso contrário, usa o limite padrão
      const adjustedLimit =
        types.length === 7
          ? config.all
          : getSearchLimitWithDevice(types.map((t) => t.toLowerCase()))

      console.log('🔍 SearchService Debug Limits:', {
        types,
        typesLength: types.length,
        config,
        adjustedLimit,
        isAllTypes: types.length === 7,
      })

      const response = await this.repository.searchMultipleTypes(
        advancedQuery,
        types,
        filters,
        adjustedLimit,
        offset,
      )

      // Processa os resultados da API do Spotify
      console.log('SearchService.searchMultipleTypes - Response:', response)
      console.log('SearchService.searchMultipleTypes - Types:', types)

      const results = SearchResultProcessor.processMultipleTypesResponse(
        response,
        types,
      )
      const totalResults = SearchResultProcessor.calculateTotalResults(results)
      const hasMore = SearchResultProcessor.hasMoreResults(results)

      console.log(
        'SearchService.searchMultipleTypes - Processed Results:',
        results,
      )
      console.log(
        'SearchService.searchMultipleTypes - Total Results:',
        totalResults,
      )
      console.log('SearchService.searchMultipleTypes - Has More:', hasMore)

      const state = SearchStateManager.setSuccess(
        SearchStateManager.createInitialState(),
        totalResults,
        hasMore,
      )

      console.log('SearchService.searchMultipleTypes - Final State:', state)
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
      const response = await this.repository.searchArtists(
        advancedQuery,
        limit,
        offset,
      )

      const results = SearchResultProcessor.processResults(
        response,
        SpotifySearchType.ARTIST,
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
      const response = await this.repository.searchAlbums(
        advancedQuery,
        limit,
        offset,
      )

      const results = SearchResultProcessor.processResults(
        response,
        SpotifySearchType.ALBUM,
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
      const response = await this.repository.searchTracks(
        advancedQuery,
        limit,
        offset,
      )

      const results = SearchResultProcessor.processResults(
        response,
        SpotifySearchType.TRACK,
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
      const response = await this.repository.searchPlaylists(
        advancedQuery,
        limit,
        offset,
      )

      const results = SearchResultProcessor.processResults(
        response,
        SpotifySearchType.PLAYLIST,
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
      const response = await this.repository.searchShows(
        advancedQuery,
        limit,
        offset,
      )

      const results = SearchResultProcessor.processResults(
        response,
        SpotifySearchType.SHOW,
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
      const response = await this.repository.searchEpisodes(
        advancedQuery,
        limit,
        offset,
      )

      const results = SearchResultProcessor.processResults(
        response,
        SpotifySearchType.EPISODE,
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
      const response = await this.repository.searchAudiobooks(
        advancedQuery,
        limit,
        offset,
      )

      const results = SearchResultProcessor.processResults(
        response,
        SpotifySearchType.AUDIOBOOK,
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

      // Usa a configuração parametrizável de limites com detecção de dispositivo
      const adjustedLimit = getSearchLimitWithDevice(
        types.map((t) => t.toLowerCase()),
      )

      const { results, state } = await this.repository.searchMultipleTypes(
        advancedQuery,
        types,
        filters,
        adjustedLimit,
        offset,
      )

      return { results, state }
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
