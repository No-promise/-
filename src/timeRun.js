import Vue from 'vue'
import router from './router'

// 定时器1小时内无操作登出
export function timeRun () {
  let maxTime = 1800 // seconds
  let time = maxTime
  document.body.onmousemove = () => { // 监听鼠标移动事件
    time = maxTime
  }
  document.body.onmousedown = () => { // 监听鼠标点击事件
    time = maxTime
  }
  document.body.onkeydown = () => { // 监听键盘事件
    time = maxTime
  }
  let intervalId = setInterval(function () {
    time--
    if (time <= 0) {
      ShowInvalidLoginMessage()
      clearInterval(intervalId)
    }
  }, 1000)

  function ShowInvalidLoginMessage () {
    Vue.prototype.$message({
      message: '您已经长时间没操作了，请重新登录',
      type: 'error'
    })
    router.push('/')
    localStorage.clear()
  }
}
