import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/role',
    method: 'get',
    params: query
  })
}
export function treeList() {
  return request({
    url: '/menu',
    method: 'get'
    // params: query
  })
}
export function createRole(data) {
  return request({
    url: '/role',
    method: 'post',
    data
  })
}
export function updateTree(data) {
  return request({
    url: '/role/roleMenu/' + data,
    method: 'get',
    data
  })
}
export function updateRole(data) {
  return request({
    url: '/role',
    method: 'put',
    data
  })
}
export function deleteRole(data) {
  return request({
    url: '/role/' + data,
    method: 'delete'
    // data
  })
}
