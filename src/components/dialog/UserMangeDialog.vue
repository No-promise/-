<template>
  <div>
    <el-dialog title="用户详情" :visible.sync="dialogTableVisible.show">
      <!-- 用户表格 -->
      <el-table :data="userData" border highlight-current-row header-row-class-name="strong">
        <el-table-column
          label="操作"
          align="center"
          width="150"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="seeReferrerId(scope.$index, scope.row)">查看邀请人</el-button>
          </template>
        </el-table-column>
        <common-table :propData="propUserDetail">
        </common-table>
      </el-table>
      <!-- 标签页 -->
      <el-tabs type="card" @tab-click="handleClick" class="tabs">
        <el-tab-pane label="金币明细">
          <el-table :data="goldData" border highlight-current-row header-row-class-name="strong">
            <common-table :propData="propGoldList">
            </common-table>
          </el-table>
          <el-pagination
            class="page"
            background
            layout="prev, pager, next"
            :total="goldTotalSize"
            :page-size="goldPageSize"
            :current-page="goldPageNo"
            @current-change="goldHandleCurrentChange">
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="现金明细">
          <el-table :data="cashData" border highlight-current-row header-row-class-name="strong">
            <common-table :propData="propCashList">
            </common-table>
          </el-table>
          <el-pagination
            class="page"
            background
            layout="prev, pager, next"
            :total="cashTotalSize"
            :page-size="cashPageSize"
            :current-page="cashPageNo"
            @current-change="cashHandleCurrentChange">
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="徒弟列表">
          <el-table :data="tudiData" border highlight-current-row header-row-class-name="strong">
            <el-table-column
              label="操作"
              align="center"
              v-if="tudiData"
            >
              <template slot-scope="scope">
                <span class="blue" @click="see(scope.$index, scope.row)">查看</span>
              </template>
            </el-table-column>
            <common-table :propData="propTudiList">
            </common-table>
          </el-table>
          <el-pagination
            class="page"
            background
            layout="prev, pager, next"
            :total="tudiTotalSize"
            :page-size="tudiPageSize"
            :current-page="tudiPageNo"
            @current-change="tudiHandleCurrentChange">
          </el-pagination>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import CommonTable from '@/components/table/CommonTable' // 导入公用表格组件
export default {
  name: 'UserMangeDialog',
  data () {
    return {
      // 用户详情
      userData: [],
      // 用户详情表头
      propUserDetail: [
        {
          prop: 'channelFrom',
          label: '用户来源'
        },
        {
          prop: 'nickName',
          label: '昵称'
        },
        {
          prop: 'apprenticeCount',
          label: '徒弟'
        },
        {
          prop: 'balance',
          label: '现金余额'
        },
        {
          prop: 'totalBalance',
          label: '累计现金'
        },
        {
          prop: 'totalApplyBalance',
          label: '累计提现'
        },
        {
          prop: 'totalCoin',
          label: '累计金币'
        },
        {
          prop: 'bind',
          label: '第三方绑定',
          formatter: this.bindFormatter
        },
        {
          prop: 'referrerId',
          label: '邀请人ID'
        }
      ],
      // 徒弟详情
      tudiData: [],
      propTudiList: [
        {
          prop: 'acceptApprenticeTime',
          label: '收徒时间'
        },
        {
          prop: 'phone',
          label: '徒弟账号',
          width: '120'
        },
        {
          prop: 'nickName',
          label: '昵称'
        },
        {
          prop: 'balance',
          label: '徒弟现金'
        },
        {
          prop: 'totalBalance',
          label: '累计现金'
        },
        {
          prop: 'totalApplyBalance',
          label: '累计提现'
        },
        {
          prop: 'totalCoin',
          label: '累计金币'
        },
        {
          prop: 'sources',
          label: '第三方绑定'
        }
      ],
      tudiBean: {},
      tudiPageSize: 10,
      tudiPageNo: 1,
      tudiTotalSize: 0,
      // 现金明细详情
      cashData: [],
      propCashList: [
        {
          prop: 'amount',
          label: '金额'
        },
        {
          prop: 'cDate',
          label: '日期'
        },
        {
          prop: 'detail',
          label: '类型'
        }
      ],
      cashBean: {},
      cashPageSize: 10,
      cashPageNo: 1,
      cashTotalSize: 0,
      // 现金明细详情
      goldData: [],
      propGoldList: [
        {
          prop: 'money',
          label: '金币兑现'
        },
        {
          prop: 'logDate',
          label: '日期'
        },
        {
          prop: 'incNum',
          label: '金币收入'
        },
        {
          prop: 'exchangeRate',
          label: '汇率'
        }
      ],
      goldBean: {},
      goldPageSize: 10,
      goldPageNo: 1,
      goldTotalSize: 0
    }
  },
  mounted () {
  },
  props: {
    dialogTableVisible: Object,
    id: String
  },
  components: {
    CommonTable
  },
  methods: {
    // 过滤绑定第三方
    bindFormatter (row, column, cellValue, index) {
      let val = []
      for (let index = 0; index < row.bind.length; index++) {
        if (row.bind[index] === 'WEIXIN') {
          val.push('微信')
        } else if (row.bind[index] === 'WEIBO') {
          val.push('微博')
        } else if (row.bind[index] === 'QQ') {
          val.push('QQ')
        }
      }
      return val.toString()
    },

    // 请求用户详情接口
    getUserData (id) {
      this.$http.post(this.$store.state.testApi + '/admin/bops/user/manager_detail',
        this.filterData(id)
      ).then(res => {
        if (res.data.code === '0') {
          this.userData = Array(res.data.result)
        }
      })
    },

    // 查看邀请人信息
    seeReferrerId (index, row) {
      if (row.referrerId) {
        this.refrsh(row.referrerId)
      } else {
        this.$message('无邀请人')
      }
    },

    // 查看徒弟信息
    see (index, row) {
      if (row.apprenticeId) {
        this.refrsh(row.apprenticeId)
      } else {
        this.$message('无ID')
      }
    },

    // userId变化重新刷新弹窗
    refrsh (id) {
      this.getUserData({userId: id})
      this.tudiBean.userId = id
      this.getTudiData(this.tudiBean)
      this.goldBean.userId = id
      this.getGoldData(this.goldBean)
      this.cashBean.userId = id
      this.getCashData(this.cashBean)
    },

    // 请求用户的徒弟列表
    getTudiData (bean) {
      this.$http.post(this.$store.state.testApi + '/admin/bops/user_details/appreticeRecord',
        this.filterData(bean)
      ).then(res => {
        if (res.data.code === '0') {
          this.tudiData = res.data.result
          this.tudiTotalSize = parseInt(res.data.totalSize)
        }
      })
    },

    // 请求金币明细
    getGoldData (bean) {
      this.$http.post(this.$store.state.testApi + '/admin/bops/user/coin_flow_by_day',
        this.filterData(bean)
      ).then(res => {
        if (res.data.code === '0') {
          this.goldData = res.data.result
          this.goldTotalSize = parseInt(res.data.totalSize)
        }
      })
    },

    // 请求现金明细
    getCashData (bean) {
      this.$http.post(this.$store.state.testApi + '/admin/bops/user/user_balance_flow',
        this.filterData(bean)
      ).then(res => {
        if (res.data.code === '0') {
          this.cashData = res.data.result
          this.cashTotalSize = parseInt(res.data.totalSize)
        }
      })
    },

    // 徒弟列表翻页方法
    tudiHandleCurrentChange (val) {
      this.tudiBean.pageNo = val
      this.getTudiData(this.tudiBean)
    },

    // 金币明细翻页方法
    goldHandleCurrentChange (val) {
      this.goldBean.pageNo = val
      this.getGoldData(this.goldBean)
    },

    // 现金明细翻页方法
    cashHandleCurrentChange (val) {
      this.cashBean.pageNo = val
      this.getCashData(this.cashBean)
    },

    // 切换标签
    handleClick (val) {
      if (val.label === '徒弟列表') {
        // 请求徒弟列表
        this.getTudiData(this.tudiBean)
      } else if (val.label === '现金明细') {
        this.getCashData(this.cashBean)
      } else if (val.label === '金币明细') {
        this.getGoldData(this.goldBean)
      }
    }
  },
  watch: {
    'dialogTableVisible.show': function (val, oldVal) {
      // 打开弹窗获取用户详情
      if (val === true) {
        let id = {
          userId: this.id
        }
        // 请求用户详情
        this.getUserData(id)
        this.tudiBean = {
          userId: this.id,
          pageSize: this.tudiPageSize,
          pageNo: this.tudiPageNo
        }
        this.goldBean = {
          userId: this.id,
          pageSize: this.goldPageSize,
          pageNo: this.goldPageNo
        }
        this.cashBean = {
          userId: this.id,
          pageSize: this.cashPageSize,
          pageNo: this.cashPageNo
        }
        // 请求徒弟列表
        this.getTudiData(this.tudiBean)
        // 请求现金明细列表
        this.getCashData(this.cashBean)
        // 请求金币明细列表
        this.getGoldData(this.goldBean)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.tabs{
  margin-top: 40px;
}
.blue{
  color: #409EFF;
  cursor: pointer;
}
.page{
  margin-top: 16px;
  text-align: right;
}
</style>
