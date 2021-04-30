import Vue from 'vue'
import Vuex from 'vuex'
import tab from './tab'
import menuCollapseState from './menuCollapseState'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    tab,
    menuCollapseState
  }
})
