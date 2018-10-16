import Vue from 'vue'
import Vuex from 'vuex'
import api from './request' // 封装axios
import router from './router'

Vue.use(Vuex)
/* eslint-disable no-new */
const store = new Vuex.Store({
  state: {
    // testApi: 'http://118.25.10.151:8800', // 测试服务器域名
    // testApi: 'http://10.10.11.41:8800', // 测试域名
    testApi: 'http://10.10.10.23:8800', // 李强本地
    // testApi: 'http://10.10.10.65:8800', // 陈冠彧本地
    // testApi: 'http://10.10.10.84:8800', // 冯慧慧本地
    // testApi: 'http://10.10.10.105:8800', // 陈铁成本地
    // testApi: 'http://pre.mgr.janesi.com', // 预发环境
    // testApi: 'http://mgr.janesi.com', // 正式环境
    commonData: {
      // 用户信息
      get user () {
        return localStorage.getItem('user')
      }
    },
    // 当前路由
    activeRouter: '',
    appId: ''
  },
  mutations: {
    // 存储用户信息
    setUser (state, user) {
      localStorage.setItem('user', JSON.stringify(user))
    },
    // 存储appID
    setAppID (state, appId) {
      state.appId = appId
    }
  },
  actions: {
    // 用户名密码登录
    userLogin (context, bean) {
      api.post(this.state.testApi + '/admin/bops/user/login',
        Vue.prototype.filterData(bean)
      ).then(res => {
        if (res.data.code === '0') {
          router.push('/dataCount')
          context.commit('setUser', res.data.result)
        } else {
          Vue.prototype.$message({
            message: res.data.msg,
            type: 'error'
          })
        }
      })
    }
  }
})

export default store
