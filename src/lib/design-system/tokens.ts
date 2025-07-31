// Design System Tokens - Spotify Official

export const colors = {
  // Cores oficiais do Spotify
  spotify: {
    green: '#1DB954', // Verde principal do Spotify
    black: '#191414', // Preto oficial do Spotify
    white: '#FFFFFF',
  },
  
  // Cores de fundo (baseadas no app do Spotify)
  background: {
    primary: '#121212', // Fundo principal (dark mode)
    secondary: '#181818', // Fundo secundário
    tertiary: '#282828', // Fundo terciário
    elevated: '#404040', // Fundo elevado
    card: '#181818', // Fundo dos cards
    cardHover: '#282828', // Fundo dos cards no hover
  },
  
  // Cores de texto (baseadas no app do Spotify)
  text: {
    primary: '#FFFFFF', // Texto principal
    secondary: '#B3B3B3', // Texto secundário
    tertiary: '#727272', // Texto terciário
    disabled: '#535353', // Texto desabilitado
    muted: '#A7A7A7', // Texto suave
  },
  
  // Cores de estado
  state: {
    success: '#1DB954', // Verde Spotify
    warning: '#FFD700', // Amarelo
    error: '#E91429', // Vermelho
    info: '#1DB954', // Verde Spotify
  },
  
  // Cores de gradiente (usadas no Spotify)
  gradients: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    spotify: 'linear-gradient(135deg, #1DB954 0%, #1ed760 100%)',
    dark: 'linear-gradient(135deg, #121212 0%, #282828 100%)',
  },
  
  // Cores de overlay
  overlay: {
    light: 'rgba(0, 0, 0, 0.3)',
    medium: 'rgba(0, 0, 0, 0.5)',
    dark: 'rgba(0, 0, 0, 0.7)',
  },
}

export const typography = {
  // Fontes oficiais do Spotify
  fontFamily: {
    primary: 'Circular, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    secondary: 'Circular, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: 'SF Mono, Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace',
  },
  
  // Tamanhos de fonte (baseados no Spotify)
  fontSize: {
    xs: '11px', // Texto muito pequeno
    sm: '12px', // Texto pequeno
    base: '14px', // Texto base
    md: '16px', // Texto médio
    lg: '18px', // Texto grande
    xl: '20px', // Texto extra grande
    '2xl': '24px', // Título pequeno
    '3xl': '28px', // Título médio
    '4xl': '32px', // Título grande
    '5xl': '36px', // Título extra grande
  },
  
  // Pesos de fonte (baseados no Spotify)
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  
  // Altura de linha (baseada no Spotify)
  lineHeight: {
    tight: '1.2',
    normal: '1.4',
    relaxed: '1.6',
    loose: '1.8',
  },
  
  // Espaçamento entre letras
  letterSpacing: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
  },
}

export const spacing = {
  // Sistema de espaçamento mobile-first
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
  '4xl': '96px',
}

export const borderRadius = {
  // Border radius baseado no Spotify
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '20px',
  full: '9999px',
}

export const shadows = {
  // Sombras baseadas no Spotify
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  spotify: '0 8px 16px rgba(0, 0, 0, 0.3)', // Sombra específica do Spotify
}

export const transitions = {
  // Transições baseadas no Spotify
  fast: '150ms ease-in-out',
  normal: '200ms ease-in-out',
  slow: '300ms ease-in-out',
  spotify: 'all 0.2s ease-in-out', // Transição padrão do Spotify
}

// Breakpoints mobile-first (baseados no Spotify)
export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
}

// Z-index scale
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
}

// Layout tokens específicos do Spotify
export const layout = {
  // Header
  headerHeight: {
    mobile: '56px',
    desktop: '64px',
  },
  
  // Sidebar (se aplicável)
  sidebarWidth: {
    mobile: '100%',
    desktop: '240px',
  },
  
  // Container
  containerMaxWidth: {
    mobile: '100%',
    tablet: '768px',
    desktop: '1200px',
  },
  
  // Grid
  gridGap: {
    mobile: '16px',
    tablet: '24px',
    desktop: '32px',
  },
  
  // Card
  cardPadding: {
    mobile: '16px',
    tablet: '20px',
    desktop: '24px',
  },
}

// Iconografia (tamanhos baseados no Spotify)
export const icons = {
  size: {
    xs: '12px',
    sm: '16px',
    md: '20px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
  },
  
  // Espaçamento entre ícone e texto
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
  },
} 