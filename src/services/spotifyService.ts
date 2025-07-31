import axios, { AxiosInstance, AxiosResponse } from 'axios'

import {
  SearchParams,
  SpotifyArtist,
  SpotifyArtistAlbumsResponse,
  SpotifyArtistTopTracksResponse,
  SpotifyError,
  SpotifySearchResponse,
} from '@/types/spotify'

class SpotifyService {
  private api: AxiosInstance
  private accessToken: string | null = null

  constructor() {
    this.api = axios.create({
      baseURL: 'https://api.spotify.com/v1',
      timeout: 10000,
    })

    // Interceptor para adicionar token de autorização
    this.api.interceptors.request.use(
      (config) => {
        if (this.accessToken) {
          config.headers.Authorization = `Bearer ${this.accessToken}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      },
    )

    // Interceptor para tratamento de erros
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expirado, redirecionar para login
          this.handleTokenExpired()
        }
        return Promise.reject(error)
      },
    )
  }

  // Configurar token de acesso
  setAccessToken(token: string) {
    this.accessToken = token
  }

  // Obter token de acesso
  getAccessToken(): string | null {
    return this.accessToken
  }

  // Gerar URL de autorização
  getAuthUrl(): string {
    const clientId = 'c6c3457349a542d59b8e0dcc39c4047a'
    const redirectUri = 'https://localhost:5173/callback'
    const scopes = [
      'user-read-private',
      'user-read-email',
      'user-read-playback-state',
      'user-modify-playback-state',
      'user-read-currently-playing',
      'streaming',
      'app-remote-control',
      'playlist-read-private',
      'playlist-read-collaborative',
      'playlist-modify-public',
      'playlist-modify-private',
      'user-library-read',
      'user-library-modify',
      'user-top-read',
      'user-read-recently-played',
      'user-follow-read',
      'user-follow-modify',
    ].join(' ')

    return `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(
      redirectUri,
    )}&scope=${encodeURIComponent(scopes)}`
  }

  // Extrair token da URL de callback
  extractTokenFromUrl(url: string): string | null {
    const hash = url.split('#')[1]
    if (!hash) return null

    const params = new URLSearchParams(hash)
    return params.get('access_token')
  }

  // Buscar artistas
  async searchArtists(params: SearchParams): Promise<SpotifySearchResponse> {
    try {
      const response = await this.api.get('/search', {
        params: {
          q: params.query,
          type: 'artist',
          limit: params.limit || 20,
          offset: params.offset || 0,
        },
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Obter detalhes do artista
  async getArtist(id: string): Promise<SpotifyArtist> {
    try {
      const response = await this.api.get(`/artists/${id}`)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Obter top tracks do artista
  async getArtistTopTracks(
    artistId: string,
    market: string = 'BR',
  ): Promise<SpotifyArtistTopTracksResponse> {
    try {
      const response = await this.api.get(
        `/artists/${artistId}/top-tracks?market=${market}`,
      )
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Obter álbuns do artista
  async getArtistAlbums(
    artistId: string,
    params: {
      limit?: number
      offset?: number
      include_groups?: string
    } = {},
  ): Promise<SpotifyArtistAlbumsResponse> {
    try {
      const response = await this.api.get(`/artists/${artistId}/albums`, {
        params: {
          limit: params.limit || 20,
          offset: params.offset || 0,
          include_groups: params.include_groups || 'album,single',
        },
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Tratamento de erros
  private handleError(error: unknown): Error {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: unknown } }
      if (axiosError.response?.data) {
        const spotifyError = axiosError.response.data as SpotifyError
        return new Error(spotifyError.error.message)
      }
    }
    return new Error('Erro na comunicação com a API do Spotify')
  }

  // Tratamento de token expirado
  private handleTokenExpired() {
    this.accessToken = null
    // Redirecionar para login
    window.location.href = this.getAuthUrl()
  }

  // Verificar se está autenticado
  isAuthenticated(): boolean {
    return !!this.accessToken
  }

  // Fazer logout
  logout() {
    this.accessToken = null
    // Limpar localStorage se necessário
    localStorage.removeItem('spotify_token')
  }
}

// Instância singleton do serviço
export const spotifyService = new SpotifyService()

// Hook para usar o serviço
export const useSpotifyService = () => {
  return spotifyService
}
