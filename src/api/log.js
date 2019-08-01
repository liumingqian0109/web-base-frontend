import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/log',
    method: 'get',
    params: query
  })
}
export function deleteLog(data) {
  return request({
    url: '/log/' + data,
    method: 'delete'
  })
}
