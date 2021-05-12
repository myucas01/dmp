import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import './assets/css/common.css'
import './assets/css/iconfont.css'
import './assets/css/element.css'

import '@/icons' // icon
import '@/permission' // permission control
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)
import { SocketMethod } from './utils/socketUtils'
Vue.use(SocketMethod)

import VueCurrencyFilter from 'vue-currency-filter'
Vue.use(VueCurrencyFilter, {
  symbol: '',
  thousandsSeparator: ',',
  fractionCount: 2,
  fractionSeparator: '.',
  symbolPosition: '',
  symbolSpacing: true
})

import '@/shared/registAntd'

import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
Vue.config.productionTip = false

import echarts from 'echarts' // 引入echarts
Vue.use(echarts)
Vue.prototype.echarts = echarts // 引入组件

// 按钮权限指令
Vue.directive('auth', {
  inserted: function(el, binding, vnode) {
    const BtnAuthorizationList = store.getters.userInfo ? store.getters.userInfo.authorities : ''
    if (BtnAuthorizationList) {
      let authBoolean = false
      for (const item of BtnAuthorizationList) {
        if (item.authority === binding.value) {
          authBoolean = true
          break
        }
      }
      if (!authBoolean) { el.parentNode.removeChild(el) }
    }
  }
})

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
