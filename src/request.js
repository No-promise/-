// 简单封装axios

import Vue from 'vue'
import axios from 'axios'
import {
  Loading
} from 'element-ui'

// 添加axios拦截器
// 添加一个请求拦截器

axios.interceptors.request.use(function (config) {
  // 在请求发出之前进行一些操作
  let loadingInterface = Loading.service({
    fullscreen: true,
    text: '加载中，请稍候！',
    background: 'rgba(255, 255, 255, 0.9)',
    target: document.querySelector('.el-main')
  })
  setTimeout(() => {
    loadingInterface.close()
  }, 1500)
  return config
}, function (err) {
  // Do something with request error
  return Promise.reject(err)
})

// 添加一个响应拦截器
axios.interceptors.response.use(function (res) {
  if (res.status !== 200) {
    Vue.prototype.$message({
      showClose: true,
      message: '响应失败',
      type: 'error'
    })
  } else if (res.data.code !== '0') {
    Vue.prototype.$message({
      showClose: true,
      message: res.data.msg,
      type: 'error'
    })
  } else if (res.data.code === '0') {
    // empty
  }
  return res
}, function () {
  // return Promise.reject(err)
  Vue.prototype.$message({
    showClose: true,
    message: '服务暂不可用',
    type: 'error'
  })
})

const Api = axios
export default Api
