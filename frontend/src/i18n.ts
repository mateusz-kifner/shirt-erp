import common_pl from "../public/locales/pl/common.json"
import common_en from "../public/locales/en/common.json"

import i18next from "i18next"
import { initReactI18next } from "react-i18next"

export const defaultNS = "translation"
export const resources = {
  en: {
    translation: common_en,
  },
  pl: {
    translation: common_pl,
  },
} as const

const i18n = i18next.use(initReactI18next).init({
  interpolation: { escapeValue: false },
  lng: "pl",
  // debug: true,
  resources,
  defaultNS,
})

export default i18n
