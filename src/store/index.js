import Vue from 'vue'
import Vuex from 'vuex'

import aws from './modules/aws'
import table from './modules/table'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    aws,
    table
  }
})
