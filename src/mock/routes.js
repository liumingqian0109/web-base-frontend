// Just a mock data

export const constantRoutes = [
  {
    path: '/redirect',
    component: 'layout/Layout',
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: 'views/redirect/index'
      }
    ]
  },
  {
    path: '/login',
    component: 'views/login/index',
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: 'views/login/auth-redirect',
    hidden: true
  },
  {
    path: '/404',
    component: 'views/error-page/404',
    hidden: true
  },
  {
    path: '/401',
    component: 'views/error-page/401',
    hidden: true
  },
  {
    path: '',
    component: 'layout/Layout',
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: 'views/dashboard/index',
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/documentation',
    component: 'layout/Layout',
    children: [
      {
        path: 'index',
        component: 'views/documentation/index',
        name: 'Documentation',
        meta: { title: 'Documentation', icon: 'documentation', affix: true }
      }
    ]
  },
  {
    path: '/guide',
    component: 'layout/Layout',
    redirect: '/guide/index',
    children: [
      {
        path: 'index',
        component: 'views/guide/index',
        name: 'Guide',
        meta: { title: 'Guide', icon: 'guide', noCache: true }
      }
    ]
  }
]

export default {
  getAsyncRoutes: () => ({
    'asyncRouterMap': [
      {
        'path': '/system',
        'component': 'Layout',
        'redirect': '/system/user/username.vue',
        'name': 'system',
        'meta': {
          'title': 'system',
          'icon': 'table',
          'roles': ['admin', 'editor']
        },
        'children': [
          {
            'path': 'user/username',
            'component': 'system/user/username',
            'name': 'user',
            'meta': { 'title': 'username' }
          },
          {
            'path': 'role/list',
            'component': 'system/role/list',
            'name': 'role',
            'meta': { 'title': 'role' }
          },
          {
            'path': 'menu/menus',
            'component': 'system/menu/menus',
            'name': 'menu',
            'meta': { 'title': 'menu' }
          },
          {
            'path': 'department/list',
            'component': 'system/department/list',
            'name': 'department',
            'meta': { 'title': 'department' }
          }
        ]
      },
      {
        'path': '/systemMonitoring',
        'component': 'Layout',
        'redirect': '/systemMonitoring/log/list.vue',
        'name': 'systemMonitoring',
        'meta': {
          'title': 'systemMonitoring',
          'icon': 'guide',
          'roles': ['admin', 'editor']
        },
        'children': [
          {
            'path': 'log/list',
            'component': 'systemMonitoring/log/list',
            'name': 'user',
            'meta': { 'title': 'log' }
          }
        ]
      },
      // tableRouter,
      { 'path': '*', 'redirect': '/404', 'hidden': true }
    ],
    'permission': [{
      'userAdd': ['admin'],
      'userUpdate': ['admin']
    }]
  })
}
