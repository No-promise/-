import Vue from 'vue'
import Router from 'vue-router'
// import Login from '@/components/Login' // 登录组件
// import MainContain from '@/pages/MainContain' // 容器组件
// import LeftMenu from '@/components/common/LeftMenu'

// import DataCount from '@/pages/data-count/DataCount' // 用户数据
// import CreditCount from '@/pages/data-count/CreditCount' // 积分数据
// import EarningCount from '@/pages/data-count/EarningCount' // 用户数据
// import UserManage from '@/pages/user-manage/UserManage' // 全部用户
// import AdManage from '@/pages/ad-manage/AdManage' // 信息流广告
// import CashManage from '@/pages/cash-manage/CashManage' // 全部提现
// import AppPush from '@/pages/system-push/AppPush' // 全部推送
// import VersionPush from '@/pages/system-manage/VersionPush' // 版本发布
// import ExchangeRate from '@/pages/system-manage/ExchangeRate' // 兑换汇率
// import ContentCount from '@/pages/content-manage/ContentCount' // 全部内容
// import ContentRecommend from '@/pages/content-manage/ContentRecommend' // 推荐内容
// import ContentPerfect from '@/pages/content-manage/ContentPerfect' // 精品内容

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: resolve => require(['@/components/Login'], resolve)
    },
    {
      path: '/MainContain',
      name: 'MainContain',
      component: resolve => require(['@/pages/MainContain'], resolve),
      children: [
        {
          path: '/DataCount',
          name: 'DataCount',
          component: resolve => require(['@/pages/data-count/DataCount'], resolve)
        },
        {
          path: '/CreditCount',
          name: 'CreditCount',
          component: resolve => require(['@/pages/data-count/CreditCount'], resolve)
        },
        {
          path: '/EarningCount',
          name: 'EarningCount',
          component: resolve => require(['@/pages/data-count/EarningCount'], resolve)
        },
        {
          path: '/UserManage',
          name: 'UserManage',
          component: resolve => require(['@/pages/user-manage/UserManage'], resolve)
        },
        {
          path: '/AdManage',
          name: 'AdManage',
          component: resolve => require(['@/pages/ad-manage/AdManage'], resolve)
        },
        {
          path: '/CashManage',
          name: 'CashManage',
          component: resolve => require(['@/pages/cash-manage/CashManage'], resolve)
        },
        {
          path: '/CashSetting',
          name: 'CashSetting',
          component: resolve => require(['@/pages/cash-manage/CashSetting'], resolve)
        },
        {
          path: '/AppPush',
          name: 'AppPush',
          component: resolve => require(['@/pages/system-push/AppPush'], resolve)
        },
        {
          path: '/VersionPush',
          name: 'VersionPush',
          component: resolve => require(['@/pages/system-manage/VersionPush'], resolve)
        },
        {
          path: '/ExchangeRate',
          name: 'ExchangeRate',
          component: resolve => require(['@/pages/system-manage/ExchangeRate'], resolve)
        },
        {
          path: '/ChannelUpdate',
          name: 'ChannelUpdate',
          component: resolve => require(['@/pages/system-manage/ChannelUpdate'], resolve)
        },
        {
          path: '/BulletinBoard',
          name: 'BulletinBoard',
          component: resolve => require(['@/pages/system-manage/BulletinBoard'], resolve)
        },
        {
          path: '/ContentCount',
          name: 'ContentCount',
          component: resolve => require(['@/pages/content-manage/ContentCount'], resolve)
        },
        {
          path: '/ContentRecommend',
          name: 'ContentRecommend',
          component: resolve => require(['@/pages/content-manage/ContentRecommend'], resolve)
        },
        {
          path: '/ContentPerfect',
          name: 'ContentPerfect',
          component: resolve => require(['@/pages/content-manage/ContentPerfect'], resolve)
        }
      ]
    }
  ]
})
