import { roleMenu } from '../../api/roleMenu'
import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
const menu = {
  actions: {
    // 动态修改权限
    Menu({ commit }) {
      return new Promise(resolve => {
        roleMenu().then(response => {
          const asyncRouterMap = response.data.asyncRouterMap
          commit('asyncRouterMap', asyncRouterMap)
          resolve()
        })
      })
    }
  }
}
export default menu
