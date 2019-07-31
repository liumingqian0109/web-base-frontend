import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const List = []
const count = 20
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    user: '@name()',
    description: '操作',
    timeConsuming: '40s',
    methods: 'method',
    parameter: '参数',
    IP: '127.0.0.1'
  }))
}
export default {
  getList: config => {
    const { user, page = 1, limit = 20, sort } = param2Obj(config.url)

    let mockList = List.filter(item => {
      if (user && item.user !== +user) return false
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
  updateLog: () => ({
    data: 'success'
  })
}
