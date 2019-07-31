import store from '@/store'
/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = store.getters && store.getters.roles
    const permissionRoles = value

    const hasPermission = roles.some(role => {
      return permissionRoles.includes(role)
    })

    if (!hasPermission) {
      return false
    }
    return true
  } else {
    console.error(`need roles! Like v-permission="['admin','editor']"`)
    return false
  }
}
// 自定义命令
// 必须包含列出的所有权限，元素才显示
export const hasPermission = {
  install(Vue) {
    Vue.directive('hasPermission', {
      bind(el, binding, vnode) {
        const permissions = store.getters && store.getters.permissionsBtn
        // console.log(store.getters.permissionsBtn)
        const value = binding.value.split(',')
        let flag = true
        for (const v of value) {
          if (!permissions.includes(v)) {
            flag = false
          }
        }
        if (!flag) {
          if (!el.parentNode) {
            el.style.display = 'none'
          } else {
            el.parentNode.removeChild(el)
          }
        }
      }
    })
  }
}

// 当不包含列出的权限时，渲染该元素
export const hasNoPermission = {
  install(Vue) {
    Vue.directive('hasNoPermission', {
      bind(el, binding, vnode) {
        const permissions = vnode.context.$store.state.account.permissions
        const value = binding.value.split(',')
        let flag = true
        for (const v of value) {
          if (permissions.includes(v)) {
            flag = false
          }
        }
        if (!flag) {
          if (!el.parentNode) {
            el.style.display = 'none'
          } else {
            el.parentNode.removeChild(el)
          }
        }
      }
    })
  }
}

// 只要包含列出的任意一个权限，元素就会显示
export const hasAnyPermission = {
  install(Vue) {
    Vue.directive('hasAnyPermission', {
      bind(el, binding, vnode) {
        const permissions = vnode.context.$store.state.account.permissions
        const value = binding.value.split(',')
        let flag = false
        for (const v of value) {
          if (permissions.includes(v)) {
            flag = true
          }
        }
        if (!flag) {
          if (!el.parentNode) {
            el.style.display = 'none'
          } else {
            el.parentNode.removeChild(el)
          }
        }
      }
    })
  }
}

// 必须包含列出的所有角色，元素才显示
export const hasRole = {
  install(Vue) {
    Vue.directive('hasRole', {
      bind(el, binding, vnode) {
        const permissions = vnode.context.$store.state.account.roles
        const value = binding.value.split(',')
        let flag = true
        for (const v of value) {
          if (!permissions.includes(v)) {
            flag = false
          }
        }
        if (!flag) {
          if (!el.parentNode) {
            el.style.display = 'none'
          } else {
            el.parentNode.removeChild(el)
          }
        }
      }
    })
  }
}

// 只要包含列出的任意一个角色，元素就会显示
export const hasAnyRole = {
  install(Vue) {
    Vue.directive('hasAnyRole', {
      bind(el, binding, vnode) {
        const permissions = vnode.context.$store.state.account.roles
        const value = binding.value.split(',')
        let flag = false
        for (const v of value) {
          if (permissions.includes(v)) {
            flag = true
          }
        }
        if (!flag) {
          if (!el.parentNode) {
            el.style.display = 'none'
          } else {
            el.parentNode.removeChild(el)
          }
        }
      }
    })
  }
}
