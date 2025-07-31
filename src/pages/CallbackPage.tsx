import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Stack, Title, Text, Loader } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import { Container } from '@/components/layout'
import { spotifyService } from '@/services/spotifyService'
import { spotifyStyles } from '@/lib/design-system/utils'

export default function CallbackPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const processCallback = async () => {
      try {
        const currentUrl = window.location.href
        const token = spotifyService.extractTokenFromUrl(currentUrl)
        
        if (token) {
          // Configurar o token no serviço
          spotifyService.setAccessToken(token)
          
          // Salvar no localStorage
          localStorage.setItem('spotify_token', token)
          
          setStatus('success')
          
          // Redirecionar para home após um breve delay
          setTimeout(() => {
            navigate('/')
          }, 2000)
        } else {
          setStatus('error')
          setErrorMessage('Token não encontrado na URL')
        }
      } catch (error) {
        setStatus('error')
        setErrorMessage(error instanceof Error ? error.message : 'Erro desconhecido')
      }
    }

    processCallback()
  }, [navigate])

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <Stack gap="lg" align="center">
            <Loader size="lg" color="#1DB954" />
            <Title
              order={2}
              style={{
                ...spotifyStyles.textPrimary,
                ...spotifyStyles.fontWeightSemibold,
              }}
            >
              {t('auth.connecting')}
            </Title>
            <Text
              style={{
                ...spotifyStyles.textSecondary,
                ...spotifyStyles.textBase,
                textAlign: 'center',
              }}
            >
              {t('auth.connectingMessage')}
            </Text>
          </Stack>
        )
      
      case 'success':
        return (
          <Stack gap="lg" align="center">
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#1DB954',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
              }}
            >
              ✓
            </div>
            <Title
              order={2}
              style={{
                ...spotifyStyles.textPrimary,
                ...spotifyStyles.fontWeightSemibold,
              }}
            >
              {t('auth.success')}
            </Title>
            <Text
              style={{
                ...spotifyStyles.textSecondary,
                ...spotifyStyles.textBase,
                textAlign: 'center',
              }}
            >
              {t('auth.successMessage')}
            </Text>
          </Stack>
        )
      
      case 'error':
        return (
          <Stack gap="lg" align="center">
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#E91429',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                color: '#FFFFFF',
              }}
            >
              ✕
            </div>
            <Title
              order={2}
              style={{
                ...spotifyStyles.textPrimary,
                ...spotifyStyles.fontWeightSemibold,
              }}
            >
              {t('auth.error')}
            </Title>
            <Text
              style={{
                ...spotifyStyles.textSecondary,
                ...spotifyStyles.textBase,
                textAlign: 'center',
              }}
            >
              {errorMessage || t('auth.errorMessage')}
            </Text>
            <button
              onClick={() => navigate('/')}
              style={{
                backgroundColor: '#1DB954',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '20px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
              }}
            >
              {t('auth.backToHome')}
            </button>
          </Stack>
        )
      
      default:
        return null
    }
  }

  return (
    <Container variant="mobile-first">
      <Stack
        gap="xl"
        align="center"
        justify="center"
        style={{
          minHeight: '100vh',
          padding: '48px 24px',
        }}
      >
        {renderContent()}
      </Stack>
    </Container>
  )
} 