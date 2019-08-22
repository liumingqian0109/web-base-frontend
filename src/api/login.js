import request from '@/utils/request'

export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: '/login',
    method: 'post',
    params: data
  })
}
export function logout(data) {
  return request({
    url: '/logout/' + data,
    method: 'get'
  })
}

export function getUserInfo(username) {
  const data = {
    username
  }
  return request({
    url: 'login/user-info',
    method: 'get',
    params: data
  })
}
export function changePassword(data) {
  return request({
    url: 'user/password',
    method: 'put',
    params: data
  })
}
