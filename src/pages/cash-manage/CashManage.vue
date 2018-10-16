<template>
  <div class="content-box">
    <div class="table-cont">
      <div class="table-top">
        <div class="table-top-fl">
          <el-button class="table-top-fl-btn" size="mini" @click="handleBatch('CONFIRM', false)">提现</el-button>
          <el-button class="table-top-fl-btn" size="mini" @click="handleBatch('REJECT', false)">驳回</el-button>
        </div>
        <div class="table-top-fr">
          <el-form :inline="true" :model="topForm" class="top-form-inline" size="small">
            <el-form-item class="small-form-item">
              <el-select v-model="amount" @change="getSearchData" placeholder="额度筛选" size="mini">
                <el-option v-for="item in amountOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="small-form-item">
              <el-select v-model="topForm.states" @change="getSearchData" placeholder="选择状态" size="mini">
                <el-option v-for="item in statesOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <search-time @getTime="getTime"></search-time>
            </el-form-item>
            <el-form-item class="big-form-item">
              <el-input v-model="topForm.findKey" placeholder="请输入用户ID、姓名或手机号" size="mini" width="120px"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="table-top-fr-btn" type="primary" @click="getSearchData" size="mini">搜索</el-button>
            </el-form-item>
            <el-form-item>
              <el-button class="table-top-fr-btn" type="primary" @click="handleDownload" :loading="downloadLoading" size="mini">导出</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <!--表格  -->
      <div class="table">
        <el-table :data="tableData" border header-row-class-name="strong" show-overflow-tooltip @select="handleSelectionChange" @select-all="handleSelectionChange" @selection-change="handleSelectionChange" style="text-align:center">
          <el-table-column type="selection" width="55" align="center" :selectable="selectable"></el-table-column>
          <el-table-column prop="userId" label="用户ID" align="center"></el-table-column>
          <el-table-column prop="gmtCreate" label="申请时间" align="center"></el-table-column>
          <el-table-column prop="status" label="状态" width="120" align="center">
            <template slot-scope="scope">
              <span class="dis-inblock status-label" :class="scope.row.status == 0 ? 'undo' : scope.row.status == 1 ? 'done' : 'reject'">{{scope.row.status == 0 ? '待提现' : scope.row.status == 1 ? '已提现' : "已驳回"}}</span>
              <el-tooltip class="toolTipItem" effect="dark" placement="top" v-if="scope.row.status == 2">
                <div slot="content">驳回原因：<br/><br/>{{scope.row.rejectReason}}</div>
                <i class="el-icon-warning"></i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="用户手机号" width="190" align="center">
            <template slot-scope="scope">
              <span class="dis-inblock status-label">{{scope.row.phone}}</span>
              <el-tooltip class="toolTipItem" effect="dark" placement="top" v-if="scope.row.isRiskUser == 1">
                <div slot="content">
                  <p>该用户一小时内邀请七名用户</p>
                  <p v-if="parseInt(scope.row.warnCount) > 1"><br/>{{'出现次数：' + scope.row.warnCount + '次'}}</p>
                </div>
                <el-tag class="full-bg-danger" size="mini">风险提醒</el-tag>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="提现金额" align="center"></el-table-column>
          <el-table-column prop="withdrawName" label="支付宝姓名" align="center"></el-table-column>
          <el-table-column prop="withdrawType" label="渠道" :formatter="formatStatus2" align="center"></el-table-column>
          <el-table-column prop="withdrawAccount" label="账号" align="center"></el-table-column>
          <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope">
              <!--提现-->
              <el-popover placement="top" width="300" trigger="click" v-if="scope.row.status == 0" v-model="scope.row.cashPopoverVisible">
                <el-button class="table-btn" size="mini" slot="reference" @click="scope.row.cashPopoverVisible = true">提现</el-button>
                <p style="margin-bottom: 15px">
                  <i class="el-icon-warning color-yellow"></i>你确定提现吗？</p>
                <div style="text-align: right">
                  <el-button type="info" plain size="mini" @click="scope.row.cashPopoverVisible = false">取消</el-button>
                  <el-button type="primary" size="mini" @click="confirmCash(scope.$index,scope.row)">提现</el-button>
                </div>
              </el-popover>

              <!--驳回-->
              <el-popover placement="top" width="300" trigger="click" v-if="scope.row.status == 0" v-model="scope.row.rejectPopoverVisible">
                <el-button class="table-btn" size="mini" slot="reference" @click="scope.row.rejectPopoverVisible = true">驳回</el-button>
                <el-form :model="form" size="mini">
                  <el-form-item prop="rejectReason">
                    <p style="margin-bottom: 10px">
                      <i class="el-icon-warning color-yellow"></i>你确定驳回吗？</p>
                    <el-input v-model="form.rejectReason"></el-input>
                  </el-form-item>
                  <el-form-item style="margin-top:20px;text-align:right">
                    <el-button type="info" plain size="mini" @click="cancelReject(scope.$index,scope.row,'form')">取消</el-button>
                    <el-button type="danger" plain size="mini" @click="riskReject(scope.$index,scope.row,'form')">锁定并驳回</el-button>
                    <el-button type="danger" size="mini" @click="conformReject(scope.$index,scope.row,'form')">驳回</el-button>
                  </el-form-item>
                </el-form>
              </el-popover>
              <p v-else-if="scope.row.status == 1">已确认提现</p>
              <p v-else-if="scope.row.status == 3">已驳回并锁定</p>
              <p v-else>已确认驳回</p>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--分页-->
      <div class="page">
        <el-pagination background layout="prev, pager, next" :page-size="pageSize" :current-page.sync="currentPage" :page-count="pageCount" @current-change="handlePage()"></el-pagination>
      </div>
      <!--提现失败驳回弹窗-->
      <el-dialog title="提现失败、是否驳回" :visible.sync="dialogVisible" width="30%">
        <el-form :model="form" :rules="rules" ref="form">
          <!--隐藏域-->
          <el-input v-model="form.id" auto-complete="off" style="display: none;"></el-input>
          <el-form-item label="驳回理由" :label-width="formLabelWidth" size="mini" prop="rejectReason">
            <el-input v-model="form.rejectReason" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="calcelReject('form')">取 消</el-button>
          <el-button type="primary" @click="conformReject('', '','form')" size="small">确定驳回</el-button>
        </span>
      </el-dialog>
      <el-dialog :visible.sync="batchdialogVisible" width="35%">
        <el-form :model="bacthForm" size="mini">
          <el-form-item prop="rejectReason">
            <p style="margin-bottom: 10px">
              <i class="el-icon-warning color-yellow"></i>{{batchDialogTip}}</p>
            <el-input v-model="bacthForm.rejectReason" placeholder="请输入驳回理由" v-show="bacthForm.withdrawBehavior === 'REJECT' "></el-input>
          </el-form-item>
          <el-form-item style="margin-top: 50px;margin-bottom: 0" align="right">
            <el-button type="info" plain size="mini" @click="batchdialogVisible = false">取消</el-button>
            <el-button v-model="bacthForm.withdrawBehavior" type="primary" size="mini" @click="handleBatch(bacthForm.withdrawBehavior, true)">确定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import SearchTime from '@/components/common/SearchTime' // 公共时间搜索组件
import { handleDownload } from '@/common' // 公共js方法组件
export default {
  name: 'CashManage',
  data () {
    return {
      topForm: { // 顶部表单
        states: '',
        sDate: '',
        eDate: '',
        findKey: '',
        amount: ''
      },
      amount: '',
      tableData: [], // 表格数据
      pageCount: 1, // 总页数
      currentPage: 1, // 当前页
      pageSize: 10, // 每页显示条数
      dialogVisible: false, // 体现失败弹窗显隐藏
      formLabelWidth: '100px', // 表格列宽
      form: { // 驳回表单
        rejectReason: '',
        id: ''
      },
      rules: { // 验证规则
        rejectReason: [
          { required: true, message: '请输入驳回理由', trigger: 'blur' }
        ]
      },
      cashPopoverVisible: false, // 提现浮层显隐
      rejectPopoverVisible: false, // 驳回浮层显隐
      statesOption: [ // 状态选项
        {
          value: 'CHECKING',
          label: '待提现'
        }, {
          value: 'PASSED',
          label: '已提现'
        }, {
          value: 'REJECT',
          label: '已驳回'
        }, {
          value: '',
          label: '全部状态'
        }
      ],
      amountOption: [ // 状态选项
        {
          value: '',
          label: '全部额度'
        }, {
          value: '1',
          label: '1元'
        }, {
          value: '30',
          label: '30元'
        }, {
          value: '50',
          label: '50元'
        }
      ],
      downloadLoading: false, // 导出loading标志是否显示
      // 表头数据
      propData: [
        {
          prop: 'gmtCreate',
          label: '申请时间'
        },
        {
          prop: 'status',
          label: '状态'
        },
        {
          prop: 'phone',
          label: '用户手机号'
        },
        {
          prop: 'amount',
          label: '提现金额'
        },
        {
          prop: 'withdrawName',
          label: '支付宝姓名'
        },
        {
          prop: 'withdrawType',
          label: '渠道'
        },
        {
          prop: 'withdrawAccount',
          label: '帐号'
        }
      ],
      batchdialogVisible: false, // 批量操作确认弹窗按钮
      bacthForm: { // 批量操作参数
        ids: '',
        withdrawBehavior: '',
        rejectReason: ''
      },
      batchDialogTip: '',
      batchNum: 0
    }
  },
  mounted () {
    this.$store.state.activeRouter = '/CashManage'
    this.getTableData()
  },
  methods: {
    // 表格status
    formatStatus2 (row, column) {
      return row.withdrawType === '1' ? '支付宝' : row.status === '2' ? '微信' : '银联'
    },

    // 输入框内容变更
    changeFindKey () {
      // console.log(this.topForm)
    },

    // 搜索
    getSearchData () {
      let params = Object.assign({}, this.topForm)
      params.pageNo = '1'
      if (this.amount !== '' && this.amount.length < 5) {
        params.amount = parseInt(this.amount) * 10000
      }
      this.$http.post(this.$store.state.testApi + '/admin/bops/withdraw/record',
        this.filterData(params)
      ).then(res => {
        this.tableData = res.data.result
        this.pageCount = parseInt(res.data.totalPage)
        for (var i in this.tableData) {
          if (this.tableData[i].rejectReason === '' || this.tableData[i].rejectReason === null) {
            this.tableData[i].rejectReason = '未填写原因'
          }
        }
        this.currentPage = parseInt(res.data.pageNo)
      })
    },

    // 获取表格数据
    getTableData () {
      let params = Object.assign(this.topForm, {})
      params.pageNo = '1'
      if (this.amount !== '' && this.amount.length < 5) {
        params.amount = parseInt(this.amount) * 10000
      }
      this.$http.post(this.$store.state.testApi + '/admin/bops/withdraw/record',
        this.filterData(params)
      ).then(res => {
        this.tableData = res.data.result
        this.pageCount = parseInt(res.data.totalPage)
        this.currentPage = parseInt(res.data.pageNo)
        for (var i in this.tableData) {
          if (this.tableData[i].rejectReason === '' || this.tableData[i].rejectReason === null) {
            this.tableData[i].rejectReason = '未填写原因'
          }
        }
        this.isRiskUser = parseInt(res.data.result.isRiskUser)
      })
    },

    // 选择行
    handleSelectionChange (val) {
      if (val.length === 1) {
        this.bacthForm.ids = val[0].id
        this.batchNum = 1
      } else {
        let params = []
        for (let i in val) {
          if (val[i].status === '0') {
            params.push(val[i].id)
          }
        }
        this.batchNum = val.length
        this.bacthForm.ids = params.toString()
      }
    },

    // 禁止已推荐行被选择
    selectable (val) {
      if (val.status !== '0') {
        return false
      } else {
        return true
      }
    },

    // 批量提现、驳回操作
    handleBatch (batch, isVisible) {
      if (this.bacthForm.ids === '') {
        this.$message.warning({
          message: '请选择待提现的流水重试！'
        })
      } else {
        if (isVisible === true) { // 点击弹框内的确定按钮，执行批量操作
          let params = this.bacthForm
          // 提现操作删除对象中的驳回原因属性
          if (batch !== 'REJECT') {
            delete params.rejectReason
          } else if (params.rejectReason === '' || !params.rejectReason || params.rejectReason == null) { // 未输入驳回原因驳回失败
            this.$message.warning({
              message: '请输入驳回原因!'
            })
            return false
          }
          // 请求接口
          this.$http.post(this.$store.state.testApi + '/admin/bops/withdraw/operate_all',
            this.filterData(params)
          ).then(res => {
            var successitemNum = ''
            if (res.data.code === '0') {
              successitemNum = parseInt(this.batchNum) - parseInt(res.data.result)
              var successMsg = '批量操作完成，成功' + successitemNum + '条，失败' + parseInt(res.data.result) + '条！'
              this.$message({
                message: successMsg,
                type: 'success'
              })
              // 刷新当前页面
              this.currentNewdata()
              this.batchdialogVisible = false
            } else if (res.data.code === '9000') {
              this.$message({
                message: this.bacthForm.withdrawBehavior === 'REJECT' ? '批量驳回操作失败，请重试！' : '批量提现操作失败，有用户被禁止提现，请重试！',
                type: 'error',
                duration: 5000
              })
            } else {
              let failMsg = ''
              successitemNum = parseInt(this.batchNum) - parseInt(res.data.result)
              this.bacthForm.withdrawBehavior === 'REJECT' ? failMsg = '批量驳回操作结束失败，请重试！' : failMsg = '批量提现操作失败，请重试！'
              this.$message({
                message: failMsg,
                type: 'error',
                duration: 5000
              })
              this.currentNewdata()
              this.batchdialogVisible = false
            }
          })
        } else { // 点击顶部按钮，获取操作类型
          this.batchdialogVisible = true
          this.bacthForm.withdrawBehavior = batch
          if (batch === 'CONFIRM') {
            this.batchDialogTip = '确定提现吗？'
          } else {
            this.batchDialogTip = '确定驳回吗？'
          }
        }
      }
    },

    // 确定提现
    confirmCash (index, row) {
      row ? row.cashPopoverVisible = false : this.cashPopoverVisible = false
      if (row.status !== 1) {
        let params = {
          id: row.id ? row.id : this.form.id,
          pageNo: this.currentPage,
          withdrawBehavior: 'CONFIRM'
        }
        this.$http.post(this.$store.state.testApi + '/admin/bops/withdraw/operate',
          this.filterData(params)
        ).then(res => {
          if (res.data.code === '0' && res.data.result.operateResult === '1') {
            row.status = 1
            this.$message({
              message: '提现成功',
              type: 'success'
            })
            // 刷新当前页面
            this.currentNewdata()
          } else {
            this.dialogVisible = true
            this.form.rejectReason = res.data.msg
            this.form.id = row.id
          }
        })
      }
    },

    // 提现失败弹窗关闭后清空驳回原因
    calcelReject () {
      this.dialogVisible = false
      this.form.rejectReason = ''
    },

    // 确定驳回
    conformReject (index, row, ruleForm) {
      if (this.form.rejectReason === '' || this.form.rejectReason === undefined || this.form.rejectReason == null) {
        this.$notify.error({
          title: '驳回失败',
          message: '请输入驳回原因',
          duration: 5000
        })
        return false
      } else {
        row ? row.rejectPopoverVisible = false : this.rejectPopoverVisible = false
        let params = {
          id: row.id ? row.id : this.form.id,
          withdrawBehavior: 'REJECT',
          rejectReason: this.form.rejectReason
        }
        this.$http.post(this.$store.state.testApi + '/admin/bops/withdraw/operate',
          this.filterData(params)
        ).then(res => {
          if (res.data.code === '0' && res.data.result.operateResult === '1') {
            // row.status = 1
            this.$message({
              message: '驳回成功',
              type: 'success'
            })
            // 刷新当前页面
            this.currentNewdata()
            this.dialogVisible = false
            this.form.rejectReason = ''
          } else {
            this.$message({
              message: '驳回失败，请重试或联系管理员',
              type: 'error'
            })
          }
        })
      }
    },

    // 关闭驳回弹窗
    cancelReject (index, row, ruleForm) {
      row.rejectPopoverVisible = false
    },

    // 驳回和锁定提现
    riskReject (index, row, validateForm) {
      // 先驳回
      if (this.form.rejectReason === '' || this.form.rejectReason === undefined || this.form.rejectReason === null) {
        this.$notify.error({
          title: '驳回失败',
          message: '请输入驳回原因',
          duration: 6000
        })
        return false
      } else {
        row.rejectPopoverVisible = false
        let rejectParams = {
          id: row.id,
          withdrawBehavior: 'REJECT',
          rejectReason: this.form.rejectReason
        }
        this.$http.post(this.$store.state.testApi + '/admin/bops/withdraw/operate',
          this.filterData(rejectParams)
        ).then(res => {
          if (res.data.code === '0' && res.data.result.operateResult === '1') {
            // 锁定
            let riskParams = {
              userId: row.userId,
              banBehaviorEnum: 'WITHDRAW'
            }
            this.$http.post(this.$store.state.testApi + '/admin/bops/user/ban_user',
              this.filterData(riskParams)
            ).then(res => {
              if (res.data.code === '0') {
                row.status = 1
                this.$message({
                  message: '已驳回，且锁定成功！',
                  type: 'success'
                })
                this.form.rejectReason = ''
                this.currentNewdata()
              } else {
                this.$message.error({
                  message: res.data.msg,
                  showClose: true
                })
                this.form.id = row.id
              }
            })
          } else {
            this.$message.error({
              message: res.data.msg,
              duration: 0,
              showClose: true
            })
            this.form.id = row.id
            this.form.rejectReason = ''
          }
        })
      }
    },

    // 获取新数据
    currentNewdata () {
      let params = Object.assign(this.topForm, {})
      params.pageNo = this.currentPage || '1'
      if (this.amount !== '' && this.amount.length < 5) {
        params.amount = parseInt(this.amount) * 10000
      }
      this.$http.post(this.$store.state.testApi + '/admin/bops/withdraw/record',
        this.filterData(params)
      ).then(res => {
        this.tableData = res.data.result
        this.pageCount = parseInt(res.data.totalPage)
        this.currentPage = parseInt(res.data.pageNo)
        for (var i in this.tableData) {
          if (this.tableData[i].rejectReason === '' || this.tableData[i].rejectReason === null) {
            this.tableData[i].rejectReason = '未填写原因'
          }
        }
        this.isRiskUser = parseInt(res.data.result.isRiskUser)
      })
    },

    // 分页
    handlePage () {
      let params = Object.assign(this.topForm, {})
      params.pageNo = this.currentPage
      if (this.amount !== '' && this.amount.length < 5) {
        params.amount = parseInt(this.amount) * 10000
      }
      this.$http.post(this.$store.state.testApi + '/admin/bops/withdraw/record',
        this.filterData(params)
      ).then(res => {
        this.tableData = res.data.result
        this.pageCount = parseInt(res.data.totalPage)
        this.currentPage = parseInt(res.data.pageNo)
        for (var i in this.tableData) {
          if (this.tableData[i].rejectReason === '' || this.tableData[i].rejectReason === null) {
            this.tableData[i].rejectReason = '未填写原因'
          }
        }
        this.isRiskUser = parseInt(res.data.result.isRiskUser)
      })
    },

    // 导出表格
    handleDownload () {
      if (this.topForm.sDate === '') {
        this.$message.error('请选择起止时间后再次进行导出操作！')
        return false
      } else {
        let params = {
          type: 4,
          startTime: this.topForm.sDate,
          endTime: this.topForm.eDate
        }
        this.$http.post(this.$store.state.testApi + '/admin/bops/data/export',
          this.filterData(params)
        ).then(res => {
          if (res.data.code === '0') {
            // var data = JSON.stringify(res.data)
            var dataArr = res.data.result
            for (var i in dataArr) {
              dataArr[i].status = dataArr[i].status === '0' ? '待提现' : dataArr[i].status === '1' ? '已提现' : '已驳回'
              dataArr[i].withdrawType = dataArr[i].withdrawType === '1' ? '支付宝' : dataArr[i].withdrawType === '2' ? '微信' : '银联'
            }
            handleDownload(this.downloadLoading, this.propData, dataArr)
          } else {
            this.$message.error(res.data.msg)
          }
        })
      }
    },

    // 从子组件获取时间段筛选数据
    getTime (val) {
      this.topForm.sDate = val ? val[0].split(' ')[0] + ' ' + '00:00:00' : ''
      this.topForm.eDate = val ? val[1].split(' ')[0] + ' ' + '23:59:59' : ''
      this.getSearchData()
    }
  },
  components: {
    SearchTime
  }
}
</script>
<style scoped>
.nav {
  margin-bottom: 25px;
}

.block {
  text-align: right;
  margin: 20px auto;
}

/*2018年6月5日新增样式*/
.top-form-inline {
  text-align: right;
}

.color-red {
  color: #f56c6c;
}

.dis-inblock {
  display: inline-block;
}

.status-label,
.color-yellow {
  margin-right: 5px;
}

.full-bg-danger {
  background: #f56c6c;
  color: #fff;
  cursor: default;
  border-color: #f56c6c;
}

.reject {
  color: #f56c6c;
}

.done,
.color-yellow {
  color: #e6a23c !important;
}

.el-icon-warning {
  color: #cccccc;
}

.table-btn {
  border: 1px solid #ccc;
  border-radius: 3px;
  padding: 5px 8px;
  display: inline-block;
}

.small-form-item {
  width: 120px;
}
</style>
