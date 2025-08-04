import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enAlbums from '@/locales/en/albums.json'
// Import translation files
import enApp from '@/locales/en/app.json'
import enArtist from '@/locales/en/artist.json'
import enAuth from '@/locales/en/auth.json'
import enCommon from '@/locales/en/common.json'
import enFavorites from '@/locales/en/favorites.json'
import enGenres from '@/locales/en/genres.json'
import enHome from '@/locales/en/home.json'
import enIcons from '@/locales/en/icons.json'
import enNavigation from '@/locales/en/navigation.json'
import enSearch from '@/locales/en/search.json'
import enSeo from '@/locales/en/seo.json'
import enSidebar from '@/locales/en/sidebar.json'
import enUi from '@/locales/en/ui.json'
import ptAlbums from '@/locales/pt/albums.json'
import ptApp from '@/locales/pt/app.json'
import ptArtist from '@/locales/pt/artist.json'
import ptAuth from '@/locales/pt/auth.json'
import ptCommon from '@/locales/pt/common.json'
import ptFavorites from '@/locales/pt/favorites.json'
import ptGenres from '@/locales/pt/genres.json'
import ptHome from '@/locales/pt/home.json'
import ptIcons from '@/locales/pt/icons.json'
import ptNavigation from '@/locales/pt/navigation.json'
import ptSearch from '@/locales/pt/search.json'
import ptSeo from '@/locales/pt/seo.json'
import ptSidebar from '@/locales/pt/sidebar.json'
import ptUi from '@/locales/pt/ui.json'

const resources = {
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
    seo: enSeo,
    sidebar: enSidebar,
    ui: enUi,
    albums: enAlbums,
    favorites: enFavorites,
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
    seo: ptSeo,
    sidebar: ptSidebar,
    ui: ptUi,
    albums: ptAlbums,
    favorites: ptFavorites,
  },
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt', // default language
    fallbackLng: 'en',
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
      'seo',
      'sidebar',
      'ui',
      'albums',
      'favorites',
    ],
    defaultNS: 'app',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  })

export default i18n
