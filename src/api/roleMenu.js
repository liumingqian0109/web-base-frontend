import request from '@/utils/request'
export function roleMenu(data) {
  return request({
    url: 'menu',
    method: 'get',
    // data
    params: data
  })
}
