import { createI18n } from 'vue-i18n'
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from './locales'
import en from './messages/en'
import zhHK from './messages/zh-HK'
import zhCN from './messages/zh-CN'

const messages = {
  'en': en,
  'zh-HK': zhHK,
  'zh-CN': zhCN
}

const i18n = createI18n({
  legacy: false,
  locale: DEFAULT_LOCALE,
  fallbackLocale: 'en',
  messages,
  supportedLocales: SUPPORTED_LOCALES
})

export default i18n

export { messages }
