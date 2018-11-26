const state = () => ({
  tableName: ''
})

const mutations = {
  UPDATE_TABLE_NAME(state, tableName) {
    state.tableName = tableName
  }
}
const getters = {
  tableName: state => state.tableName
}
export default {
  state,
  getters,
  mutations
}
