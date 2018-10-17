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
    state.config.accessKeyId = localStorage.getItem(`${endpoint}_access_key`) || 'patsnap'
    state.config.secretAccessKey = localStorage.getItem(`${endpoint}_secret_key`) || 'patsnap'
  },
  UPDATE_ACCESS_KEY(state, accessKey) {
    state.config.accessKeyId = accessKey
  },
  UPDATE_SECRET_KEY(state, secretKey) {
    state.config.secretAccessKey = secretKey
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
