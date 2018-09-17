import Vue from 'vue'
import Vuex from 'vuex'

import aws from './modules/aws'
import editor from './modules/editor'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    aws,
    editor
  }
})
