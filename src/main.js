import Vue from 'vue'
import App from './App.vue'
import routes from './router/index'
import store from './store/index'
import { ACTION_SIGN_IN } from './store/action-types'
import ElementUI from 'element-ui'
import './assets/scss/styles.scss'

import Router from 'vue-router'

import formatFn from '@/utils/format'

Vue
  .use(Router)
  .use(ElementUI)
  .use(formatFn)

Vue.config.productionTip = false

const router = new Router({
  routes,
  strict: process.env.NODE_ENV !== 'production'
})

router.beforeEach(async (to, from, next) => {
  if (!store.state.user.isLogin) {
    if (localStorage.hasOwnProperty('jwtToken')) {
      store.dispatch(ACTION_SIGN_IN)
    }
  }
  // 判断页面是否需要登录，若需要
  if (to.matched.some(record => record.meta.requireAuth)) {
    if (!store.state.user.isLogin) {
      let path = '/login'
      return next(path)
    }
  }
  next()
})

window.vm = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
