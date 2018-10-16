<template>
  <div class="content-box">
    <!-- 表格数据 -->
    <div class="table-cont">
      <div class="table-top">
        <div class="table-top-fl">
          <div class="table-top-ico"></div>
          <div class="table-top-title">积分详细</div>
        </div>
        <div class="table-top-fr">
          <search-time @getTime="getTime"></search-time>
          <el-button
            class="table-top-fr-btn"
            type="primary"
            size="mini"
            @click="handleDownload"
            :loading="downloadLoading"
          >导出</el-button>
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
  name: 'CreditCount',
  data () {
    return {
      // 表头数据
      propData: [
        {
          prop: 'appreticContribution',
          label: '徒弟贡献'
        },
        {
          prop: 'dateDay',
          label: '日期'
        },
        {
          prop: 'totalCoin',
          label: '金币总发放'
        },
        {
          prop: 'coinUser',
          label: '金币总发放人数',
          formatter: this.formatCoinUser
        },
        {
          prop: 'proportion',
          label: '金币汇率/1000'
        },
        {
          prop: 'signIn',
          label: '签到金币'
        },
        {
          prop: 'newbieTask',
          label: '新手任务金币'
        },
        {
          prop: 'read',
          label: '阅读资讯金币'
        },
        {
          prop: 'share',
          label: '分享资讯金币'
        },
        {
          prop: 'comment',
          label: '精彩评论'
        },
        {
          prop: 'readPush',
          label: '阅读推送资讯'
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
    this.$store.state.activeRouter = '/CreditCount'
    // 搜索请求数据重置
    this.bean = {
      pageSize: this.pageSize,
      pageNo: this.pageNo
    }
    // 获取统计数据
    this.getData(this.bean)
  },
  methods: {
    // 导出excel
    handleDownload () {
      if (this.bean.startDate && this.bean.endDate) {
        let bean = {
          type: '2',
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
      this.$http.post(this.$store.state.testApi + '/admin/bops/data/coin_statistical',
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
</style>
