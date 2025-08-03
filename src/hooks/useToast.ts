import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export const useToast = () => {
  const { t } = useTranslation()

  const showError = (messageKey: string, fallback?: string) => {
    toast.error(t(messageKey, fallback || messageKey))
  }

  const showSuccess = (messageKey: string, fallback?: string) => {
    toast.success(t(messageKey, fallback || messageKey))
  }

  const showInfo = (messageKey: string, fallback?: string) => {
    toast.info(t(messageKey, fallback || messageKey))
  }

  const showWarning = (messageKey: string, fallback?: string) => {
    toast.warning(t(messageKey, fallback || messageKey))
  }

  return {
    showError,
    showSuccess,
    showInfo,
    showWarning,
  }
}
