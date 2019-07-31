import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const List = []
const count = 20
const telRegExp = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/
const mailRegExp = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
const password = /[a-z]{2}[A-Z]{2}[0-9]/
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    timestamp: +Mock.Random.date('T'), // 创建时间
    username: '@name()', // 随机姓名
    'status|1': ['success', 'pending'], // 状态
    'department|1': ['开发部', '市场部', '人事部'], // 部门
    tel: telRegExp, // 随机生成手机号
    'sex|1': ['男', '女', '保密'],
    mail: mailRegExp,
    password: password
  }))
}

export default {
  getList: config => {
    const { username, department, page = 1, limit = 20, sort } = param2Obj(config.url)

    let mockList = List.filter(item => {
      if (username && item.username !== +username) return false
      if (department && item.department !== +department) return false
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
  // getList: () => {
  //   return {
  //     total: List.length,
  //     items: List
  //   }
  // },
  getArticle: (config) => {
    const { id } = param2Obj(config.url)
    for (const user of List) {
      if (user.id === +id) {
        return user
      }
    }
  },
  createUser: () => ({
    data: 'success'
  }),
  updateUser: () => ({
    data: 'success'
  }),
  searchUser: () => ({
    data: 'success'
  }),
  deleteUser: () => ({
    data: 'success'
  })
}

