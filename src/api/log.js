import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/log/list',
    method: 'get',
    params: query
  })
}
export function updateLog(data) {
  return request({
    url: '/log/update',
    method: 'post',
    data
  })
}
