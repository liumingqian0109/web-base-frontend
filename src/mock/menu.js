import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const List = []
// const children = [
// ]
List.push(Mock.mock({
  id: '1',
  event: '系统管理',
  icon: '1',
  type: '菜单',
  address: '内网',
  component: 'system',
  children: [
    {
      id: 11,
      event: '用户管理',
      icon: '1',
      type: '菜单',
      address: '内网',
      component: 'system',
      children: [{
        id: 111,
        event: '用户管理1',
        icon: '1',
        type: '菜单',
        address: '内网',
        component: 'system'
      }]
    },
    {
      id: 12,
      event: '角色管理',
      icon: '1',
      type: '菜单',
      address: '内网',
      component: 'system'
    },
    {
      id: 13,
      event: '菜单管理',
      icon: '1',
      type: '菜单',
      address: '内网',
      component: 'system'
    },
    {
      id: 14,
      event: '部门管理',
      icon: '1',
      type: '菜单',
      address: '内网',
      component: 'system'
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
  createMenu: () => ({
    data: 'success'
  }),
  updateMenu: () => ({
    data: 'success'
  })
}
