import { createI18n } from 'vue-i18n'

import en from './locales/en.json'
import ru from './locales/ru.json'
import uk from './locales/uk.json'

export default createI18n({
  legacy: true,
  locale: 'uk',
  fallbackLocale: 'en',
  messages: { en, ru, uk }
})
