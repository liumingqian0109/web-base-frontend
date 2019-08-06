import { constantRouterMap } from '@/router'
import Layout from '@/views/layout/Layout'
import { roleMenu } from '../../api/roleMenu'
import store from '../index'
// import router from '../../router'
// import { setPermission } from '@/utils/auth'
const _import = require('../../router/_import_' + process.env.NODE_ENV) // 获取组件的方法
/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission2(v) {
  // if (route.meta && route.meta.roles) {
  //   return roles.some(role => route.meta.roles.includes(role))
  // } else {
  //   return true
  // }
  const permissions = store.getters && store.getters.permissionsBtn
  // console.log(store.getters.permissionsBtn)
  // const value = permission.value.split(',')
  // const flag = true
  return v === '' || permissions.includes(v)
}

/**
 * 递归过滤返回符合用异步路由表，户角色权限的路由表
 * @param routes asyncRouterMap
 * @param roles
 */
// function filterAsyncRouter(routes, roles) {
//   const res = []
//   routes.forEach(routes => {
//     const tmp = { ...routes }
//     if (hasPermission(roles, tmp)) {
//       if (tmp.children) {
//         tmp.children = filterAsyncRouter(tmp.children, roles)
//       } else {
//         return
//       }
//       res.push(tmp)
//     }
//   })

//   return res
// }
function filterAsyncRouter(asyncRouterMap) { // 遍历后台传来的路由字符串，转换为组件对象
  const res = asyncRouterMap.filter(route => {
    if (route.component) {
      if (route.component === 'Layout') { // Layout组件特殊处理
        route.component = Layout
      } else {
        route.component = _import(route.component)
      }
      route.meta = { title: route.title, icon: route.icon, alwaysShow: true }
      route.alwaysShow = true
    } else {
      return false
    }
    if (route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children)
    }

    return true
  })

  return res
}
// 存储
const permission = {
  state: {
    routers: [],
    addRouters: []
  },
  // 对状态的操作
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  // 获取数据，对mutations进行操作
  actions: {
    GenerateRoutes({ commit }, data) { // roles是用户所带的权限
      return new Promise(resolve => {
        // const { roles } = data
        var asyncRouterMap = []
        roleMenu(data).then(response => {
          // setPermission(permission)
          // console.log(response.data)
          asyncRouterMap = response.data.rows.children
          console.log(response.data)
          const asyncRouter = filterAsyncRouter(asyncRouterMap)
          const accessedRouters = asyncRouter.filter(v => {
          // if (roles.indexOf('admin') >= 0) {
          //     return true;
          // };
            console.log('a111:' + v)
            if (hasPermission2(v.permission)) {
              if (v.children && v.children.length > 0) {
                v.children = v.children.filter(child => {
                  console.log(child)
                  if (hasPermission2(child.permission)) {
                    return child
                  }
                  return false
                })
                return v
              } else {
                return v
              }
            }
            return false
          })
          commit('SET_ROUTERS', accessedRouters)// 读取操作之后的数据
          resolve()
        })
      })
    }
  }
}

export default permission
