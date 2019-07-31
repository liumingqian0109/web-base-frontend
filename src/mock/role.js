import Mock from 'mockjs'
import { param2Obj } from '@/utils'
const List = []
const count = 3
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    timestamp: +Mock.Random.date('T'), // 创建时间
    'role|1': ['管理员', '注册用户', '普通用户'], // 随机姓名
    endTime: +new Date(),
    describe: '我是测试数据'
  }))
}
export default {
  getList: config => {
    const { role, timestamp, page = 1, limit = 20, sort } = param2Obj(config.url)

    let mockList = List.filter(item => {
      if (role && item.role !== +role) return false
      if (timestamp && item.timestamp !== +timestamp) return false
      // if (title && item.title.indexOf(title) < 0) return false
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
  getArticle: (config) => {
    const { id } = param2Obj(config.url)
    for (const user of List) {
      if (user.id === +id) {
        return user
      }
    }
  },
  searchRole: () => ({
    data: 'success'
  }),
  createRole: () => ({
    data: 'success'
  }),
  updateRole: () => ({
    data: 'success'
  }),

  getTree: () => ({
    treeRole: [{
      id: 1,
      label: '系统管理',
      children: [{
        label: '用户管理',
        children: [{
          label: '三级 1-1-1'
        }]
      }, {
        id: 11,
        label: '角色列表',
        children: [{
          label: '三级 1-1-1'
        }]
      }, {
        id: 12,
        label: '菜单管理',
        children: [{
          label: '三级 1-1-1'
        }]
      }, {
        id: 13,
        label: '部门管理',
        children: [{
          label: '三级 1-1-1'
        }]
      }]
    }, {
      id: 2,
      label: '系统分析',
      children: [{
        id: 21,
        label: '日志管理',
        children: [{
          label: '三级 2-1-1'
        }]
      }]
    }],
    treeKey: [1, 11, 13, 2, 21]
  })
}

