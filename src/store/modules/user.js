const state = () => ({
  refresh: false,
  height: 0
})

const mutations = {
  SET_REFRESH(state, refresh) {
    state.refresh = refresh
  },
  SET_HEIGHT(state, height) {
    state.height = height
  }
}
const getters = {
  refresh: state => state.refresh,
  height: state => state.height
}
export default {
  state,
  getters,
  mutations
}
