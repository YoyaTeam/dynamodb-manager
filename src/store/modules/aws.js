const state = () => ({
  config: {
    id: '',
    region: '',
    endpoint: '',
    accessKeyId: '',
    secretAccessKey: ''
  }
})

const mutations = {
  UPDATE_CONFIG(state, config) {
    state.config = config
  }
}
const getters = {
  config: state => state.config
}
export default {
  state,
  getters,
  mutations
}
