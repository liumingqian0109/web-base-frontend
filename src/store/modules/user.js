import { loginByUsername, logout, getUserInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import Cookies from 'js-cookie'

const usernameKey = 'userName'
const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    setting: {
      articlePlatform: []
    },
    username: '',
    permissionsBtn: ''
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_USERNAME: (state, username) => {
      state.roles = username
    },
    SET_PERMISSIONBTN: (state, permissionsBtn) => {
      state.permissionsBtn = permissionsBtn
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim()
      Cookies.set(usernameKey, username)
      // console.log()
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password).then(response => {
          const data = response.data.data
          // console.log(data)
          commit('SET_TOKEN', data.token)
          setToken(data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // LoginByUsername({ commit }, userInfo) {
    //   const username = userInfo.username.trim()
    //   Cookies.set(usernameKey, username)
    //   // console.log()
    //   return new Promise((resolve, reject) => {
    //     loginByUsername(username, userInfo.password).then(response => {
    //       const data = response.data
    //       console.log(data)
    //       commit('SET_TOKEN', data.token)
    //       setToken(data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },
    // 获取用户信息
    GetUserInfo({ commit }) {
      const userName = Cookies.get(usernameKey)
      // console.log(userName)
      return new Promise((resolve, reject) => {
        getUserInfo(userName).then(response => {
          // 由于mockjs 不支持自定义状态码只能这样hack
          // console.log(response.data)
          if (!response.data) {
            reject('Verification failed, please login again.')
          }
          const data = response.data.data
          if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.roles)
            commit('SET_USERNAME', data.user.username)
          } else {
            reject('getInfo: roles must be a non-null array!')
          }

          commit('SET_NAME', data.user.username)
          // commit('SET_AVATAR', data.avatar)
          const avatar = 'src/assets/' + data.user.avatar
          const permissionsBtn = data.permissions
          console.log(permissionsBtn)
          // console.log(avatar)
          commit('SET_AVATAR', avatar)
          commit('SET_INTRODUCTION', data.introduction)
          commit('SET_PERMISSIONBTN', permissionsBtn)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // GetUserInfo({ commit, state }) {
    //   // const userName = Cookies.get(usernameKey)
    //   // console.log(userName)
    //   const token = state.token
    //   return new Promise((resolve, reject) => {
    //     getUserInfo(token).then(response => {
    //       // 由于mockjs 不支持自定义状态码只能这样hack
    //       // console.log(response.data)
    //       if (!response.data) {
    //         reject('Verification failed, please login again.')
    //       }
    //       const data = response.data
    //       // console.log(data.user.username)
    //       if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
    //         commit('SET_ROLES', data.roles)
    //         commit('SET_USERNAME', data.user.username)
    //       } else {
    //         reject('getInfo: roles must be a non-null array!')
    //       }

    //       commit('SET_NAME', data.name)
    //       commit('SET_AVATAR', data.avatar)
    //       commit('SET_INTRODUCTION', data.introduction)
    //       resolve(response)
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },
    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          Cookies.remove(usernameKey)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({ commit, dispatch }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getUserInfo(role).then(response => {
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          dispatch('GenerateRoutes', data) // 动态修改权限后 重绘侧边菜单
          resolve()
        })
      })
    }
  }
}

export default user
