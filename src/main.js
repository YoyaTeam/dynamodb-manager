// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import '@/assets/styles/index.scss'
import ElementUI from 'element-ui'
import '@/assets/styles/element-variables.scss'
import DynamodbInstance from '@/utils/dynamodb'

const dynamodb = new DynamodbInstance(store.state.aws.config)
Vue.prototype.$dynamoDB = dynamodb
Vue.config.productionTip = false
Vue.use(ElementUI, {
  size: 'mini'
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
