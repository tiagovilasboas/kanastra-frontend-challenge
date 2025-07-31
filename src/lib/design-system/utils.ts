import { borderRadius, colors, shadows, spacing, transitions, typography } from './tokens'

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
  
  return value as string || colors.neutral[500]
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
export const getTypography = (variant: 'fontFamily' | 'fontSize' | 'fontWeight' | 'lineHeight', size?: string) => {
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

// Classes CSS utilitárias
export const spotifyStyles = {
  // Backgrounds
  bgPrimary: { backgroundColor: colors.background.primary },
  bgSecondary: { backgroundColor: colors.background.secondary },
  bgTertiary: { backgroundColor: colors.background.tertiary },
  bgElevated: { backgroundColor: colors.background.elevated },
  
  // Text colors
  textPrimary: { color: colors.text.primary },
  textSecondary: { color: colors.text.secondary },
  textTertiary: { color: colors.text.tertiary },
  textDisabled: { color: colors.text.disabled },
  
  // Spacing
  pXs: { padding: spacing.xs },
  pSm: { padding: spacing.sm },
  pMd: { padding: spacing.md },
  pLg: { padding: spacing.lg },
  pXl: { padding: spacing.xl },
  
  mXs: { margin: spacing.xs },
  mSm: { margin: spacing.sm },
  mMd: { margin: spacing.md },
  mLg: { margin: spacing.lg },
  mXl: { margin: spacing.xl },
  
  // Border radius
  roundedSm: { borderRadius: borderRadius.sm },
  roundedMd: { borderRadius: borderRadius.md },
  roundedLg: { borderRadius: borderRadius.lg },
  roundedXl: { borderRadius: borderRadius.xl },
  roundedFull: { borderRadius: borderRadius.full },
  
  // Typography
  fontPrimary: { fontFamily: typography.fontFamily.primary },
  textXs: { fontSize: typography.fontSize.xs },
  textSm: { fontSize: typography.fontSize.sm },
  textMd: { fontSize: typography.fontSize.md },
  textLg: { fontSize: typography.fontSize.lg },
  textXl: { fontSize: typography.fontSize.xl },
  
  fontWeightNormal: { fontWeight: typography.fontWeight.normal },
  fontWeightMedium: { fontWeight: typography.fontWeight.medium },
  fontWeightSemibold: { fontWeight: typography.fontWeight.semibold },
  fontWeightBold: { fontWeight: typography.fontWeight.bold },
  
  // Shadows
  shadowSm: { boxShadow: shadows.sm },
  shadowMd: { boxShadow: shadows.md },
  shadowLg: { boxShadow: shadows.lg },
  shadowXl: { boxShadow: shadows.xl },
  
  // Transitions
  transitionFast: { transition: transitions.fast },
  transitionNormal: { transition: transitions.normal },
  transitionSlow: { transition: transitions.slow },
  
  // Hover effects
  hoverLift: {
    transition: transitions.normal,
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: shadows.lg,
    },
  },
  
  // Focus states
  focusRing: {
    '&:focus': {
      outline: 'none',
      boxShadow: `0 0 0 2px ${colors.primary[500]}`,
    },
  },
} 