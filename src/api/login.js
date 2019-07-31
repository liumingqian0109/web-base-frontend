import request from '@/utils/request'

export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return request({
    // url: '/login/login',
    url: '/login',
    method: 'post',
    // data
    params: data
  })
}
//   return request({
//     url: '/login/login',
//     method: 'post',
//     data
//   })
// }
export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo(username) {
  const data = {
    username
    // token
  }
  // export function getUserInfo(data) {
  // const data = {
  //   token
  // }
  return request({
    url: '/user/info',
    method: 'post',
    params: data
  })
}
