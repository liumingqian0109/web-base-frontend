import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/menu',
    method: 'get',
    params: query
  })
}
export function createMenu(data) {
  return request({
    url: '/menu',
    method: 'post',
    data
  })
}
export function updateMenu(data) {
  return request({
    url: '/menu',
    method: 'put',
    data
  })
}
export function treeList() {
  return request({
    url: '/menu',
    method: 'get'
    // params: query
  })
}
export function deleteMenu(data) {
  return request({
    url: '/menu/' + data,
    method: 'delete'
  })
}
export function excelMenu(data) {
  return request({
    url: '/menu/excel',
    method: 'get',
    data
  })
}
