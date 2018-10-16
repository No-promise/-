<template>
  <div class="content-box">
    <!-- 表格数据 -->
    <div class="table-cont">
      <div class="table-top">
        <div class="table-top-fl">
        </div>
        <div class="table-top-fr">
          <el-input
            placeholder="搜索手机号或昵称"
            prefix-icon="el-icon-search"
            size="mini"
            v-model="searchPhone">
          </el-input>
          <el-button size="mini" class="table-top-fr-btn" type="primary" @click="search(searchPhone)">搜索</el-button>
        </div>
      </div>
      <el-table :data="tableData" border highlight-current-row header-row-class-name="strong">
        <!-- 注册时间 -->
        <el-table-column
          prop="gmtCreate"
          label="注册时间"
          align="center">
        </el-table-column>
        <!-- 手机账号 -->
        <el-table-column
          label="手机账号"
          align="center"
          width="200">
          <template slot-scope="scope">
            <span>{{scope.row.phone}}</span>
            <el-tag v-if="scope.row.isRiskUser === '1'" type="danger" size="mini">风险提醒</el-tag>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column
          label="操作"
          align="center"
          width="240"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              class="table-btn"
              @click="see(scope.$index, scope.row)">查看</el-button>
            <el-popover
              placement="top-end"
              width="160"
              v-model="scope.row.visible"
              >
              <p class="p-class">
                <i class="el-icon-warning warning"></i>
                <span class="span-class">你确定{{scope.row.isBanUser | lockFilter}}该用户吗?</span>
              </p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" @click="scope.row.visible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="unlock(scope.$index, scope.row)">确定</el-button>
              </div>
              <el-button
              size="mini"
              slot="reference"
              class="table-btn"
              >{{scope.row.isBanUser | lockFilter}}</el-button>
            </el-popover>
            <el-popover
              placement="top-end"
              width="160"
              v-model="scope.row.cashVisible"
              >
              <p class="p-class">
                <i class="el-icon-warning warning"></i>
                <span class="span-class">你确定该用户添加提现次数吗?</span>
              </p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" @click="scope.row.cashVisible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="addTime(scope.$index, scope.row)">确定</el-button>
              </div>
              <el-button
              size="mini"
              slot="reference"
              class="table-btn"
              >添加机会</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <!-- 静态表格 -->
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
    <!-- 用户详情组件 -->
    <user-mange-dialog :id="rowUserId" :dialogTableVisible="dialogTableVisible"></user-mange-dialog>
  </div>
</template>

<script>
import CommonTable from '@/components/table/CommonTable' // 导入公用表格组件
import SearchTime from '@/components/common/SearchTime' // 公共时间搜索组件
import UserMangeDialog from '@/components/dialog/UserMangeDialog' // 用户详情组件
export default {
  name: 'EarningCount',
  data () {
    return {
      visible: false,
      cashVisible: false, // 新增提现机会popover
      // 搜索手机号
      searchPhone: '',
      // 表头数据
      propData: [
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
        },
        {
          prop: 'channelFrom',
          label: '用户来源'
        }
      ],
      // 默认表格数据
      tableData: [],
      // 翻页的数据
      totalSize: 0, // 总数量
      pageSize: 10, // 每页数量
      pageNo: 1, // 页码
      bean: {},
      // 每行用户详情的数据
      rowUserId: '',
      dialogTableVisible: {
        show: false
      }
    }
  },
  mounted () {
    this.$store.state.activeRouter = '/UserManage'
    // 搜索请求数据重置
    this.bean = {
      pageSize: this.pageSize,
      pageNo: this.pageNo
    }
    // 获取统计数据
    this.getData(this.bean)
  },
  methods: {
    // 获取统计数据
    getData (bean) {
      this.$http.post(this.$store.state.testApi + '/admin/bops/user/manager_list',
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

    // 手机号搜索
    search (val) {
      this.bean.keyword = val
      this.getData(this.bean)
    },

    // 查看数据
    see (index, row) {
      this.rowUserId = row.userId
      this.dialogTableVisible.show = true
    },

    // 解锁
    unlock (index, row) {
      let lockBean = {
        banBehaviorEnum: 'WITHDRAW',
        userId: row.userId
      }
      var url = row.isBanUser === '0' ? '/admin/bops/user/ban_user' : '/admin/bops/user/relieve_user_ban'
      this.$http.post(this.$store.state.testApi + url,
        this.filterData(lockBean)
      ).then(res => {
        if (res.data.code === '0') {
          row.visible = false
          this.getData(this.bean)
          this.$message({
            type: 'success',
            message: '操作成功'
          })
        }
      })
    },

    // 新增提现机会
    addTime (index, row) {
      let params = {
        userId: row.userId
      }
      this.$http.post(this.$store.state.testApi + '/admin/bops/withdraw/add_withdraw_chance',
        this.filterData(params)
      ).then(res => {
        row.cashVisible = false
        if (res.data.result !== '0') {
          this.$message({
            type: 'success',
            message: '已为该用户添加提现机会1次'
          })
        } else {
          this.$message({
            type: 'error',
            message: '机会添加失败，请稍候再试或联系管理员'
          })
        }
      })
    }
  },
  components: {
    CommonTable,
    SearchTime,
    UserMangeDialog
  },
  filters: {
    // 锁定过滤器
    lockFilter (value) {
      return value === '0' ? '锁定' : '解锁'
    }
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
.warning{
  color: #E6A23C;
}
.span-class{
  margin-left: 5px;
}
.p-class{
  margin-bottom: 20px;
}
</style>
