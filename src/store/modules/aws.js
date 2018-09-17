const state = () => ({
  config: {
    region: '',
    endpoint: '',
    accessKeyId: 'patsnap',
    secretAccessKey: 'patsnap',
    maxRetries: 3
  }
})

const mutations = {
  UPDATE_REGION(state, region) {
    state.config.region = region
  },
  UPDATE_ENDPOINT(state, endpoint) {
    state.config.endpoint = endpoint
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
