/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const systemRouter = {
  path: '/system',
  component: Layout,
  redirect: '/system/user/username.vue',
  name: 'system',
  meta: {
    title: 'system',
    icon: 'table'
  },
  children: [
    {
      path: 'user/username',
      component: () => import('@/system/user/username'),
      name: 'user',
      meta: { title: 'username' }
    },
    {
      path: 'role/list',
      component: () => import('@/system/role/list'),
      name: 'role',
      meta: { title: 'role' }
    },
    {
      path: 'menu/menus',
      component: () => import('@/system/menu/menus'),
      name: 'menu',
      meta: { title: 'menu' }
    },
    {
      path: 'department/list',
      component: () => import('@/system/department/list'),
      name: 'department',
      meta: { title: 'department' }
    }
  ]
}
export default systemRouter
