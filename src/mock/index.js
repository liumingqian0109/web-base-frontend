import Mock from 'mockjs'
// import loginAPI from './login'
import articleAPI from './article'
import remoteSearchAPI from './remoteSearch'
import transactionAPI from './transaction'
import userAPI from './user'
import roleAPI from './role'
import menuAPI from './menu'
import departmentAPI from './department'
import logAPI from './log'
import roleMenu from './routes'

// 修复在使用 MockJS 情况下，设置 withCredentials = true，且未被拦截的跨域请求丢失 Cookies 的问题
// https://github.com/nuysoft/Mock/issues/300
Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
Mock.XHR.prototype.send = function() {
  if (this.custom.xhr) {
    this.custom.xhr.withCredentials = this.withCredentials || false
  }
  this.proxy_send(...arguments)
}

// Mock.setup({
//   timeout: '350-600'
// })

// 登录相关
// Mock.mock(/\/login\/login/, 'post', loginAPI.loginByUsername)
// Mock.mock(/\/login\/logout/, 'post', loginAPI.logout)
// Mock.mock(/\/user\/info\.*/, 'get', loginAPI.getUserInfo)

// 文章相关
Mock.mock(/\/article\/list/, 'get', articleAPI.getList)
Mock.mock(/\/article\/detail/, 'get', articleAPI.getArticle)
Mock.mock(/\/article\/pv/, 'get', articleAPI.getPv)
Mock.mock(/\/article\/create/, 'post', articleAPI.createArticle)
Mock.mock(/\/article\/update/, 'post', articleAPI.updateArticle)

// 搜索相关
Mock.mock(/\/search\/user/, 'get', remoteSearchAPI.searchUser)

// 账单相关
Mock.mock(/\/transaction\/list/, 'get', transactionAPI.getList)

// 用户相关
Mock.mock(/\/user\/list/, 'get', userAPI.getList)
Mock.mock(/\/user\/detail/, 'get', userAPI.getUserDetail)
Mock.mock(/\/user\/create/, 'post', userAPI.createUser)
Mock.mock(/\/user\/update/, 'post', userAPI.updateUser)
Mock.mock(/\/user\/search/, 'post', userAPI.searchUser)
Mock.mock(/\/user\/delete/, 'post', userAPI.deleteUser)

// 角色相关
Mock.mock(/\/role\/list/, 'get', roleAPI.getList)
Mock.mock(/\/role\/tree/, 'get', roleAPI.getTree)
Mock.mock(/\/role\/create/, 'post', roleAPI.createRole)
Mock.mock(/\/role\/update/, 'post', roleAPI.updateRole)
Mock.mock(/\/role\/search/, 'post', roleAPI.searchRole)
// 菜单相关
Mock.mock(/\/menu\/list/, 'get', menuAPI.getList)
Mock.mock(/\/menu\/create/, 'post', menuAPI.createMenu)
Mock.mock(/\/menu\/update/, 'post', menuAPI.updateMenu)
// 部门相关
Mock.mock(/\/department\/list/, 'get', departmentAPI.getList)
Mock.mock(/\/department\/update/, 'post', departmentAPI.updateDepartment)
Mock.mock(/\/department\/create/, 'post', departmentAPI.createDepartment)
// 日志相关
Mock.mock(/\/log\/list/, 'get', logAPI.getList)
Mock.mock(/\/log\/update/, 'get', logAPI.updateLog)
// 权限相关
Mock.mock(/\/role\/menu/, 'get', roleMenu.getAsyncRoutes)
export default Mock
