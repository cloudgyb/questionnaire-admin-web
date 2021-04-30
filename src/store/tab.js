export default {
  state: {
    menus: [],
    currentMenu: null,
    tabList: [{ path: '/', label: '首页', icon: 'el-icon-s-home' }]
  },
  mutations: {
    selectMenu(state, item) {
      if (item.path === '/') {
        state.currentMenu = null
      } else {
        let itemIndex = state.tabList.findIndex(e => {
          return e.path === item.path
        })
        if (itemIndex === -1) {
          state.tabList.push(item)
        }
        state.currentMenu = item
      }
    },
    closeTab(state, tab) {
      let itemIndex = state.tabList.findIndex(e => {
        return e.path === tab.path
      })
      if (itemIndex !== -1) {
        state.tabList.splice(itemIndex, 1)
        state.currentMenu = state.tabList[state.tabList.length - 1]
      }
    }
  },
  actions: {}
}
