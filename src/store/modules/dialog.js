const state = () => ({
  showIndexDialog: false,
  indexAttributeDefinitions: null,
  updateIndexSuccess: false
})

const mutations = {
  SET_SHOWINDEXDIALOG(state, showIndexDialog) {
    state.showIndexDialog = showIndexDialog
  },
  SET_INDEXATTRIBUTEDEFINITIONS(state, indexAttributeDefinitions) {
    state.indexAttributeDefinitions = indexAttributeDefinitions
  },
  SET_UPDATEINDEXSUCCESS(state, updateIndexSuccess) {
    state.updateIndexSuccess = updateIndexSuccess
  }
}
const getters = {
  showIndexDialog: state => state.showIndexDialog,
  indexAttributeDefinitions: state => state.indexAttributeDefinitions,
  updateIndexSuccess: state => state.updateIndexSuccess
}
export default {
  state,
  getters,
  mutations
}
