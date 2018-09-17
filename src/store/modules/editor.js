const state = () => ({
  showEditor: false,
  text: ''
})

const mutations = {
  SET_SHOWEDITOR(state, showEditor) {
    state.showEditor = showEditor
  },
  SET_TEXT(state, text) {
    state.text = text
  }
}
const getters = {
  showEditor: state => state.showEditor,
  text: state => state.text
}
export default {
  state,
  getters,
  mutations
}
