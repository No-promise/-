<template>
  <div class="content-box">
    <!-- 表格数据 -->
    <div class="table-cont">
      <div class="table-top">
        <div class="table-top-fl">
          <div class="table-top-ico"></div>
          <div class="table-top-title">推送管理</div>
        </div>
        <div class="table-top-fr">
          <el-button class="table-top-fr-btn" type="primary" size="mini" @click="handleEdit('', '', 'add')">添加</el-button>
        </div>
      </div>
      <el-table :data="tableData" border highlight-current-row header-row-class-name="strong">
        <common-table :propData="propData">
          <div slot="status">
            <el-table-column prop="status" label="状态" align="center" width="120">
              <template slot-scope="scope">
                <span class="dis-inblock status-label" :class="scope.row.status == 0 ? 'unpush' : 'pushed'">{{scope.row.status == 0 ? '待推送' : '已推送'}}</span>
                <el-tooltip class="toolTipItem" effect="dark" placement="top" v-if="scope.row.status == 2">
                  <div slot="content">驳回原因：<br/><br/>{{scope.row.rejectReason}}</div>
                  <i class="el-icon-warning"></i>
                </el-tooltip>
              </template>
            </el-table-column>
          </div>
          <div slot="functions">
            <el-table-column label="操作" align="center" width="150">
              <template slot-scope="scope">
                <div class="pushed" v-if="scope.row.status === '1' ">
                  <el-button class="table-btn" size="mini" @click="handleEdit(scope.$index, scope.row, 'scan')">查看</el-button>
                </div>
                <div class="unpush" v-else>
                  <el-button class="table-btn" size="mini" @click="handleEdit(scope.$index, scope.row, 'edit')">编辑</el-button>
                  <el-button class="table-btn" size="mini" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </div>
              </template>
            </el-table-column>
          </div>
        </common-table>
      </el-table>
      <el-dialog :visible.sync="pushDialogVisible" width="650px">
        <div slot="title">{{this.pushDialogTitle}}</div>
        <form-for-push :handleType=handleType :formData=formData @cancelDialog="cancelDialog" @submitForm="submitForm">
        </form-for-push>
      </el-dialog>
      <div class="page">
        <el-pagination background layout="prev, pager, next" :total="totalSize" :page-size="pageSize" :current-page="pageNo" @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import CommonTable from '@/components/table/CommonTable' // 导入公用表格组件
import FormForPush from '@/components/form/FormForPush' // 导入表单组件
export default {
  name: 'AppPush',
  data () {
    return {
      // 表头数据
      propData: [
        {
          prop: 'type',
          label: '类型',
          formatter: this.typeFormatter
        },
        {
          prop: 'title',
          label: '标题'
        },
        {
          prop: 'detail',
          label: '描述'
        },
        {
          prop: 'pushTime',
          label: '推送时间'
        },
        {
          prop: 'reward',
          label: '奖励',
          formatter: this.rewardFormatter
        },
        {
          prop: 'extra',
          label: '跳转地址'
        }
      ],
      // 默认表格数据
      tableData: [],
      // 翻页的数据
      totalSize: 0, // 总数量
      pageSize: 10, // 每页数量
      pageNo: 1, // 页码
      bean: {},
      // 弹框显隐
      pushDialogVisible: false,
      pushDialogTitle: '添加推送',
      // 表单数据
      formData: {
        pushType: '', // 推送类型
        title: '', // 标题
        detail: '', // 描述
        linkUrl: '', // 跳转地址
        reward: '0', // 推送奖励
        pushTime: '', // 推送时间（date+time组合）
        date: '', // 推送日期
        time: '', // 推送时间
        extra: '暂无'
      },
      // 查看 or 编辑
      handleType: ''
    }
  },
  mounted () {
    this.$store.state.activeRouter = '/AppPush'
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
      this.$http.post(this.$store.state.testApi + '/admin/bops/push/list',
        this.filterData(bean)
      ).then(res => {
        this.tableData = res.data.result
        this.totalSize = parseInt(res.data.totalSize)
      })
    },

    // 翻页方法
    handleCurrentChange (val) {
      this.bean.pageNo = val
      this.getData(this.bean)
    },

    // 新增、查看和修改
    handleEdit (index, row, handleType) {
      this.pushDialogVisible = true
      if (handleType !== 'add') {
        this.formData = row
        this.formData.date = this.formData.pushTime.split(' ')[0]
        this.formData.time = this.formData.pushTime.split(' ')[1]
        handleType === 'scan' ? this.pushDialogTitle = '查看推送' : this.pushDialogTitle = '编辑推送'
      } else {
        for (let i in this.formData) {
          this.formData[i] = ''
        }
        this.pushDialogTitle = '添加推送'
      }
      this.handleType = handleType
    },

    // 删除
    handleDelete (index, row) {
      let params = {
        id: row.id
      }
      this.$http.post(this.$store.state.testApi + '/admin/bops/push/delete',
        this.filterData(params)
      ).then(res => {
        if (res.data.code === '0') {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getData(this.bean)
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },

    // 关闭弹窗
    cancelDialog (val) {
      if (val) {
        this.pushDialogVisible = false
        this.getData(this.bean)
      }
    },

    // 提交表单
    submitForm (val) {
      if (val) {
        this.pushDialogVisible = false
        this.getData(this.bean)
      }
    },

    // 类型数据格式转换
    typeFormatter (row, column) {
      return row.type === '0' ? '营销' : '文章'
    },

    // 奖励格式 转换
    rewardFormatter (row, column) {
      return row.reward === '10' ? '10金币' : '无'
    }
  },
  components: {
    CommonTable,
    FormForPush
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.unpush {
  color: #e6a23c;
}
</style>
