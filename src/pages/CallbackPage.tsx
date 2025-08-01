import { Loader, Stack, Text, Title } from '@mantine/core'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Container } from '@/components/layout'
import { spotifyRepository } from '@/repositories'
import { logger } from '@/utils/logger'

export const CallbackPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading',
  )
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const processCallback = async () => {
      logger.debug('Processing callback', { url: window.location.href })

      try {
        // Extrair código e state da URL
        const { code, state } = spotifyRepository.extractCodeFromUrl(
          window.location.href,
        )

        if (!code) {
          logger.error('No code found in URL')
          setStatus('error')
          setErrorMessage(t('auth:tokenNotFound'))
          return
        }

        logger.debug('Code found, exchanging for token')

        // Trocar código por token
        const token = await spotifyRepository.exchangeCodeForToken(
          code,
          state || undefined,
        )

        logger.debug('Token received, setting up')

        // Configurar token no repository
        spotifyRepository.setAccessToken(token)

        // Salvar no localStorage
        localStorage.setItem('spotify_token', token)

        // Marcar como sucesso
        setStatus('success')

        // Redirecionar imediatamente após sucesso
        logger.debug('Redirecting to home page')
        navigate('/', { replace: true })
      } catch (error) {
        logger.error('Callback processing error', error)
        setStatus('error')
        
        // Melhorar tratamento de erros específicos
        let message = t('auth:unknownError')
        
        if (error instanceof Error) {
          if (error.message.includes('Authentication session expired')) {
            message = t('auth:codeVerifierNotFound')
          } else if (error.message.includes('INVALID_CLIENT')) {
            message = 'Configuração do cliente inválida. Verifique suas credenciais.'
          } else if (error.message.includes('redirect_uri')) {
            message = 'URI de redirecionamento inválida. Verifique sua configuração.'
          } else if (error.message.includes('code_verifier')) {
            message = 'Falha na verificação do código de autenticação. Tente novamente.'
          } else {
            message = error.message
          }
        }
        
        setErrorMessage(message)
      }
    }

    processCallback()
  }, [navigate, t])

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <Stack gap="lg" align="center">
            <Loader size="lg" color="#1DB954" />
            <Title order={2} className="text-primary font-bold text-2xl">
              {t('auth:connecting')}
            </Title>
            <Text className="text-secondary text-base text-center">
              {t('auth:connectingMessage')}
            </Text>
          </Stack>
        )

      case 'success':
        return (
          <Stack gap="lg" align="center">
            <div
              className="w-16 h-16 bg-spotify-green rounded-full flex items-center justify-center"
              aria-label={t('auth:successIconLabel', 'Success')}
            >
              <span className="text-white text-2xl">
                {t('auth:successIcon', '✓')}
              </span>
            </div>
            <Title order={2} className="text-primary font-bold text-2xl">
              {t('auth:success')}
            </Title>
            <Text className="text-secondary text-base text-center">
              {t('auth:redirecting', 'Redirecionando...')}
            </Text>
          </Stack>
        )

      case 'error':
        return (
          <Stack gap="lg" align="center">
            <div
              className="w-16 h-16 bg-error rounded-full flex items-center justify-center"
              aria-label={t('auth:errorIconLabel', 'Error')}
            >
              <span className="text-white text-2xl">
                {t('auth:errorIcon', '✗')}
              </span>
            </div>
            <Title order={2} className="text-primary font-bold text-2xl">
              {t('auth:error')}
            </Title>
            <Text className="text-secondary text-base text-center">
              {errorMessage || t('auth:errorMessage')}
            </Text>
            <button
              onClick={() => navigate('/', { replace: true })}
              className="btn-spotify btn-secondary"
            >
              {t('auth:backToHome')}
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
        className="min-h-screen p-3xl"
      >
        {renderContent()}
      </Stack>
    </Container>
  )
}
