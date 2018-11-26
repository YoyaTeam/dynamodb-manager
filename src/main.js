// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import i18n from './i18n/i18n'
import DynamodbInstance from '@/utils/dynamodb'
import DynamodbTableSchema from '@/utils/table_schema'
import Utils from '@/utils/utils'
import VueClipboard from 'vue-clipboard2'
import App from './App'

Vue.prototype.$dynamodb = new DynamodbInstance(store.state.aws.config)
Vue.prototype.$tableSchema = new DynamodbTableSchema()

Vue.prototype.$utils = Utils

VueClipboard.config.autoSetContainer = true
Vue.use(VueClipboard)
Vue.config.productionTip = false
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value),
  size: 'small'
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  components: {
    App
  },
  template: '<App/>'
})
