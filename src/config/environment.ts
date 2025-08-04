interface EnvironmentConfig {
  spotify: {
    clientId: string
    clientSecret: string
    redirectUri: string
    scopes: string[]
    baseUrl: string
    authUrl: string
  }
  app: {
    name: string
    version: string
    environment: 'development' | 'production' | 'test'
  }
  api: {
    timeout: number
    retryAttempts: number
  }
}

const getEnvironmentConfig = (): EnvironmentConfig => {
  const isDevelopment = import.meta.env.DEV
  const isProduction = import.meta.env.PROD

  // Validate required environment variables
  const requiredEnvVars = {
    VITE_SPOTIFY_CLIENT_ID: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
    VITE_SPOTIFY_CLIENT_SECRET: import.meta.env.VITE_SPOTIFY_CLIENT_SECRET,
    VITE_SPOTIFY_REDIRECT_URI: import.meta.env.VITE_SPOTIFY_REDIRECT_URI,
  }

  const missingVars = Object.entries(requiredEnvVars)
    .filter(([, value]) => !value)
    .map(([key]) => key)

  if (missingVars.length > 0) {
    console.warn('Missing required environment variables:', missingVars)
    console.warn('App will work in demo mode without Spotify API access')
  }

  return {
    spotify: {
      clientId: requiredEnvVars.VITE_SPOTIFY_CLIENT_ID!,
      clientSecret: requiredEnvVars.VITE_SPOTIFY_CLIENT_SECRET!,
      redirectUri: requiredEnvVars.VITE_SPOTIFY_REDIRECT_URI!,
      scopes: ['user-read-private', 'user-read-email'],
      baseUrl: 'https://api.spotify.com/v1',
      authUrl: 'https://accounts.spotify.com/authorize',
    },
    app: {
      name: import.meta.env.VITE_APP_NAME || 'Spotify Artist Explorer',
      version: import.meta.env.VITE_APP_VERSION || '1.0.0',
      environment: isDevelopment
        ? 'development'
        : isProduction
          ? 'production'
          : 'test',
    },
    api: {
      timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
      retryAttempts: Number(import.meta.env.VITE_API_RETRY_ATTEMPTS) || 3,
    },
  }
}

export const config = getEnvironmentConfig()

// Type-safe environment variables
export const getSpotifyConfig = () => config.spotify
export const getAppConfig = () => config.app
export const getApiConfig = () => config.api
