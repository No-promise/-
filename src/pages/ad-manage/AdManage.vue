<template>
  <div class="content-box">
    <!-- 表格数据 -->
    <div class="table-cont">
      <div class="table-top">
        <div class="table-top-fl">
          <!-- 系统选择 -->
          <span class="table-top-fl-span">系统选择</span>
          <el-select v-model="value" placeholder="请选择" size="mini" @change="selectSys(value)">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <!-- 广告选择 -->
          <span class="table-top-fl-spanR">广告选择</span>
          <el-select v-model="adTypeValue" placeholder="请选择" size="mini" @change="selectAdType(adTypeValue)">
            <el-option
              v-for="item in adTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="table-top-fr">
          <el-input size="mini" v-model="remark" placeholder="请输入链接地址或备注信息" clearable></el-input>
          <el-button size="mini" class="table-top-fr-btn" type="primary" @click="search()">搜索</el-button>
          <el-button size="mini" class="table-top-fr-btn" type="primary" @click="add()">添加</el-button>
        </div>
      </div>
      <el-table :data="tableData" border highlight-current-row header-row-class-name="strong">
        <!-- 序号 -->
        <el-table-column
          prop="orderNum"
          label="序号"
          align="center">
        </el-table-column>
        <!-- 图片imageUrls -->
        <el-table-column
          label="图片"
          align="center"
          width="200">
          <template slot-scope="scope">
            <img :key="index" v-for="(item, index) in scope.row.imageUrls" :src="item" width="50" height="50" />
          </template>
        </el-table-column>
        <!-- 跳转地址 -->
        <el-table-column
          prop="title"
          label="广告标题"
          align="center">
        </el-table-column>
        <!-- 跳转地址 -->
        <el-table-column
          prop="linkUrl"
          label="跳转地址"
          align="center">
        </el-table-column>
        <!-- 备注 -->
        <el-table-column
          prop="remark"
          label="备注"
          align="center">
        </el-table-column>
        <!-- 系统 -->
        <el-table-column
          prop="osType"
          label="系统"
          align="center"
          :formatter="osTypeFilter">
        </el-table-column>
         <el-table-column
          prop="reward"
          label="奖励"
          align="center"
          :formatter="rewardFilter">
        </el-table-column>
        <!-- 广告位置 -->
        <el-table-column
          prop="position"
          label="广告位置"
          align="center"
          :formatter="positionFilter">
        </el-table-column>
        <!-- 状态 -->
        <el-table-column
          label="状态"
          align="center"
          >
          <template slot-scope="scope">
            <span :class="scope.row.status == '1' ? 'green' : ''">{{scope.row.status | statusFilter}}</span>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column
          label="操作"
          align="center"
          width="250"
        >
          <template slot-scope="scope">
            <!-- 编辑 -->
            <el-button
              size="mini"
              class="table-btn"
              @click="edit(scope.$index, scope.row)">编辑</el-button>
            <!-- 上下架 -->
            <el-button
            size="mini"
            slot="reference"
            class="table-btn"
            @click="unlock(scope.$index, scope.row)"
            >{{scope.row.status | lockFilter}}</el-button>
            <!-- 删除 -->
            <el-popover placement="top" width="300" trigger="click" v-model="scope.row.deleteVisible">
              <el-button class="table-btn" style="margin-left: 10px" size="mini" slot="reference" @click="open(scope.$index, scope.row)" v-if="scope.row.remark !== '广点通SDK自动生成' && scope.row.remark !== 'Immobi SDK自动生成'" :disabled="scope.row.status === '1'">删除</el-button>
              <p style="margin-bottom:15px"><i class="el-icon-warning color-yellow"></i>确定要删除本条广告吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button type="info" plain size="mini" @click="cancel(scope.$index, scope.row)">取消</el-button>
                <el-button type="primary" size="mini" @click="remove(scope.$index, scope.row)">确定</el-button>
              </div>
            </el-popover>
          </template>
        </el-table-column>
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
    <!-- 添加广告组件 -->
    <form-with-select @refresh="getData(bean)" :dialogFormVisible="dialogFormVisible"></form-with-select>
    <!-- 编辑广告组件 -->
    <form-with-edit @refresh="getData(bean)" :dialogFormEdit="dialogFormEdit" :rowData="rowData"></form-with-edit>
  </div>
</template>

<script>
import FormWithSelect from '@/components/form/FormWithSelect' // 导入添加广告组件
import FormWithEdit from '@/components/form/FormWithEdit' // 导入编辑广告组件
export default {
  name: 'AdManage',
  data () {
    return {
      rowData: '',
      dialogFormVisible: {
        show: false
      },
      dialogFormEdit: {
        show: false
      },
      // 系统选择筛选
      options: [
        {
          value: 'IOS',
          label: 'IOS'
        },
        {
          value: 'ANDROID',
          label: '安卓'
        },
        {
          value: '1',
          label: '全部'
        }
      ],
      value: '',
      adTypeValue: '',
      adTypes: [],
      // 默认表格数据
      tableData: [],
      // 翻页的数据
      totalSize: 0, // 总数量
      pageSize: 10, // 每页数量
      pageNo: 1, // 页码
      bean: {},
      remark: '', // 搜索关键字
      deleteVisible: false // 删除popover
    }
  },
  mounted () {
    this.$store.state.activeRouter = '/AdManage'
    // 搜索请求数据重置
    this.bean = {
      pageSize: this.pageSize,
      pageNo: this.pageNo
    }
    // 获取统计数据
    this.getData(this.bean)
    this.getAdTypes()
  },
  methods: {
    // 系统选择筛选
    selectSys (val) {
      if (val === '1' && this.bean.osType) {
        delete this.bean.osType
      } else {
        this.bean.osType = val
      }
      if (this.position) {
        this.bean.position = parseInt(this.adTypeValue)
      }
      this.bean.pageNo = 1
      this.getData(this.bean)
    },

    // 广告选择筛选
    selectAdType (val) {
      if (this.osType) {
        this.bean.osType = this.osType
      }
      this.bean.pageNo = 1
      this.bean.position = val
      this.getData(this.bean)
    },

    // 过滤位置
    positionFilter (row) {
      if (row.position === '1') {
        return '首页-悬浮广告'
      } else if (row.position === '2') {
        return '视频-悬浮广告'
      } else if (row.position === '3') {
        return '宝箱-领取金币广告'
      } else if (row.position === '4') {
        return '提现-提现广告'
      } else if (row.position === '5') {
        return '文章-信息流广告'
      } else if (row.position === '6') {
        return '视屏-信息流广告'
      } else if (row.position === '7') {
        return '我的-福利广告'
      } else if (row.position === '8') {
        return '我的-banner广告'
      } else if (row.position === '9') {
        return '我的-弹窗广告'
      } else if (row.position === '10') {
        return '启动-启动页广告'
      } else if (row.position === '11') {
        return '文章详情-信息流广告'
      } else if (row.position === '12') {
        return '视屏详情-信息流广告'
      } else if (row.position === '14') {
        return '福利-任务广告'
      }
    },

    // 过滤系统
    osTypeFilter (row) {
      if (row.osType === 'ANDROID') {
        return '安卓'
      } else if (row.osType === 'ALL') {
        return '全部'
      } else if (row.osType === 'IOS') {
        return 'IOS'
      }
    },

    // 过滤奖励
    rewardFilter (row) {
      if (row.reward === '0' || row.reward === null) {
        return '无'
      } else {
        return row.reward + '金币'
      }
    },

    // 获取广告选择初始数据
    getAdTypes () {
      this.$http.post(this.$store.state.testApi + '/admin/bops/adInfo/position',
        this.filterData()
      ).then(res => {
        if (res.data.code === '0') {
          var positonArr = res.data.result
          for (let i in positonArr) {
            this.adTypes.push({
              type: positonArr[i].type,
              value: positonArr[i].position,
              label: positonArr[i].name
            })
          }
          var compare = (objL, objR) => {
            var valL = objL.type
            var valR = objR.type
            if (valL < valR) {
              return -1
            } else if (valL > valR) {
              return 1
            } else {
              return 0
            }
          }
          this.adTypes.sort(compare)
        }
      })
    },

    // 获取统计数据
    getData (bean) {
      this.$http.post(this.$store.state.testApi + '/admin/bops/adInfo/list',
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
      if (this.osType) {
        this.bean.osType = this.osType
      }
      if (this.adTypeValue) {
        this.bean.position = parseInt(this.adTypeValue)
      }
      if (this.remark) {
        this.bean.remark = this.remark
      }
      this.bean.pageNo = val
      this.getData(this.bean)
    },

    // 搜索方法
    search () {
      this.handleCurrentChange(this.pageNo)
    },

    // 添加广告
    add () {
      this.dialogFormVisible.show = true
    },

    // 编辑单条数据
    edit (index, row) {
      this.rowData = JSON.stringify(row)
      this.dialogFormEdit.show = true
    },

    // 删除单条数据
    remove (index, row) {
      this.$http.post(this.$store.state.testApi + '/admin/bops/adInfo/delete',
        this.filterData({id: row.id})
      ).then(res => {
        if (res.data.code === '0') {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.getData(this.bean)
        }
      })
    },

    open (index, row) {
      row.deleteVisible = true
    },

    cancel (index, row) {
      row.deleteVisible = false
    },

    // 上下架接口
    unlock (index, row) {
      let bean = {
        id: row.id,
        status: row.status === '1' ? '0' : '1'
      }
      this.$http.post(this.$store.state.testApi + '/admin/bops/adInfo/status',
        this.filterData(bean)
      ).then(res => {
        if (res.data.code === '0') {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.getData(this.bean)
        }
      })
    }
  },
  components: {
    FormWithSelect,
    FormWithEdit
  },
  filters: {
    // 锁定过滤器
    lockFilter (value) {
      return value === '0' ? '上架' : '下架'
    },

    // 过滤表格上下架描述
    statusFilter (value) {
      return value === '1' ? '上架中' : '已下架'
    }
  },
  watch: {
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
.table-top-fl-span{
  margin-right: 5px;
  font-size: 14px;
}
.table-top-fl-spanR{
  margin-right: 5px;
  font-size: 14px;
  margin-left: 50px;
}
.green{
  color: #67C23A;
}
</style>
