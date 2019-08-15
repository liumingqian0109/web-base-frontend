import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/user',
    method: 'get',
    params: query
  })
}
export function fetchArticle(id) {
  return request({
    url: '/user/detail',
    method: 'get',
    params: { id }
  })
}
export function createUser(data) {
  return request({
    url: '/user',
    method: 'post',
    data
  })
}
export function updateUser(data) {
  return request({
    url: '/user',
    method: 'put',
    data
  })
}
export function deleteUser(data) {
  return request({
    url: '/user/' + data,
    method: 'delete'
  })
}
export function exportUser(data) {
  return request({
    url: '/user/excel',
    method: 'post',
    data
  })
}
