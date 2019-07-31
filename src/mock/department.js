import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const List = []
// const children = [
// ]
List.push(Mock.mock({
  id: '@increment',
  'event|1': ['系统管理', '系统监控'],
  srot: '1',
  createTime: '@DATETIME("yyyy-MM-dd HH:mm:ss")',
  updateTime: '@DATETIME("yyyy-MM-dd HH:mm:ss")',
  children: [
    {
      id: 11,
      event: '用户管理',
      srot: '11',
      createTime: '@DATETIME("yyyy-MM-dd HH:mm:ss")',
      updateTime: '@DATETIME("yyyy-MM-dd HH:mm:ss")'
    },
    {
      id: 12,
      event: '角色管理',
      srot: '12',
      createTime: '@DATETIME("yyyy-MM-dd HH:mm:ss")',
      updateTime: '@DATETIME("yyyy-MM-dd HH:mm:ss")'
    },
    {
      id: 13,
      event: '菜单管理',
      srot: '13',
      createTime: '@DATETIME("yyyy-MM-dd HH:mm:ss")',
      updateTime: '@DATETIME("yyyy-MM-dd HH:mm:ss")'
    },
    {
      id: 14,
      event: '部门管理',
      srot: '14',
      createTime: '@DATETIME("yyyy-MM-dd HH:mm:ss")',
      updateTime: '@DATETIME("yyyy-MM-dd HH:mm:ss")'
    }
  ]
}))
export default {
  getList: config => {
    const { page = 1, limit = 20, sort } = param2Obj(config.url)

    let mockList = List.filter(item => {
      if (event && item.event !== +event) return false
      return true
    })

    if (sort === '-id') {
      mockList = mockList.reverse()
    }

    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

    return {
      total: mockList.length,
      items: pageList
    }
  },
  createDepartment: () => ({
    data: 'success'
  }),
  updateDepartment: () => ({
    data: 'success'
  })
}
