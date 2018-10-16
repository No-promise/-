
// 标题根据路由名称过滤
export const titleFilters = function (val) {
  const dict = {
    DataCount: '用户数据',
    CreditCount: '积分数据',
    EarningCount: '营收数据',
    UserManage: '全部用户',
    AdManage: '信息流广告',
    FloatAd: '悬浮广告',
    StartAd: '启动开屏广告',
    WithdrawAd: '提现广告',
    AppPush: '全部推送',
    CashManage: '全部提现',
    CashSetting: '提现设置',
    ExchangeRate: '兑换汇率',
    VersionPush: '版本发布',
    ChannelUpdate: '渠道更新',
    BulletinBoard: '公告栏',
    ContentCount: '全部内容'
  }

  return dict[val]
}
