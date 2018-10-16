<template>
  <div class="content-box">
    <!-- 表格数据 -->
    <div class="table-cont">
      <div class="table-top">
        <div class="table-top-fl">
          <div class="table-top-ico"></div>
          <div class="table-top-title">渠道更新</div>
        </div>
        <div class="table-top-fr">
          <el-button class="table-top-fr-btn" type="primary" size="mini" @click="handleEdit('', '', 'add')">添加</el-button>
        </div>
      </div>
      <el-table :data="tableData" border highlight-current-row header-row-class-name="strong">
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <div class="updateed" v-if="scope.row.status === '1' ">
              <el-button class="table-btn" size="mini" @click="handleEdit(scope.$index, scope.row, 'scan')">查看</el-button>
            </div>
            <div class="unupdate" v-else>
              <el-button class="table-btn" size="mini" @click="handleEdit(scope.$index, scope.row, 'edit')">编辑</el-button>
            </div>
          </template>
        </el-table-column>
        <common-table :propData="propData"></common-table>
      </el-table>
      <el-dialog :visible.sync="channelDialogVisible" width="650px">
        <div slot="title">{{this.channelDialogTitle}}</div>
        <form-for-channel
          :handleType=handleType
          :formData=formData
          :channelDialogVisible=channelDialogVisible
          @cancelDialog="cancelDialog"
          @submitForm="submitForm"
        >
        </form-for-channel>
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
import FormForChannel from '@/components/form/FormForChannel' // 导入表单组件
export default {
  name: 'ChannelUpdate',
  data () {
    return {
      // 表头数据
      propData: [
        {
          prop: 'channelName',
          label: '渠道名称'
        },
        {
          prop: 'channelCode',
          label: '渠道编号'
        },
        {
          prop: 'appUrl',
          label: '渠道地址'
        },
        {
          prop: 'appVersion',
          label: '版本号'
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
      channelDialogVisible: false,
      channelDialogTitle: '添加渠道',
      // 表单数据
      formData: {
        channelName: '', // 渠道名
        channelCode: '', // 渠道编号
        appUrl: '', // 渠道地址
        appVersion: '', // 版本号
        id: ''
      },
      // 查看 or 编辑
      handleType: ''
    }
  },
  mounted () {
    this.$store.state.activeRouter = '/ChannelUpdate'
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
      this.$http.post(this.$store.state.testApi + '/admin/bops/app_channel/list',
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
      this.channelDialogVisible = true
      if (handleType !== 'add') {
        this.formData = {
          channelName: row.channelName,
          channelCode: row.channelCode,
          appUrl: row.appUrl,
          appVersion: row.appVersion
        }
        handleType === 'scan' ? this.channelDialogTitle = '查看渠道' : this.channelDialogTitle = '编辑渠道'
      } else {
        this.channelDialogTitle = '添加渠道'
      }
      this.handleType = handleType
    },

    // 关闭弹窗
    cancelDialog (val) {
      if (val) {
        this.channelDialogVisible = false
      }
    },

    // 提交表单
    submitForm (val) {
      if (val) {
        this.channelDialogVisible = false
        this.getData(this.bean)
      } else {
        this.channelDialogVisible = false
      }
    }
  },
  components: {
    CommonTable,
    FormForChannel
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
