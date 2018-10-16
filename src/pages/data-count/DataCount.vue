<template>
  <div>
    <div class="top">
      <div class="table-top">
        <div class="table-top-fl">
          <div class="table-top-ico"></div>
          <div class="table-top-title">基础概要</div>
        </div>
      </div>
      <!-- 头部数据统计 -->
      <div class="top-main">
        <div class="top-main-div">
          <div class="img"><img src="https://janesi-oss.oss-cn-shanghai.aliyuncs.com/mgr-web/images/users.png"></div>
          <div class="top-main-right">
            <div class="top-main-right-title">累计用户</div>
            <div class="top-main-right-num">{{count.userNumber}}</div>
          </div>
        </div>
        <div class="top-main-div">
          <div class="img"><img src="https://janesi-oss.oss-cn-shanghai.aliyuncs.com/mgr-web/images/accounts.png"></div>
          <div class="top-main-right">
            <div class="top-main-right-title">累计账号</div>
            <div class="top-main-right-num">{{count.accountNumber}}</div>
          </div>
        </div>
        <div class="top-main-div">
          <div class="img"><img src="https://janesi-oss.oss-cn-shanghai.aliyuncs.com/mgr-web/images/active-user.png"></div>
          <div class="top-main-right">
            <div class="top-main-right-title">过去七日活跃用户</div>
            <div class="top-main-right-num">{{count.sevenDAU}}</div>
          </div>
        </div>
        <div class="top-main-div">
          <div class="img"><img src="https://janesi-oss.oss-cn-shanghai.aliyuncs.com/mgr-web/images/active-user2.png"></div>
          <div class="top-main-right">
            <div class="top-main-right-title">过去十五日活跃用户</div>
            <div class="top-main-right-num">{{count.fifteenDAU}}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 表格数据 -->
    <div class="table-cont">
      <div class="table-top">
        <div class="table-top-fl">
          <div class="table-top-ico"></div>
          <div class="table-top-title">基础明细</div>
        </div>
        <div class="table-top-fr">
          <search-time @getTime="getTime"></search-time>
          <el-button
            class="table-top-fr-btn"
            type="primary"
            size="mini"
            @click="handleDownload"
            :loading="downloadLoading"
          >导出
          </el-button>
        </div>
      </div>
      <el-table :data="tableData" border highlight-current-row header-row-class-name="strong">
        <common-table :propData="propData">
        </common-table>
      </el-table>
      <div class="page">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="totalSize"
          :page-size="pageSize"
          :current-page="pageNo"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import CommonTable from '@/components/table/CommonTable' // 导入公用表格组件
import SearchTime from '@/components/common/SearchTime' // 公共时间搜索组件
import {handleDownload} from '@/common' // 公共js方法组件
export default {
  name: 'DataCount',
  data () {
    return {
      count: {
        userNumber: '0',
        accountNumber: '0',
        sevenDAU: '0',
        fifteenDAU: '0'
      },
      // 表头数据
      propData: [],
      // 默认表格数据
      tableData: [],
      // 翻页的数据
      totalSize: 0, // 总数量
      pageSize: 10, // 每页数量
      pageNo: 1, // 页码
      bean: {},
      downloadLoading: false
    }
  },
  mounted () {
    this.$store.state.activeRouter = '/DataCount'
    // 获取统计用户基础数据概要
    this.getCount()
    // 表单默认设置
    this.propData = [
      {
        prop: 'browseAverage',
        label: '平均日阅读文章数'
      },
      {
        prop: 'dateDay',
        label: '日期'
      },
      {
        prop: 'downloadNumber',
        label: '新增用户'
      },
      {
        prop: 'registerNumber',
        label: '新增账号'
      },
      {
        prop: 'activeNumber',
        label: '活跃用户'
      },
      {
        prop: 'dayRetention',
        label: '次日留存'
      },
      {
        prop: 'dailyStartNum',
        label: '平均日启动次数'
      },
      {
        prop: 'accessAverage',
        label: '平均日使用时长'
      }
    ]
    // 搜索请求数据重置
    this.bean = {
      pageSize: this.pageSize,
      pageNo: this.pageNo
    }
    // 获取统计数据
    this.getData(this.bean)
  },
  methods: {
    // 统计用户基础数据概要
    getCount () {
      this.$http.post(this.$store.state.testApi + '/admin/bops/data/user_summary',
        this.filterData()
      ).then(res => {
        if (res.data.code === '0') {
          this.count = res.data.result
        }
      })
    },

    // 导出excel
    handleDownload () {
      if (this.bean.startDate && this.bean.endDate) {
        let bean = {
          type: '1',
          startTime: this.bean.startDate,
          endTime: this.bean.endDate
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
      this.$http.post(this.$store.state.testApi + '/admin/bops/data/behavior/',
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
        this.bean.startDate = val[0]
        this.bean.endDate = val[1]
        this.getData(this.bean)
      } else {
        delete this.bean.startDate
        delete this.bean.endDate
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
.table-cont{
  padding: 0 25px;
  background-color: #fff;
}
.top{
  padding: 0 25px;
  background-color: #fff;
  margin-bottom: 15px;
}
.table-top{
  padding: 16px 0 8px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.table-top-fl{
  display: flex;
  flex-direction: row;
  align-items: center;
}
.table-top-ico{
  width: 2px;
  height: 15px;
  background-color: #108ee9;
  margin-right: 9px;
}
.table-top-title{
  font-size: 14px;
  line-height: 22px;
  text-align: left;
  color: rgba(0, 0, 0, 0.65);
}
.page{
  padding: 25px 0 40px 0;
  text-align: right;
}
.table-top-fr{
  display: flex;
  flex-direction: row;
  align-items: center;
}
.table-top-fr-btn{
  margin-left: 8px;
}
.img{
  width: 72px;
  height: 72px;
  margin-right: 17px;
}
.top-main-right{
  height: 72px;
}
.top-main-right-title{
  font-size: 14px;
  margin-top: 5px;
  margin-bottom: 22px;
  color: rgba(0, 0, 0, 0.85);
}
.top-main-right-num{
  font-size: 36px;
  color: rgba(0, 0, 0, 0.85);
}
.top-main{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 60px 0 80px 0;
}
.top-main-div{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
</style>
