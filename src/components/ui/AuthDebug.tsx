import { Button, Card, Stack, Title } from '@mantine/core'
import { useState } from 'react'

import { CookieManager } from '@/utils/cookies'

export const AuthDebug: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<string>('')

  const runDebug = () => {
    const info = []

    // Check cookies
    info.push('=== COOKIES ===')
    info.push(`All cookies: ${document.cookie || 'No cookies found'}`)
    
    const cookieVerifier = CookieManager.getCodeVerifier()
    info.push(`Code verifier from cookies: ${cookieVerifier ? 'Found' : 'Not found'}`)

    // Check localStorage
    info.push('\n=== LOCALSTORAGE ===')
    const localStorageToken = localStorage.getItem('spotify_token')
    const localStorageVerifier = localStorage.getItem('spotify_code_verifier')
    info.push(`Access token: ${localStorageToken ? 'Found' : 'Not found'}`)
    info.push(`Code verifier: ${localStorageVerifier ? 'Found' : 'Not found'}`)

    // Check environment variables
    info.push('\n=== ENVIRONMENT ===')
    info.push(`Client ID: ${import.meta.env.VITE_SPOTIFY_CLIENT_ID ? 'Set' : 'Not set'}`)
    info.push(`Client Secret: ${import.meta.env.VITE_SPOTIFY_CLIENT_SECRET ? 'Set' : 'Not set'}`)
    info.push(`Redirect URI: ${import.meta.env.VITE_SPOTIFY_REDIRECT_URI || 'Not set'}`)

    // Check URL parameters
    info.push('\n=== URL PARAMETERS ===')
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const state = urlParams.get('state')
    info.push(`Code: ${code ? 'Present' : 'Not present'}`)
    info.push(`State: ${state ? 'Present' : 'Not present'}`)

    setDebugInfo(info.join('\n'))
  }

  const clearAll = () => {
    CookieManager.clearCodeVerifier()
    localStorage.removeItem('spotify_token')
    localStorage.removeItem('spotify_code_verifier')
    setDebugInfo('All authentication data cleared')
  }

  return (
    <Card className="p-4 border border-gray-200 rounded-lg">
      <Stack gap="md">
        <Title order={3} className="text-lg font-semibold">
          🔧 Auth Debug
        </Title>
        
        <div className="flex gap-2">
          <Button onClick={runDebug} size="sm" variant="outline">
            Run Debug
          </Button>
          <Button onClick={clearAll} size="sm" variant="outline" color="red">
            Clear All
          </Button>
        </div>

        {debugInfo && (
          <div className="bg-gray-100 p-3 rounded text-sm font-mono whitespace-pre-wrap">
            {debugInfo}
          </div>
        )}
      </Stack>
    </Card>
  )
} 