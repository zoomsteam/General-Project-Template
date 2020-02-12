import LiveShow from '@/views/liveShowForX/LiveShow'
import ManageLogin from '@/views/login/ManageLogin'
import Home from '@/views/index'
import LiveManage from '@/views/main/LiveManage'

export default [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: ManageLogin
  },
  {
    path: '/liveShow',
    name: 'liveShow',
    component: LiveShow
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    children: [
      {
        path: 'liveManage',
        name: 'liveManage',
        component: LiveManage,
        meta: {
          requireAuth: true
        }
      }
    ]
  }
]
