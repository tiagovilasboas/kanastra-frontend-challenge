import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enArtist from '../locales/en/artist.json'
import enAuth from '../locales/en/auth.json'
import enCommon from '../locales/en/common.json'
import enHome from '../locales/en/home.json'
import enSearch from '../locales/en/search.json'
import ptArtist from '../locales/pt/artist.json'
import ptAuth from '../locales/pt/auth.json'
import ptCommon from '../locales/pt/common.json'
import ptHome from '../locales/pt/home.json'
import ptSearch from '../locales/pt/search.json'

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
    },
    pt: {
      common: ptCommon,
      home: ptHome,
      search: ptSearch,
      auth: ptAuth,
      artist: ptArtist,
    },
  },
  ns: ['common', 'home', 'search', 'auth', 'artist'],
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
