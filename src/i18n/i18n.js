import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { GLOBAL_SETTINGS_LANGUAGE } from '@/constants'

Vue.use(VueI18n)

const messages = {
  en: Object.assign({}, require('./langs/en').default, require('element-ui/lib/locale/lang/en').default),
  zh: Object.assign({}, require('./langs/zh').default, require('element-ui/lib/locale/lang/zh-CN').default)
}

const i18n = new VueI18n({
  locale: localStorage.getItem(GLOBAL_SETTINGS_LANGUAGE) || 'en',
  messages
})

export default i18n
