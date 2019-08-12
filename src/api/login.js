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
export function logout(data) {
  return request({
    url: '/logout/' + data,
    method: 'get'
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
    url: 'login/user-info',
    method: 'get',
    params: data
  })
}
