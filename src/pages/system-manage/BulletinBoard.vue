<template>
  <div class="content-box">
    <!-- 表格数据 -->
    <div class="table-cont">
      <div class="table-top">
        <div class="table-top-fl">
          <div class="table-top-title">注：公告按时间倒序展示。</div>
        </div>
        <div class="table-top-fr">
          <el-button class="table-top-fr-btn" type="primary" size="mini" @click="handleEdit('', '', 'add')">添加</el-button>
        </div>
      </div>
      <el-table :data="tableData" border highlight-current-row header-row-class-name="strong">
        <common-table :propData="propData">
          <div slot="status">
            <el-table-column prop="status" label="状态" width="120" align="center">
              <template slot-scope="scope">
                <span class="dis-inblock status-label" :class="scope.row.status == 0 ? '' : 'putAway'">{{scope.row.status | formatStatus}}</span>
              </template>
            </el-table-column>
          </div>
          <div slot="functions">
            <el-table-column label="操作" align="center" width="220">
              <template slot-scope="scope">
                <el-popover placement="top" width="300" trigger="click" v-model="scope.row.statusVisiable">
                  <el-button class="table-btn" size="mini" slot="reference" @click="scope.row.statusVisiable = true">{{scope.row.status | formatStatusTitle}}</el-button>
                  <p style="margin-bottom:15px">
                    <i class="el-icon-warning color-yellow"></i>确定要将该公告{{scope.row.status | formatStatusTitle}}吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button type="info" plain size="mini" @click="scope.row.statusVisiable = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="viewStatus(scope.$index, scope.row)">确定</el-button>
                  </div>
                </el-popover>
                <el-button class="table-btn" size="mini" @click="handleEdit(scope.$index, scope.row, 'scan')" v-if="scope.row.status === '1'">查看</el-button>
                <el-button class="table-btn" size="mini" @click="handleEdit(scope.$index, scope.row, 'edit')" v-if="scope.row.status !== '1'">编辑</el-button>
                <el-popover placement="top" width="300" trigger="click" v-model="scope.row.deleteVisible">
                  <el-button class="table-btn" size="mini" slot="reference" @click="scope.row.deleteVisible = true" v-if="scope.row.status !== '1'">删除</el-button>
                  <p style="margin-bottom:15px">
                    <i class="el-icon-warning color-yellow"></i>确定要删除本条公告吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button type="info" plain size="mini" @click="scope.row.deleteVisible = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="handleDelete(scope.$index, scope.row)">确定</el-button>
                  </div>
                </el-popover>
              </template>
            </el-table-column>
          </div>
        </common-table>
      </el-table>
      <el-dialog :visible.sync="bulletinDialogVisible" width="650px">
        <div slot="title">{{this.bulletinDialogTitle}}</div>
        <form-for-bulletin :handleType=handleType :formData=formData @cancelDialog="cancelDialog" @submitForm="submitForm">
        </form-for-bulletin>
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
import FormForBulletin from '@/components/form/FormForBulletin' // 导入表单组件
export default {
  name: 'BulletinBoard',
  data () {
    return {
      propData: [ // 表头数据
        {
          prop: 'id',
          label: '公告序号'
        },
        {
          prop: 'title',
          label: '公告标题'
        },
        {
          prop: 'showTime',
          label: '更新时间'
        }
      ],
      totalPage: 0, // 总页数
      tableData: [], // 默认表格数据
      totalSize: 0, // 翻页 总数据数
      pageSize: 10, // 翻页 每页数量
      pageNo: 1, // 翻页 当前页码
      bean: {},
      bulletinDialogVisible: false, // 弹框显隐
      bulletinDialogTitle: '添加公告', // 弹框标题
      statusVisiable: false, // 每行的上下架popover
      deleteVisible: false, // 删除确认popover
      formData: { // 表单数据
        title: '', // 公告标题
        content: '', // 公告内容
        showTime: '' // 更新时间
      },
      handleType: '', // 查看 or 编辑
      statusClass: {
        0: ['undercarriage', '已下架'],
        1: ['putAway', '上架中']
      }
    }
  },
  filters: {
    // 上下架按钮数据格式转换
    formatStatusTitle (val) {
      return val === '0' ? '上架' : '下架'
    },

    // 上架状态数据格式转换
    formatStatus (val) {
      return val === '0' ? '已下架' : '上架中'
    }
  },
  mounted () {
    this.$store.state.activeRouter = '/BulletinBoard'
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
      this.$http.post(this.$store.state.testApi + '/admin/bops/notice/list',
        this.filterData(bean)
      ).then(res => {
        this.tableData = res.data.result
        this.totalPage = parseInt(res.data.totalPage)
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
      this.bulletinDialogVisible = true
      if (handleType !== 'add') {
        this.formData = {
          title: row.title,
          content: row.content,
          showTime: row.showTime
        }
        handleType === 'scan' ? this.bulletinDialogTitle = '查看公告' : this.bulletinDialogTitle = '编辑公告'
      } else {
        this.formData = {
          title: '',
          content: '',
          showTime: ''
        }
        this.bulletinDialogTitle = '添加公告'
      }
      this.handleType = handleType
    },

    // 删除
    handleDelete (index, row) {
      let params = {
        id: row.id
      }
      this.$http.post(this.$store.state.testApi + '/admin/bops/notice/delete',
        this.filterData(params)
      ).then(res => {
        if (res.data.code === '0') {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          if (this.pageNo >= this.totalPage) { // 删除后若当前页没数据则跳到删除后所有数据的最后一页
            this.handleCurrentChange(this.totalPage)
          } else {
            this.handleCurrentChange(this.pageNo)
          }
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },

    // 关闭弹窗
    cancelDialog (val) {
      if (val) {
        this.bulletinDialogVisible = false
      }
    },

    // 上下架操作  status：0（未上架）， 1（已上架）
    viewStatus (index, row) {
      let successMsg = '下架成功'
      let param = {
        id: row.id,
        status: 0
      }
      if (row.status === '0') { // 未上架
        param.status = 1
        successMsg = '上架成功'
      }
      this.$http.post(this.$store.state.testApi + '/admin/bops/notice/status',
        this.filterData(param)
      ).then(res => {
        if (res.data.code === '0') {
          row.statusVisiable = false
          this.$message({
            type: 'success',
            message: successMsg
          })
          this.handleCurrentChange(this.pageNo)
        }
      })
    },

    // 提交表单
    submitForm (val) {
      if (val) {
        this.bulletinDialogVisible = false
        this.getData(this.bean)
      }
    }
  },
  components: {
    CommonTable,
    FormForBulletin
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-button + .el-button {
  margin-left: 0px;
}
</style>
