<template>
  <div class="content-box">
    <!-- 表格数据 -->
    <div class="table-cont">
      <div class="table-top">
        <div class="table-top-fl">
          <el-radio-group v-model="settingType" size="mini" @change="changeElements">
            <el-radio-button label="额度调整"></el-radio-button>
            <el-radio-button label="自动打款"></el-radio-button>
          </el-radio-group>
        </div>
        <div class="table-top-fr">
        </div>
      </div>
      <!-- 静态表格 -->
      <div class="set-litimt" v-if="settingType === '额度调整'">
        <el-table :data="tableData" border highlight-current-row header-row-class-name="strong">
          <common-table :propData="propData">
            <div slot="functions">
              <el-table-column label="操作" align="center" width="150">
                <template slot-scope="scope">
                  <el-popover placement="bottom" width="300" trigger="click" @after-leave="clearContent" v-model="scope.row.settingPopoverVisible">
                    <el-button class="table-btn" size="mini" slot="reference" @click="scope.row.settingPopoverVisible = true">编辑</el-button>
                    <el-form :model="form" size="mini">
                      <el-form-item prop="rejectReason">
                        <p style="margin-bottom: 10px">
                          <i class="el-icon-warning color-yellow"></i>你确定调整额度吗？</p>
                        <el-input v-model="form.limit" placeholder="请输入提现额度"></el-input>
                      </el-form-item>
                      <el-form-item style="margin-top:20px;text-align:right">
                        <el-button type="info" plain size="mini" @click="cancel(scope.$index,scope.row)">取消</el-button>
                        <el-button type="primary" plain size="mini" @click="comfirm(scope.$index,scope.row)">确定</el-button>
                      </el-form-item>
                    </el-form>
                  </el-popover>
                </template>
              </el-table-column>
            </div>
          </common-table>
        </el-table>
        <div class="page">
          <el-pagination background layout="prev, pager, next" :page-count="pageCount" :page-size="pageSize" :current-page="pageNo" @current-change="handleCurrentChange">
          </el-pagination>
        </div>
      </div>
      <div class="set-auto-cash" v-else>
        <h3 class="auto-box">
          <span class="auto-title">是否开启自动打款</span>
          <el-tooltip :content="autoData.value === false ? '关闭' : '打开'" placement="top" class="status-switch">
            <el-switch :disabled="autoVisible === true" @change="changeAutoFlag" v-model="autoData.value" active-color="#13ce66" inactive-color="#ff4949">
            </el-switch>
          </el-tooltip>
          <el-dialog title="自动打款设置" :visible.sync="autoVisible" width="30%" @close="autoCancel()">
            <p style="margin-bottom: 15px">
              <i class="el-icon-warning color-yellow"></i>你确定{{autoData.value === false ? '关闭' : '打开'}}自动打款吗？</p>
            <span slot="footer" class="dialog-footer">
              <el-button size="mini" @click="autoVisible = false">取 消</el-button>
              <el-button size="mini" type="primary" @click="autoConfirm()">确 定</el-button>
            </span>
          </el-dialog>
        </h3>
        <p class="tips">注：开启自动打款后，用户所有的提现都将有支付宝自动打款。</p>
      </div>
    </div>
  </div>
</template>

<script>
import CommonTable from '@/components/table/CommonTable' // 导入公用表格组件
export default {
  name: 'CashSetting',
  data () {
    return {
      settingType: '额度调整', // 切换页面显示内容
      autoVisible: false, // 自动打款确认表单显隐
      settingPopoverVisible: false, // 悬浮窗是否显示
      bean: {}, // 请求参数
      tableData: [], // 获取所有数据
      pageCount: 5, // 总页数
      pageNo: 1, // 当前页
      pageSize: 10, // 每页显示条数
      propData: [ // 表格数据结构
        {
          prop: 'describe',
          label: '用户类型'
        },
        {
          prop: 'value',
          label: '当前额度（次）'
        }
      ],
      form: { // 修改表单
        limit: ''
      },
      autoData: { // 自动打款数据
      }
    }
  },
  mounted () {
    this.$store.state.activeRouter = '/CashSetting'
    this.bean = {
      pageSize: this.pageSize,
      pageNo: this.pageNo
    }
    this.getTableData(this.bean)
  },
  methods: {
    // 获取数据
    getTableData (bean) {
      this.$http.post(this.$store.state.testApi + '/admin/bops/system/config/red_config',
        this.filterData(bean)
      ).then(res => {
        if (res.data.code === '0') {
          console.log(res.data.result[2].value)
          this.tableData = res.data.result.concat().splice(0, 2)
          this.autoData = res.data.result.concat().splice(2, 1)[0]
          if (this.autoData.value === 'true') {
            this.autoData.value = true
          } else {
            this.autoData.value = false
          }
          this.pageSize = parseInt(res.data.pageSize)
          this.pageCount = parseInt(res.data.totalPage)
          this.pageNo = parseInt(res.data.pageNo)
        }
      })
    },

    // 取消编辑额度
    cancel (index, row) {
      row.settingPopoverVisible = false
      this.clearContent()
    },

    // 清空编辑表单内容
    clearContent () {
      this.form = {
        limit: ''
      }
    },

    // 确定编辑额度
    comfirm (index, row) {
      let param = JSON.parse(JSON.stringify(row))
      if (isNaN(parseInt(this.form.limit))) {
        this.$notify({
          title: '警告',
          message: '请输入正确的额度',
          type: 'warning'
        })
      } else {
        param.value = this.form.limit
        this.$http.post(this.$store.state.testApi + '/admin/bops/system/config/save',
          this.filterData(param)
        ).then(res => {
          if (res.data.code === '0') {
            this.$message({
              type: 'success',
              message: '额度修改成功'
            })
            this.getTableData()
          }
        })
      }
    },

    // 分页方法
    handleCurrentChange (currentPage) {
      this.bean.pageNo = currentPage
      this.getTableData(this.bean)
    },

    // 切换额度调整和自动打款
    changeElements (ele) {
    },

    // 自动打款状态开关
    changeAutoFlag () {
      this.autoVisible = true
    },

    // 取消更改自动打款状态
    autoCancel () {
      if (this.autoData.value === true) {
        this.autoData.value = false
      } else {
        this.autoData.value = true
      }
    },

    // 确定更改自动打款状态
    autoConfirm () {
      // 调用接口，成功后关闭弹窗
      let param = JSON.parse(JSON.stringify(this.autoData))
      this.$http.post(this.$store.state.testApi + '/admin/bops/system/config/save',
        this.filterData(param)
      ).then(res => {
        if (res.data.code === '0') {
          this.autoVisible = false
          this.$message({
            type: 'success',
            message: param.value === true ? '已成功开启自动打款' : '已成功关闭自动打款'
          })
          this.autoCancel()
        } else {
          this.autoCancel()
        }
      })
    }
  },
  components: {
    CommonTable
  }
}
</script>

<style scoped>
.set-auto-cash {
  padding: 25px 0;
}

.auto-title {
  font-size: 20px;
}

.tips {
  font-size: 12px;
  color: #aaa;
  margin-top: 25px;
}

.status-switch {
  vertical-align: text-bottom;
  margin-left: 125px;
}
</style>
