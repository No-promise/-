<template>
  <div class="content-box">
    <!-- 表格数据 -->
    <div class="table-cont">
      <div class="table-top">
        <div class="table-top-fl">
          <div class="top-radio">
            <el-radio-group v-model="osRadio" size="mini" @change="changeList">
              <el-radio-button label="IOS"></el-radio-button>
              <el-radio-button label="安卓"></el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <div class="table-top-fr">
          <el-button class="table-top-fr-btn" type="primary" size="mini" @click="handleEdit('', '', 'add')">添加</el-button>
        </div>
      </div>
      <el-table :data="tableData" border highlight-current-row header-row-class-name="strong">
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
        <common-table :propData="propData"></common-table>
      </el-table>
      <el-dialog :visible.sync="pushDialogVisible" width="650px">
        <div slot="title">{{this.pushDialogTitle}}</div>
        <form-for-push
          :handleType=handleType
          :formData=formData
          @cancelDialog="cancelDialog"
          @submitForm="submitForm"
        >
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
import FormForPush from '@/components/form/FormForVersion' // 导入表单组件
export default {
  name: 'AppPush',
  data () {
    return {
      // 系统类别
      osRadio: 'IOS',
      // 表头数据
      propData: [
        {
          prop: 'updateTime',
          label: '更新时间'
        },
        {
          prop: 'version',
          label: '版本'
        },
        {
          prop: 'osType',
          label: '系统',
          formatter: this.formatOsType
        },
        {
          prop: 'updateTips',
          label: '更新内容'
        },
        {
          prop: 'gmtCreate',
          label: '创建时间'
        },
        {
          prop: 'updateLevel',
          label: '是否强制更新',
          formatter: this.formatterLevel
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
      pushDialogTitle: '添加版本',
      // 表单数据
      formData: {
        osType: 'IOS', // 推送类型
        version: '', // 版本号
        updateTips: '', // 更新内容
        updateTime: '', // 更新时间
        updateLevel: '1', // 更新等级
        date: '', // 推送日期
        time: '', // 推送时间
        reward: '0' // 是否奖励金币
      },
      // 查看 or 编辑
      handleType: ''
    }
  },
  mounted () {
    this.$store.state.activeRouter = '/VersionPush'
    // 搜索请求数据重置
    this.bean = {
      pageSize: this.pageSize,
      pageNo: this.pageNo,
      osType: 'IOS'
    }
    // 获取统计数据
    this.getData(this.bean)
  },
  methods: {
    // 获取数据
    getData (bean) {
      this.$http.post(this.$store.state.testApi + '/admin/bops/app_version/list',
        this.filterData(bean)
      ).then(res => {
        this.tableData = res.data.result
        this.totalSize = parseInt(res.data.totalSize)
        this.pageNo = parseInt(res.data.pageNo)
      })
    },

    // 切换系统类型
    changeList (val) {
      val === '安卓' ? this.bean.osType = 'ANDROID' : this.bean.osType = 'IOS'
      this.bean.pageNo = '1'
      this.getData(this.bean)
    },

    // 转换系统类型数据格式
    formatOsType (row, column) { // 表格status
      return row.osType === 'IOS' ? 'IOS' : '安卓'
    },

    // 转换更新数等级据格式
    formatterLevel (row, column) { // 表格status
      return row.updateLevel === '2' ? '强制更新' : row.updateLevel === '1' ? '建议更新' : '不更新'
    },

    // 翻页方法
    handleCurrentChange (val) {
      this.bean.pageNo = val
      this.bean.osType = this.osRadio
      this.getData(this.bean)
    },

    // 新增、查看和修改
    handleEdit (index, row, handleType) {
      this.pushDialogVisible = true
      if (handleType !== 'add') {
        this.formData = row
        this.formData.date = this.formData.updateTime.split(' ')[0]
        this.formData.time = this.formData.updateTime.split(' ')[1]
        handleType === 'scan' ? this.pushDialogTitle = '查看版本' : this.pushDialogTitle = '编辑版本'
      } else {
        this.formData = {
          osType: '',
          version: '',
          updateTips: '',
          updateTime: '',
          updateLevel: '1',
          date: '',
          time: ''
        }
        this.pushDialogTitle = '添加版本'
      }
      this.handleType = handleType
    },

    // 删除
    handleDelete (index, row) { // 暂无接口
      let params = {
        id: row.id
      }
      this.$http.post(this.$store.state.testApi + '/admin/bops/app_version/delete',
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
