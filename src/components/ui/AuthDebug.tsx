import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useSpotifyAuth } from '@/hooks/useSpotifyAuth'
import { spotifyRepository } from '@/repositories'

interface AuthDebugProps {
  show?: boolean
}

export const AuthDebug: React.FC<AuthDebugProps> = ({ show = false }) => {
  const { t } = useTranslation()
  const { isAuthenticated } = useSpotifyAuth()
  const [debugInfo, setDebugInfo] = useState({
    hasToken: false,
    tokenLength: 0,
    hasCodeVerifier: false,
    currentUrl: '',
    userAgent: '',
  })

  useEffect(() => {
    const updateDebugInfo = () => {
      const token = localStorage.getItem('spotify_token')
      const codeVerifier = document.cookie.includes('spotify_code_verifier')
      
      setDebugInfo({
        hasToken: !!token,
        tokenLength: token?.length || 0,
        hasCodeVerifier: codeVerifier,
        currentUrl: window.location.href,
        userAgent: navigator.userAgent,
      })
    }

    updateDebugInfo()
    const interval = setInterval(updateDebugInfo, 1000)
    return () => clearInterval(interval)
  }, [])

  if (!show) return null

  return (
    <div className="auth-debug" style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: '#1a1a1a',
      color: '#fff',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      fontFamily: 'monospace',
      zIndex: 9999,
      maxWidth: '300px',
      wordBreak: 'break-all'
    }}>
      <h4>🔍 Auth Debug</h4>
      <div>Authenticated: {isAuthenticated ? '✅' : '❌'}</div>
      <div>Has Token: {debugInfo.hasToken ? '✅' : '❌'}</div>
      <div>Token Length: {debugInfo.tokenLength}</div>
      <div>Has Code Verifier: {debugInfo.hasCodeVerifier ? '✅' : '❌'}</div>
      <div>URL: {debugInfo.currentUrl}</div>
      <button
        onClick={() => {
          console.log('Auth Debug Info:', debugInfo)
          console.log('Spotify Repository Token:', spotifyRepository.getAccessToken())
          console.log('LocalStorage Token:', localStorage.getItem('spotify_token'))
        }}
        style={{
          background: '#1DB954',
          color: '#fff',
          border: 'none',
          padding: '5px 10px',
          borderRadius: '3px',
          cursor: 'pointer',
          marginTop: '5px'
        }}
      >
        Log to Console
      </button>
    </div>
  )
} 