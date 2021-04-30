export default {
  state: {
    isCollapse: false,
    asideWidth: '200px'
  },
  mutations: {
    switchCollapseState(state) {
      state.isCollapse = !state.isCollapse
      state.asideWidth = state.isCollapse ? 'auto' : '200px'
    }
  },
  actions: {}
}
