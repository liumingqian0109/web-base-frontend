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
    url: '/dept',
    method: 'put',
    data
  })
}
export function deleteDepartment(data) {
  return request({
    url: 'dept/deletNew/' + data,
    method: 'delete'
  })
}
export function excelDepartment(data) {
  return request({
    url: 'dept/excel',
    method: 'get',
    data
  })
}
