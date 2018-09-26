const state = () => ({
  refresh: false
})

const mutations = {
  SET_REFRESH(state, refresh) {
    state.refresh = refresh
  }
}
const getters = {
  refresh: state => state.refresh
}
export default {
  state,
  getters,
  mutations
}
