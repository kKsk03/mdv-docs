import { createI18n } from 'vue-i18n'
import en from '@/locales/en-US'
import zhCN from '@/locales/zh-CN'

export default createI18n({
  legacy: false,
  locale: 'en-US',
  fallbackLocale: 'en-US',
  messages: { 'en-US': en, 'zh-CN': zhCN },
})
