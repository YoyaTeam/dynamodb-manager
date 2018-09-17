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
  UPDATE_REGION (state, region) {
    state.config.region = region
  },
  UPDATE_ENDPOINT (state, endpoint) {
    state.config.endpoint = endpoint
  }
}
export default {
  state,
  mutations
}
