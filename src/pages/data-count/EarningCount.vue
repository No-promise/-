<template>
  <div class="content-box">
    <!-- 表格数据 -->
    <div class="table-cont">
      <div class="table-top">
        <div class="table-top-fl">
          <div class="table-top-ico"></div>
          <div class="table-top-title">营收详细</div>
        </div>
        <div class="table-top-fr">
          <search-time @getTime="getTime"></search-time>
          <el-button class="table-top-fr-btn" type="primary" size="mini" @click="handleDownload" :loading="downloadLoading">导出
          </el-button>
        </div>
      </div>
      <el-table :data="tableData" border highlight-current-row header-row-class-name="strong">
        <common-table :propData="propData">
        </common-table>
      </el-table>
      <div class="page">
        <el-pagination background layout="prev, pager, next" :total="totalSize" :page-size="pageSize" :current-page="pageNo" @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import CommonTable from '@/components/table/CommonTable' // 导入公用表格组件
import SearchTime from '@/components/common/SearchTime' // 公共时间搜索组件
import { handleDownload } from '@/common' // 公共js方法组件
export default {
  name: 'EarningCount',
  data () {
    return {
      // 表头数据
      propData: [
        {
          prop: 'withdrawedAmount',
          label: '已提现金额'
        },
        {
          prop: 'logDate',
          label: '日期'
        },
        {
          prop: 'outMoney',
          label: '现金总发放'
        },
        {
          prop: 'coinExchange',
          label: '金币兑换'
        },
        {
          prop: 'registerReward',
          label: '新人红包'
        },
        {
          prop: 'redUser',
          label: '新人红包总发放人数',
          formatter: this.formatRedUser
        },
        {
          prop: 'apprenticeReward',
          label: '收徒奖励'
        },
        {
          prop: 'inviteReward',
          label: '绑定邀请码'
        },
        {
          prop: 'withdrawApplyAmount',
          label: '提现申请'
        }
      ],
      // 默认表格数据
      tableData: [],
      // 翻页的数据
      totalSize: 0, // 总数量
      pageSize: 20, // 每页数量
      pageNo: 1, // 页码
      bean: {},
      downloadLoading: false
    }
  },
  mounted () {
    this.$store.state.activeRouter = '/EarningCount'
    // 搜索请求数据重置
    this.bean = {
      pageSize: this.pageSize,
      pageNo: this.pageNo
    }
    // 获取统计数据
    this.getData(this.bean)
  },
  methods: {
    // 过滤新人红包总发放人数
    formatRedUser (val) {
      return val.redUser === null || !val.redUser ? 0 : val.redUser
    },
    // 导出excel
    handleDownload () {
      if (this.bean.sDate && this.bean.eDate) {
        let bean = {
          type: '3',
          startTime: this.bean.eDate,
          endTime: this.bean.sDate
        }
        this.$http.post(this.$store.state.testApi + '/admin/bops/data/export',
          this.filterData(bean)
        ).then(res => {
          if (res.data.code === '0') {
            handleDownload(this.downloadLoading, this.propData, res.data.result)
          }
        })
      } else {
        this.$message({
          type: 'error',
          message: '请筛选时间段后导出'
        })
      }
    },

    // 获取统计数据
    getData (bean) {
      this.$http.post(this.$store.state.testApi + '/admin/bops/data/revenue_statistics_every_day',
        this.filterData(bean)
      ).then(res => {
        if (res.data.code === '0') {
          this.tableData = res.data.result
          this.totalSize = parseInt(res.data.totalSize)
        }
      })
    },

    // 翻页方法
    handleCurrentChange (val) {
      this.bean.pageNo = val
      this.getData(this.bean)
    },

    // 从子组件获取时间段筛选数据
    getTime (val) {
      if (val) {
        this.bean.sDate = val[1]
        this.bean.eDate = val[0]
        this.getData(this.bean)
      } else {
        delete this.bean.sDate
        delete this.bean.eDate
        this.getData(this.bean)
      }
    }
  },
  components: {
    CommonTable,
    SearchTime
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.table-cont {
  padding: 0 25px;
  background-color: #fff;
}
.top {
  padding: 0 25px;
  background-color: #fff;
  margin-bottom: 15px;
}
.table-top {
  padding: 16px 0 8px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.table-top-fl {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.table-top-ico {
  width: 2px;
  height: 15px;
  background-color: #108ee9;
  margin-right: 9px;
}
.table-top-title {
  font-size: 14px;
  line-height: 22px;
  text-align: left;
  color: rgba(0, 0, 0, 0.65);
}
.page {
  padding: 25px 0 40px 0;
  text-align: right;
}
.table-top-fr {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.table-top-fr-btn {
  margin-left: 8px;
}
</style>
