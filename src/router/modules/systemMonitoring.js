/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const systemMonitoringRouter = {
  path: '/systemMonitoring',
  component: Layout,
  redirect: '/systemMonitoring/log/list.vue',
  name: 'systemMonitoring',
  meta: {
    title: 'systemMonitoring',
    icon: 'guide'
  },
  children: [
    {
      path: 'log/list',
      component: () => import('@/systemMonitoring/log/list'),
      name: 'user',
      meta: { title: 'log' }
    }
  ]
}
export default systemMonitoringRouter
