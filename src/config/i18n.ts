import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// English translations
import enApp from '../locales/en/app.json'
import enArtist from '../locales/en/artist.json'
import enAuth from '../locales/en/auth.json'
import enCommon from '../locales/en/common.json'
import enGenres from '../locales/en/genres.json'
import enHome from '../locales/en/home.json'
import enIcons from '../locales/en/icons.json'
import enNavigation from '../locales/en/navigation.json'
import enSearch from '../locales/en/search.json'
import enUi from '../locales/en/ui.json'
// Portuguese translations
import ptApp from '../locales/pt/app.json'
import ptArtist from '../locales/pt/artist.json'
import ptAuth from '../locales/pt/auth.json'
import ptCommon from '../locales/pt/common.json'
import ptGenres from '../locales/pt/genres.json'
import ptHome from '../locales/pt/home.json'
import ptIcons from '../locales/pt/icons.json'
import ptNavigation from '../locales/pt/navigation.json'
import ptSearch from '../locales/pt/search.json'
import ptUi from '../locales/pt/ui.json'

i18n.use(initReactI18next).init({
  fallbackLng: 'pt',
  lng: 'pt',
  debug: false,
  resources: {
    en: {
      app: enApp,
      artist: enArtist,
      auth: enAuth,
      common: enCommon,
      genres: enGenres,
      home: enHome,
      icons: enIcons,
      navigation: enNavigation,
      search: enSearch,
      ui: enUi,
    },
    pt: {
      app: ptApp,
      artist: ptArtist,
      auth: ptAuth,
      common: ptCommon,
      genres: ptGenres,
      home: ptHome,
      icons: ptIcons,
      navigation: ptNavigation,
      search: ptSearch,
      ui: ptUi,
    },
  },
  ns: [
    'app',
    'artist',
    'auth',
    'common',
    'genres',
    'home',
    'icons',
    'navigation',
    'search',
    'ui',
  ],
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
