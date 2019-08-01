import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/dept',
    method: 'get',
    params: query
  })
}
export function createDepartment(data) {
  return request({
    url: '/dept',
    method: 'post',
    data
  })
}
export function updateDepartment(data) {
  return request({
    url: '/department/update',
    method: 'post',
    data
  })
}
// export function treeList(data) {
//   return request({
//     url: '/department/update',
//     method: 'post',
//     data
//   })
// }
