// Feature flags configuration
export interface FeatureFlags {
  ENABLE_GENRES_ENDPOINT: boolean
  ENABLE_GENRES_FALLBACK: boolean
  ENABLE_GENRES_DEPRECATION_WARNING: boolean
}

// Default feature flags
export const defaultFeatureFlags: FeatureFlags = {
  ENABLE_GENRES_ENDPOINT: true,
  ENABLE_GENRES_FALLBACK: true,
  ENABLE_GENRES_DEPRECATION_WARNING: true,
}

// Get feature flags from environment or use defaults
export function getFeatureFlags(): FeatureFlags {
  return {
    ENABLE_GENRES_ENDPOINT:
      process.env.REACT_APP_ENABLE_GENRES_ENDPOINT !== 'false',
    ENABLE_GENRES_FALLBACK:
      process.env.REACT_APP_ENABLE_GENRES_FALLBACK !== 'false',
    ENABLE_GENRES_DEPRECATION_WARNING:
      process.env.REACT_APP_ENABLE_GENRES_DEPRECATION_WARNING !== 'false',
  }
}

// Feature flag helper functions
export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  const flags = getFeatureFlags()
  return flags[feature]
}
