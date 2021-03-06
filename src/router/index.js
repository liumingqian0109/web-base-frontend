import Vue from 'vue'
import Router from 'vue-router'
// import { roleMenu } from '../../api/roleMenu'
// import store from '../store'
Vue.use(Router)
/* Layout */
import Layout from '@/views/layout/Layout'

// import routes from '../mock/roles'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'
// import systemRouter from './modules/system'
// import systemMonitoringRouter from './modules/systemMonitoring'

/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']    will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if true, the page will no be cached(default is false)
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
      }
    ]
  },
  // 引导页
  {
    path: '/guide',
    component: Layout,
    redirect: '/guide/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/guide/index'),
        name: 'Guide',
        meta: { title: 'guide', icon: 'guide', noCache: true }
      }
    ]
  },
  // {
  //   path: '/icons',
  //   component: Layout,
  //   redirect: '/icons/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/icons/index'),
  //       name: 'icons',
  //       meta: { title: 'icons', icon: 'guide', noCache: true }
  //     }
  //   ]
  // },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  }

]
// export const constantRouterMap = routes.constantRouterMap
export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
// 组件太长拆分成js文件后组件的声明
// 用于动态加载的路由
// export const map = {
//   // login: () => import('login/index') // 异步的方式
//   asyncRouterMap
// }
export const asyncRouterMap = [
  // {
  //   path: '/system',
  //   component: Layout,
  //   redirect: '/system/user/username.vue',
  //   name: 'system',
  //   meta: {
  //     title: 'system',
  //     icon: 'table',
  //     roles: ['admin']
  //   },
  //   children: [
  //     {
  //       path: 'user/username',
  //       component: () => import('@/system/user/username'),
  //       name: 'user',
  //       meta: { title: 'username' }
  //     },
  //     {
  //       path: 'role/list',
  //       component: () => import('@/system/role/list'),
  //       name: 'role',
  //       meta: { title: 'role' }
  //     },
  //     {
  //       path: 'menu/menus',
  //       component: () => import('@/system/menu/menus'),
  //       name: 'menu',
  //       meta: { title: 'menu' }
  //     },
  //     {
  //       path: 'department/list',
  //       component: () => import('@/system/department/list'),
  //       name: 'department',
  //       meta: { title: 'department' }
  //     }
  //   ]
  // },
  // {
  //   path: '/systemMonitoring',
  //   component: 'Layout',
  //   redirect: '/systemMonitoring/log/list.vue',
  //   name: 'systemMonitoring',
  //   meta: {
  //     title: 'systemMonitoring',
  //     icon: 'guide',
  //     roles: ['admin', 'editor']
  //   },
  //   children: [
  //     {
  //       path: 'log/list',
  //       component: () => import('@/systemMonitoring/log/list'),
  //       name: 'user',
  //       meta: { title: 'log', roles: ['admin', 'editor'] }
  //     }
  //   ]
  // },
  // // tableRouter,
  // { path: '*', redirect: '/404', hidden: true }
]
