import { useQuery } from '@tanstack/react-query'

// Utilitário para detecção de dispositivo
export class DeviceDetection {
  /**
   * Verifica se o dispositivo é mobile baseado na largura da tela
   */
  static isMobile(): boolean {
    return window.innerWidth < 768 // Breakpoint md do Tailwind
  }

  /**
   * Verifica se o dispositivo é desktop
   */
  static isDesktop(): boolean {
    return !this.isMobile()
  }

  /**
   * Retorna o tipo de dispositivo atual
   */
  static getDeviceType(): 'mobile' | 'desktop' {
    return this.isMobile() ? 'mobile' : 'desktop'
  }
}

/**
 * Hook para detectar mudanças de tamanho de tela usando React Query
 * Retorna true se for mobile, false se for desktop
 */
export function useDeviceDetection(): boolean {
  const { data: isMobile } = useQuery({
    queryKey: ['device-detection'],
    queryFn: () => DeviceDetection.isMobile(),
    staleTime: 0, // Always check device type
    refetchOnWindowFocus: true, // Check when window gains focus
    refetchOnMount: true,
  })

  return isMobile ?? DeviceDetection.isMobile()
}
