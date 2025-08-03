import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { CookieManager } from '@/utils/cookies'

export const GlobalDebugComponent: React.FC = () => {
  const { t } = useTranslation()
  const [debugInfo, setDebugInfo] = useState<string>('')
  const [isVisible, setIsVisible] = useState(false)

  const runDebug = async () => {
    const info = []

    // Check cookies
    info.push('=== COOKIES ===')
    info.push(`All cookies: ${document.cookie || 'No cookies found'}`)

    const cookieVerifier = CookieManager.getCodeVerifier()
    info.push(
      `Code verifier from cookies: ${cookieVerifier ? 'Found' : 'Not found'}`,
    )

    // Check localStorage
    info.push('\n=== LOCALSTORAGE ===')
    const localStorageToken = localStorage.getItem('spotify_token')
    const localStorageVerifier = localStorage.getItem('spotify_code_verifier')
    info.push(`Access token: ${localStorageToken ? 'Found' : 'Not found'}`)
    info.push(`Code verifier: ${localStorageVerifier ? 'Found' : 'Not found'}`)

    // Check repository auth status
    info.push('\n=== REPOSITORY AUTH STATUS ===')
    try {
      const { spotifyRepository } = await import('@/repositories')
      const authStatus = spotifyRepository.getAuthStatus()
      info.push(
        `Repository access token: ${authStatus.hasAccessToken ? 'Set' : 'Not set'}`,
      )
      info.push(
        `Repository client token: ${authStatus.hasClientToken ? 'Set' : 'Not set'}`,
      )
      info.push(
        `Repository localStorage sync: ${authStatus.localStorageToken === authStatus.hasAccessToken ? 'OK' : 'MISMATCH'}`,
      )
    } catch (error) {
      info.push(`Repository status check failed: ${error}`)
    }

    // Check environment variables
    info.push('\n=== ENVIRONMENT ===')
    info.push(
      `Client ID: ${import.meta.env.VITE_SPOTIFY_CLIENT_ID ? 'Set' : 'Not set'}`,
    )
    info.push(
      `Client Secret: ${import.meta.env.VITE_SPOTIFY_CLIENT_SECRET ? 'Set' : 'Not set'}`,
    )
    info.push(
      `Redirect URI: ${import.meta.env.VITE_SPOTIFY_REDIRECT_URI || 'Not set'}`,
    )

    // Check URL parameters
    info.push('\n=== URL PARAMETERS ===')
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const state = urlParams.get('state')
    info.push(`Code: ${code ? 'Present' : 'Not present'}`)
    info.push(`State: ${state ? 'Present' : 'Not present'}`)

    // Check current page
    info.push(`Current page: ${window.location.pathname}`)
    info.push(`Full URL: ${window.location.href}`)

    setDebugInfo(info.join('\n'))
  }

  const clearAll = () => {
    CookieManager.clearCodeVerifier()
    localStorage.removeItem('spotify_token')
    localStorage.removeItem('spotify_code_verifier')
    setDebugInfo('All authentication data cleared')
  }

  const reloadToken = async () => {
    try {
      const { spotifyRepository } = await import('@/repositories')
      const token = localStorage.getItem('spotify_token')
      if (token) {
        spotifyRepository.setAccessToken(token)
        setDebugInfo('Token reloaded from localStorage')
      } else {
        setDebugInfo('No token found in localStorage to reload')
      }
    } catch (error) {
      setDebugInfo(`Error reloading token: ${error}`)
    }
  }

  return (
    <div className="global-debug">
      <button
        className="global-debug-toggle"
        onClick={() => setIsVisible(!isVisible)}
        title={t('ui:toggleDebugPanel', 'Toggle Debug Panel')}
      >
        {t('ui:debugIcon', '🔧')}
      </button>

      {isVisible && (
        <div className="global-debug-panel">
          <div className="debug-card">
            <div className="debug-header">
              <h3 className="debug-title">
                {t('ui:debugIcon', '🔧')} {t('ui:globalDebug', 'Global Debug')}
              </h3>
              <button
                onClick={() => setIsVisible(false)}
                className="debug-close"
                aria-label={t('ui:close', 'Close')}
              >
                {t('ui:closeIcon', '✕')}
              </button>
            </div>

            <div className="debug-actions">
              <button onClick={runDebug} className="debug-button">
                {t('ui:runDebug', 'Run Debug')}
              </button>
              <button onClick={reloadToken} className="debug-button">
                {t('ui:reloadToken', 'Reload Token')}
              </button>
              <button
                onClick={clearAll}
                className="debug-button debug-button-danger"
              >
                {t('ui:clearAll', 'Clear All')}
              </button>
            </div>

            {debugInfo && <div className="debug-output">{debugInfo}</div>}
          </div>
        </div>
      )}
    </div>
  )
}
