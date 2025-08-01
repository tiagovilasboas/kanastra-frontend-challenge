// Debug utility for Spotify authentication
export function debugAuthUrl() {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID
  const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI
  const scopes = ['user-read-private', 'user-read-email']

  const scopeString = scopes.join(' ')
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopeString)}`

  console.log('🔍 Debug Auth URL:')
  console.log('Client ID:', clientId)
  console.log('Redirect URI:', redirectUri)
  console.log('Scopes:', scopeString)
  console.log('Full URL:', authUrl)

  return authUrl
}

export function validateAuthConfig() {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID
  const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI

  console.log('🔍 Validating Auth Config:')
  console.log('✅ Client ID exists:', !!clientId)
  console.log('✅ Redirect URI exists:', !!redirectUri)
  console.log('✅ Redirect URI is HTTP:', redirectUri?.startsWith('http://'))
  console.log(
    '✅ Redirect URI has callback:',
    redirectUri?.includes('/callback'),
  )

  const issues = []
  if (!clientId) issues.push('Missing VITE_SPOTIFY_CLIENT_ID')
  if (!redirectUri) issues.push('Missing VITE_SPOTIFY_REDIRECT_URI')
  if (redirectUri && !redirectUri.startsWith('http://')) {
    issues.push('Redirect URI should use HTTP (not HTTPS) for localhost')
  }
  if (redirectUri && !redirectUri.includes('/callback')) {
    issues.push('Redirect URI should end with /callback')
  }

  if (issues.length > 0) {
    console.error('❌ Issues found:', issues)
    return false
  }

  console.log('✅ All validations passed!')
  return true
}
