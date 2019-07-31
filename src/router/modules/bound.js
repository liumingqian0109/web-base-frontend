/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const boundRouter = {
  path: '/bound',
  component: Layout,
  name: 'Bound',
  meta: {
    title: 'bound',
    icon: 'table'
  },
  children: [
    {
      path: 'inbound',
      component: () => import('@/views/bound/inbound/index'),
      name: 'Inbound',
      meta: { title: 'inbound' }
    },
    {
      path: 'outbound',
      component: () => import('@/views/bound/outbound/index'),
      name: 'Outbound',
      meta: { title: 'outbound' }
    },
    {
      path: 'movebound',
      component: () => import('@/views/bound/movebound/index'),
      name: 'Movebound',
      meta: { title: 'movebound' }
    }
  ]
}
export default boundRouter
