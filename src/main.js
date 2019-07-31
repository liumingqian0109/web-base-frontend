import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import i18n from './lang' // Internationalization
import './icons' // icon
import './errorLog' // error log
import './permission' // permission control
// import './store/modules/permission'
// import './mock' // simulation data
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import * as filters from './filters' // global filters
// import permission from '@/directive/permission/index.js' // 权限判断指令
import db from '../src/utils/localstorage'
import '../src/utils/install'
// import { plugin } from '../src/utils/install'
// process.env.MOCK && require('@/mock') // mock

router.afterEach(() => {
  NProgress.done() // finish progress bar
})

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})
Vue.use(db)
Vue.use({
  install(Vue) {
    Vue.prototype.$db = db
  }
})
// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
