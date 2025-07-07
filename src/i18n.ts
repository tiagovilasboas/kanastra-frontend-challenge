import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enCommon from './locales/en/common.json'
import ptCommon from './locales/pt/common.json'

// É possível adicionar mais namespaces e usar lazy-loading; aqui mantemos simples

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: 'pt',
    lng: 'pt',
    debug: false,
    resources: {
      en: {
        common: enCommon,
      },
      pt: {
        common: ptCommon,
      },
    },
    ns: ['common'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false, // React já escapa
    },
  })

export default i18n 