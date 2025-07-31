import { 
  borderRadius, 
  breakpoints, 
  colors, 
  icons, 
  layout, 
  shadows, 
  spacing, 
  transitions, 
  typography 
} from './tokens'

// Função para criar estilos CSS customizados
export const createStyles = (styles: Record<string, unknown>) => {
  return styles
}

// Função para aplicar tokens de cores
export const getColor = (colorPath: string) => {
  const path = colorPath.split('.')
  let value: unknown = colors
  
  for (const key of path) {
    value = (value as Record<string, unknown>)[key]
    if (!value) break
  }
  
  return value as string || colors.spotify.green
}

// Função para aplicar espaçamentos
export const getSpacing = (size: keyof typeof spacing) => {
  return spacing[size]
}

// Função para aplicar border radius
export const getBorderRadius = (size: keyof typeof borderRadius) => {
  return borderRadius[size]
}

// Função para aplicar tipografia
export const getTypography = (variant: 'fontFamily' | 'fontSize' | 'fontWeight' | 'lineHeight' | 'letterSpacing', size?: string) => {
  if (variant === 'fontFamily') {
    return typography.fontFamily.primary
  }
  
  if (size && typography[variant] && typography[variant][size as keyof typeof typography[typeof variant]]) {
    return typography[variant][size as keyof typeof typography[typeof variant]]
  }
  
  return typography[variant]
}

// Função para aplicar sombras
export const getShadow = (size: keyof typeof shadows) => {
  return shadows[size]
}

// Função para aplicar transições
export const getTransition = (speed: keyof typeof transitions) => {
  return transitions[speed]
}

// Função para aplicar breakpoints
export const getBreakpoint = (size: keyof typeof breakpoints) => {
  return breakpoints[size]
}

// Classes CSS utilitárias do Spotify
export const spotifyStyles = {
  // Backgrounds
  bgPrimary: { backgroundColor: colors.background.primary },
  bgSecondary: { backgroundColor: colors.background.secondary },
  bgTertiary: { backgroundColor: colors.background.tertiary },
  bgElevated: { backgroundColor: colors.background.elevated },
  bgCard: { backgroundColor: colors.background.card },
  bgCardHover: { backgroundColor: colors.background.cardHover },
  
  // Text colors
  textPrimary: { color: colors.text.primary },
  textSecondary: { color: colors.text.secondary },
  textTertiary: { color: colors.text.tertiary },
  textDisabled: { color: colors.text.disabled },
  textMuted: { color: colors.text.muted },
  
  // Spotify brand colors
  spotifyGreen: { color: colors.spotify.green },
  spotifyBlack: { color: colors.spotify.black },
  spotifyWhite: { color: colors.spotify.white },
  
  // Spacing (mobile-first)
  pXs: { padding: spacing.xs },
  pSm: { padding: spacing.sm },
  pMd: { padding: spacing.md },
  pLg: { padding: spacing.lg },
  pXl: { padding: spacing.xl },
  p2xl: { padding: spacing['2xl'] },
  p3xl: { padding: spacing['3xl'] },
  
  mXs: { margin: spacing.xs },
  mSm: { margin: spacing.sm },
  mMd: { margin: spacing.md },
  mLg: { margin: spacing.lg },
  mXl: { margin: spacing.xl },
  m2xl: { margin: spacing['2xl'] },
  m3xl: { margin: spacing['3xl'] },
  
  // Border radius
  roundedSm: { borderRadius: borderRadius.sm },
  roundedMd: { borderRadius: borderRadius.md },
  roundedLg: { borderRadius: borderRadius.lg },
  roundedXl: { borderRadius: borderRadius.xl },
  rounded2xl: { borderRadius: borderRadius['2xl'] },
  roundedFull: { borderRadius: borderRadius.full },
  
  // Typography
  fontPrimary: { fontFamily: typography.fontFamily.primary },
  fontSecondary: { fontFamily: typography.fontFamily.secondary },
  fontMono: { fontFamily: typography.fontFamily.mono },
  
  // Font sizes
  textXs: { fontSize: typography.fontSize.xs },
  textSm: { fontSize: typography.fontSize.sm },
  textBase: { fontSize: typography.fontSize.base },
  textMd: { fontSize: typography.fontSize.md },
  textLg: { fontSize: typography.fontSize.lg },
  textXl: { fontSize: typography.fontSize.xl },
  text2xl: { fontSize: typography.fontSize['2xl'] },
  text3xl: { fontSize: typography.fontSize['3xl'] },
  text4xl: { fontSize: typography.fontSize['4xl'] },
  text5xl: { fontSize: typography.fontSize['5xl'] },
  
  // Font weights
  fontWeightLight: { fontWeight: typography.fontWeight.light },
  fontWeightNormal: { fontWeight: typography.fontWeight.normal },
  fontWeightMedium: { fontWeight: typography.fontWeight.medium },
  fontWeightSemibold: { fontWeight: typography.fontWeight.semibold },
  fontWeightBold: { fontWeight: typography.fontWeight.bold },
  fontWeightExtrabold: { fontWeight: typography.fontWeight.extrabold },
  
  // Line heights
  leadingTight: { lineHeight: typography.lineHeight.tight },
  leadingNormal: { lineHeight: typography.lineHeight.normal },
  leadingRelaxed: { lineHeight: typography.lineHeight.relaxed },
  leadingLoose: { lineHeight: typography.lineHeight.loose },
  
  // Letter spacing
  trackingTight: { letterSpacing: typography.letterSpacing.tight },
  trackingNormal: { letterSpacing: typography.letterSpacing.normal },
  trackingWide: { letterSpacing: typography.letterSpacing.wide },
  trackingWider: { letterSpacing: typography.letterSpacing.wider },
  
  // Shadows
  shadowNone: { boxShadow: shadows.none },
  shadowSm: { boxShadow: shadows.sm },
  shadowMd: { boxShadow: shadows.md },
  shadowLg: { boxShadow: shadows.lg },
  shadowXl: { boxShadow: shadows.xl },
  shadowSpotify: { boxShadow: shadows.spotify },
  
  // Transitions
  transitionFast: { transition: transitions.fast },
  transitionNormal: { transition: transitions.normal },
  transitionSlow: { transition: transitions.slow },
  transitionSpotify: { transition: transitions.spotify },
  
  // Layout
  headerHeightMobile: { height: layout.headerHeight.mobile },
  headerHeightDesktop: { height: layout.headerHeight.desktop },
  
  // Hover effects (Spotify style)
  hoverLift: {
    transition: transitions.spotify,
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: shadows.spotify,
      backgroundColor: colors.background.cardHover,
    },
  },
  
  hoverScale: {
    transition: transitions.spotify,
    '&:hover': {
      transform: 'scale(1.02)',
    },
  },
  
  // Focus states (Spotify style)
  focusRing: {
    '&:focus': {
      outline: 'none',
      boxShadow: `0 0 0 2px ${colors.spotify.green}`,
    },
  },
  
  // Mobile-first responsive utilities
  mobileFirst: {
    // Container
    container: {
      width: '100%',
      maxWidth: layout.containerMaxWidth.mobile,
      margin: '0 auto',
      padding: `0 ${spacing.md}`,
      '@media (min-width: 768px)': {
        maxWidth: layout.containerMaxWidth.tablet,
        padding: `0 ${spacing.lg}`,
      },
      '@media (min-width: 1024px)': {
        maxWidth: layout.containerMaxWidth.desktop,
        padding: `0 ${spacing.xl}`,
      },
    },
    
    // Grid
    grid: {
      display: 'grid',
      gap: layout.gridGap.mobile,
      '@media (min-width: 768px)': {
        gap: layout.gridGap.tablet,
      },
      '@media (min-width: 1024px)': {
        gap: layout.gridGap.desktop,
      },
    },
    
    // Card
    card: {
      padding: layout.cardPadding.mobile,
      '@media (min-width: 768px)': {
        padding: layout.cardPadding.tablet,
      },
      '@media (min-width: 1024px)': {
        padding: layout.cardPadding.desktop,
      },
    },
  },
}

// Utilitários específicos para iconografia
export const iconStyles = {
  size: {
    xs: { width: icons.size.xs, height: icons.size.xs },
    sm: { width: icons.size.sm, height: icons.size.sm },
    md: { width: icons.size.md, height: icons.size.md },
    lg: { width: icons.size.lg, height: icons.size.lg },
    xl: { width: icons.size.xl, height: icons.size.xl },
    '2xl': { width: icons.size['2xl'], height: icons.size['2xl'] },
  },
  
  spacing: {
    xs: { marginRight: icons.spacing.xs },
    sm: { marginRight: icons.spacing.sm },
    md: { marginRight: icons.spacing.md },
    lg: { marginRight: icons.spacing.lg },
  },
}

// Utilitários para gradientes
export const gradientStyles = {
  primary: { background: colors.gradients.primary },
  spotify: { background: colors.gradients.spotify },
  dark: { background: colors.gradients.dark },
} 