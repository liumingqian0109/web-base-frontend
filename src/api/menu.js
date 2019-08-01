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
    url: '/menu/create',
    method: 'post',
    data
  })
}
export function updateMenu(data) {
  return request({
    url: '/menu/update',
    method: 'post',
    data
  })
}

