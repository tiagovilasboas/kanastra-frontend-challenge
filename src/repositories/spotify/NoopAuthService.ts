export class NotConfiguredError extends Error {
  constructor(service: string) {
    super(
      `${service} is not configured. Please check your environment variables.`,
    )
    this.name = 'NotConfiguredError'
  }
}

export class NoopAuthService {
  async generateAuthUrl(): Promise<string> {
    throw new NotConfiguredError('SpotifyAuthService')
  }

  async handleTokenExchange(): Promise<{ access_token: string }> {
    throw new NotConfiguredError('SpotifyAuthService')
  }

  extractCodeFromUrl(): { code: string | null; state: string | null } {
    throw new NotConfiguredError('SpotifyAuthService')
  }

  async getClientToken(): Promise<{ access_token: string }> {
    throw new NotConfiguredError('SpotifyAuthService')
  }
}
