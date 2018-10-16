// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import api from './request' // 封装axios
import {timeRun} from './timeRun' // 自动登出限制
import store from './store' // Vuex状态管理
import ElementUI from 'element-ui'
// import Vuex from 'vuex'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.$http = api
Vue.prototype.timeRun = timeRun
Vue.prototype.timeRun()

// 过滤参数对象
Vue.prototype.filterData = function (data) {
  let params = new URLSearchParams()
  for (let key in data) {
    params.append(key, data[key])
  }
  if (store.state.commonData.user) {
    params.set('accessToken', JSON.parse(store.state.commonData.user).accessToken)
  }
  if (store.state.appId) {
    params.set('appId', store.state.appId)
  } else {
    params.set('appId', '10010')
  }
  return params
}

let vm = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

Vue.use({vm})
