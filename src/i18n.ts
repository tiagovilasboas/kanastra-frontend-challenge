import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enArtist from './locales/en/artist.json'
import enAuth from './locales/en/auth.json'
// Common translations
import enCommon from './locales/en/common.json'
import enDesignSystem from './locales/en/designSystem.json'
// Page-specific translations
import enHome from './locales/en/home.json'
import enSearch from './locales/en/search.json'
import ptArtist from './locales/pt/artist.json'
import ptAuth from './locales/pt/auth.json'
import ptCommon from './locales/pt/common.json'
import ptDesignSystem from './locales/pt/designSystem.json'
import ptHome from './locales/pt/home.json'
import ptSearch from './locales/pt/search.json'

i18n.use(initReactI18next).init({
  fallbackLng: 'pt',
  lng: 'pt',
  debug: false,
  resources: {
    en: {
      common: enCommon,
      home: enHome,
      search: enSearch,
      auth: enAuth,
      artist: enArtist,
      designSystem: enDesignSystem,
    },
    pt: {
      common: ptCommon,
      home: ptHome,
      search: ptSearch,
      auth: ptAuth,
      artist: ptArtist,
      designSystem: ptDesignSystem,
    },
  },
  ns: ['common', 'home', 'search', 'auth', 'artist', 'designSystem'],
  defaultNS: 'common',
  interpolation: {
    escapeValue: false, // React já escapa
  },
})

export default i18n
