<template>
  <div class="content-box">
    <div class="table-cont">
      <!-- 搜索条件框 -->
      <div class="table-top">
        <div class="table-top-fl">
          <el-button size="mini" @click="batchRecommend">批量推荐</el-button>
        </div>
        <div class="table-top-fr">
          <!-- 选择频道 -->
          <el-select class="select" v-model="conentValue" placeholder="内容类型" size="mini" @change="viewFormChange">
            <el-option v-for="item in conentOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <!-- 选择类别 -->
          <el-select class="select" v-model="typeValue" placeholder="选择类别" size="mini" @change="viewFormChange" style="width:150px;margin:0 5px">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-input placeholder="请输入频道" v-model="channelValue" size="mini" class="search-input" @change="viewFormChange" style="width:150px;margin:0 5px"></el-input>
          <!-- 选择来源 -->
          <!-- <el-select class="select" v-model="sourceValue" placeholder="选择来源" size="mini" @change="viewFormChange">
            <el-option v-for="item in sourceOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select> -->
          <el-input placeholder="请输入来源" v-model="sourceValue" size="mini" class="search-input" @change="viewFormChange" style="width:150px;margin-right: 5px"></el-input>
          <!-- 时间段筛选组件 -->
          <search-time @getTime="getTime" style="margin-left:5px"></search-time>
          <el-input placeholder="请输入ID/标题" v-model="searchKey" size="mini" class="search-input" @change="viewFormChange">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
            <el-select class="search-select" v-model="select" slot="prepend" placeholder="请选择">
              <el-option label="搜索作者" value="0"></el-option>
              <el-option label="搜索ID/标题" value="1"></el-option>
            </el-select>
          </el-input>
          <el-button size="mini" class="table-top-fr-btn" type="primary" @click="search()">搜索</el-button>
          <el-button size="mini" class="table-top-fr-btn" type="primary" @click="addContent()">添加</el-button>
        </div>
      </div>
      <!-- 表格数据 -->
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" @selection-change="handleSelectionChange" border highlight-current-row header-row-class-name="strong">
        <el-table-column type="selection" width="55" :selectable="selectable">
        </el-table-column>
        <!-- 文章标题 -->
        <el-table-column label="文章标题" align="center" width="200">
          <template slot-scope="scope">
            <span class="perfect-tag" style="margin-left: 5px" v-if="scope.row.isRecommend === '1'">推荐</span>
            <span>{{scope.row.title}}</span>
          </template>
        </el-table-column>
        <!-- 作者信息 -->
        <el-table-column label="作者Id/作者名" align="center" width="180">
          <template slot-scope="scope">
            <div class="clearfix" style="text-align:left">
              <label class="author-label">作者Id：</label>
              <span class="author-value">{{scope.row.authorId ? scope.row.authorId : '暂无Id'}}</span>
            </div>
            <div class="clearfix" style="text-align:left">
              <label class="author-label">作者名：</label>
              <span class="author-value">{{scope.row.authorName ? scope.row.authorName : '佚名'}}</span>
            </div>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" align="center" width="270">
          <template slot-scope="scope">
            <!-- <el-button size="mini" class="table-btn" @click="see(scope.$index, scope.row)">查看</el-button> -->
            <el-popover placement="top" width="300" trigger="click" v-model="scope.row.recommendPopoverVisible">
              <el-button size="mini" class="table-btn" slot="reference" @click="scope.row.recommendPopoverVisible = true">{{scope.row.isRecommend === '0' ? '推荐' : '取消推荐'}}</el-button>
              <p style="margin-bottom: 15px">
                <i class="el-icon-warning color-yellow"></i>你确定{{scope.row.isRecommend === '0' ? '推荐' : '取消推荐'}}吗？</p>
              <div style="text-align: right">
                <el-button type="info" plain size="mini" @click="scope.row.recommendPopoverVisible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="recommend(scope.$index, scope.row)">{{scope.row.isRecommend === '0' ? '推荐' : '取消推荐'}}</el-button>
              </div>
            </el-popover>
            <el-button size="mini" class="table-btn copy-btn" :data-clipboard-text="tableData[scope.$index].linkUrl" @click="copyLink(scope.$index, scope.row)">复制链接
            </el-button>
            <!-- 下拉菜单 -->
            <el-dropdown>
              <el-button class="table-btn" size="mini">更多
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="see(scope.$index, scope.row)">查看</el-dropdown-item>
                <el-dropdown-item @click.native="edit(scope.$index, scope.row)">编辑</el-dropdown-item>
                <el-dropdown-item @click.native="remove(scope.$index, scope.row)">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <common-table :propData="propData"></common-table>
      </el-table>
      <!-- 翻页 -->
      <div class="page">
        <el-pagination background layout="prev, pager, next" @current-change="handleCurrentChange" :disabled="paginationFlag">
        </el-pagination>
      </div>
      <!-- 查看内容 -->
      <el-dialog class="content-dialog" :visible.sync="dialogVisible" width="375px">
        <iframe class="contentFrames" :data="dialogFrameUrl" :src="dialogFrameUrl"></iframe>
      </el-dialog>
      <!-- 编辑内容 -->
      <el-dialog :title="title" :visible.sync="formDataShow" width="60%">
        <!-- 添加内容表单 -->
        <form-for-content :control="control" :operation="operation" :formData="formData" @cancelDialog="cancelDialog" @openPreview="openPreview"></form-for-content>
        <el-dialog width="375px" :title="this.dialogTitle" :visible.sync="innerVisible" append-to-body>
          <div v-html="this.rawHtml"></div>
        </el-dialog>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import SearchTime from '@/components/common/SearchTime' // 公共时间搜索组件
import FormForContent from '@/components/form/FormForContent' // 添加内容表单
import CommonTable from '@/components/table/CommonTable' // 导入公用表格组件
import Clipboard from 'clipboard' // 导入剪贴板组件
export default {
  name: 'ContentCount',
  data () {
    return {
      propData: [ // 表头数据
        {
          prop: 'itemId',
          label: '文章id'
        },
        {
          prop: 'source',
          label: '来源'
        },
        {
          prop: 'channel',
          label: '所属频道'
        },
        {
          prop: 'itemType',
          label: '类别',
          formatter: this.formatItemType
        },
        {
          prop: 'janesiTime',
          label: '获取时间'
        },
        {
          prop: 'scan',
          label: '浏览次数'
        },
        {
          prop: 'scan',
          label: '所属内容'
        }
      ],
      control: false,
      // html代码
      title: '',
      rawHtml: '',
      dialogTitle: '',
      innerVisible: false,
      // 添加内容表单
      formData: {},
      formDataShow: false,
      tableData: [], // 默认表格数据
      pageSize: 10,
      pageNo: 1,
      bean: {},
      searchKey: '', // 搜索关键字
      typeOptions: [ // 选择类别
        {
          value: 'ARTICLE',
          label: '文章'
        }, {
          value: 'AUDIO',
          label: '音频'
        }, {
          value: 'VIDEO',
          label: '视频'
        }, {
          value: 'IMAGES',
          label: '图集'
        }, {
          value: 'AD',
          label: '广告'
        }, {
          value: 'VAD',
          label: '视频广告'
        }, {
          value: '',
          label: '全部'
        }],
      typeValue: '',
      // 选择频道
      channelOptions: [{
        value: '频道1',
        label: '频道1'
      }, {
        value: '频道2',
        label: '频道2'
      }, {
        value: '',
        label: '全部'
      }],
      // 频道Value
      channelValue: '',
      // 选择来源
      sourceOptions: [{
        value: '来源1',
        label: '来源1'
      }, {
        value: '来源2',
        label: '来源2'
      }, {
        value: '',
        label: '全部'
      }
      ],
      // 内容类型Value
      conentValue: '',
      // 选择内容类型
      conentOptions: [
        {
          value: '全部内容',
          label: '全部内容'
        }, {
          value: '精品内容',
          label: '精品内容'
        }, {
          value: '平台内容',
          label: '平台内容'
        }, {
          value: '普通内容',
          label: '普通内容'
        }
      ],
      sourceValue: '', // 来源Value
      sDate: '',
      eDate: '',
      select: '0',
      operation: true,
      dialogVisible: false,
      recommendPopoverVisible: false, // 推荐（取消推荐）确认浮层显隐
      dialogFrameUrl: '', // 内容iframe的url
      batchItemItems: [], // 批量选中的内容
      paginationFlag: false // 无数据时禁用分页
    }
  },
  watch: {
    'formDataShow': function (val, old) {
      if (old) {
        this.control = true
      } else {
        this.control = false
      }
    },
    'dialogVisible': function (val, old) {
      console.log(val)
      if (!val) {
        this.dialogFrameUrl = ''
      }
    }
  },
  methods: {
    // 打开内层dialog
    openPreview (val) {
      // console.log(val)
      this.innerVisible = true
      this.rawHtml = val.body
      this.dialogTitle = val.title
    },

    // 关闭表单
    cancelDialog (val) {
      this.formDataShow = val
      this.getData(this.bean)
    },
    // 获取统计数据
    getData (bean) {
      this.$http.post(this.$store.state.testApi + '/admin/bops/content_manage/list',
        this.filterData(bean)
      ).then(res => {
        // console.log(res)
        if (res.data.code === '0') {
          this.tableData = res.data.result !== null ? res.data.result : []
          this.pageSize = parseInt(res.data.pageSize)
          if (res.data.result.length < parseInt(res.data.pageSize)) {
            this.paginationFlag = true
          } else {
            this.paginationFlag = false
          }
        }
      })
    },

    // 切换页码方法
    handleCurrentChange (val) {
      this.search(val)
      this.pageNo = val
    },

    // 从子组件获取时间段筛选数据
    getTime (val) {
      this.sDate = val !== null ? val[0].split(' ')[0] + ' 00:00:00' : '' // 开始时间
      this.eDate = val !== null ? val[1].split(' ')[0] + ' 23:59:59' : ''// 结束时间
      this.search()
    },

    // 搜索标题或者id
    search (pageNo) {
      let params = {
        type: this.typeValue,
        channel: this.channelValue,
        source: this.sourceValue,
        keyWord: this.searchKey,
        sDate: this.sDate,
        eDate: this.eDate,
        pageSize: 10,
        pageNo: 1
      }
      if (pageNo) {
        params.pageNo = pageNo
      }
      if (this.select === '0') {
        params.authorId = this.searchKey
      } else if (this.select === '1') {
        params.key = this.searchKey
      }
      this.getData(params)
    },

    // 选择表格行
    handleSelectionChange (val) {
      this.batchItemItems = []
      for (var i in val) {
        var paramObj = {
          itemId: val[i].itemId,
          recommendSourceEnum: 'BASE'
        }
        this.batchItemItems.push(paramObj)
      }
    },

    // 禁止已推荐行被选择
    selectable (val) {
      if (val.isRecommend !== '0') {
        return false
      } else {
        return true
      }
    },

    // 输出搜索表单变更情况
    viewFormChange () {
      let params = {
        type: this.typeValue,
        channel: this.channelValue,
        source: this.sourceValue,
        sDate: this.sDate,
        eDate: this.eDate,
        authorId: this.searchKey,
        key: this.searchKey,
        pageSize: 10,
        pageNo: 1
      }
      params.pageNo = 1
    },

    // 查看内容
    see (index, row) {
      this.dialogVisible = !this.dialogVisible
      this.dialogFrameUrl = row.linkUrl
    },

    // 添加内容
    addContent () {
      this.formData = {}
      this.title = '添加-内容'
      this.formDataShow = true
      this.operation = true
    },

    // 编辑内容
    edit (index, row) {
      this.title = '编辑-内容'
      console.log(row)
      this.formData = {
        itemId: row.itemId,
        title: row.title,
        channelId: row.channelId,
        channel: row.channel,
        authorName: row.authorName,
        contentType: row.contentType,
        createType: row.createType,
        body: row.body,
        images: row.images,
        isRecommend: row.isRecommend
      }
      this.formDataShow = true
      this.operation = false
    },

    // 删除单条数据
    remove (index, row) {
      this.$http.post(this.$store.state.testApi + '/admin/bops/content_manage/delet_content',
        this.filterData({ itemIds: row.itemId })
      ).then(res => {
        if (res.data.code === '0') {
          // this.$message({
          //   type: 'success',
          //   message: '操作成功'
          // })
          this.getData(this.bean)
        }
      })
    },

    // 推荐&&取消推荐
    recommend (index, row) {
      // let param = {
      //   itemIds: row.itemId,
      //   recommendSourceEnum: 'BASE'
      // }
      // let params = {
      //   recommendReqVOS: JSON.stringify(param)
      // }
      let url = row.isRecommend === '0' ? '/admin/bops/content_manage/recommend_content' : '/admin/bops/content_manage/not_recommend_content'
      let message = row.isRecommend === '0' ? '推荐成功！' : '取消成功！'
      this.$http.post(this.$store.state.testApi + url,
        this.filterData({ itemIds: row.itemId })
      ).then(res => {
        if (res.data.code === '0') {
          this.$message({
            type: 'success',
            message: message
          })
          this.bean.pageNo = this.pageNo
          this.getData(this.bean)
        } else {
          this.$message.error(res.msg)
        }
      })
    },

    // 复制链接
    copyLink (index, row) {
      var clipboard = new Clipboard('.copy-btn')
      let $this = this
      clipboard.on('success', function (e) {
        $this.$message({
          type: 'success',
          message: '复制成功！'
        })
        e.clearSelection()
      })

      clipboard.on('error', function (e) {
        $this.$message({
          type: 'success',
          message: '复制失败！'
        })
      })
    },

    // 表格 类别数据格式转换
    formatItemType (row, column) {
      let itemTypeValue = ''
      switch (row.itemType) {
        case 'ARTICLE':
          itemTypeValue = '文章'
          break
        case 'VIDEO':
          itemTypeValue = '视频'
          break
        case 'AUDIO':
          itemTypeValue = '音频'
          break
        case 'IMAGES':
          itemTypeValue = '图集'
          break
        case 'AD':
          itemTypeValue = '广告'
          break
        default:
          itemTypeValue = '视频广告'
      }
      return itemTypeValue
    },

    // 批量推荐
    batchRecommend () {
      let params = {
        recommendReqVOS: JSON.stringify(this.batchItemItems)
      }
      this.$http.post(this.$store.state.testApi + '/admin/bops/content_manage/recommend_content',
        this.filterData(params)
      ).then(res => {
        if (res.data.code === '0') {
          this.$message({
            type: 'success',
            message: '批量推荐成功'
          })
          this.bean.pageNo = this.pageNo
          this.getData(this.bean)
        } else if (res.data.code === '7000') {
          this.$message.error(res.data.msg)
        } else {
          this.$message.warning('请选择未推荐的内容重试！')
        }
      })
    }
  },
  mounted () {
    this.$store.state.activeRouter = '/ContentCount'
    // 搜索请求数据重置
    this.bean = {
      pageSize: this.pageSize,
      pageNo: this.pageNo
    }
    // 获取统计数据
    this.getData(this.bean)
  },
  components: {
    SearchTime,
    CommonTable,
    FormForContent
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.table-cont {
  padding: 0 25px;
  background-color: #fff;
}
.table-top {
  padding: 16px 0 8px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.table-top-fl {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.table-top-fr {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.table-top-fr-btn {
  margin-left: 8px;
}
.page {
  padding: 25px 0 40px 0;
  text-align: right;
}
.select {
  margin-right: 8px;
}
.search-input {
  margin-left: 8px;
  width: 260px;
}
.search-select .el-input-group__prepend {
  background-color: #fff;
}
.search-select {
  width: 130px;
}
.perfect-tag {
  color: #f56c6c;
  border: 1px solid #f56c6c;
  border-radius: 3px;
  background: #fef0f0;
  padding: 1px 5px;
  font-size: 12px;
  vertical-align: top;
  cursor: default;
  /* 禁止文字被鼠标选中  */
  -moz-user-select: -moz-none;
  -moz-user-select: none;
  -o-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.contentFrames {
  width: 100%;
  height: calc(100% + 16px);
  border: 0;
}
.el-dialog img {
  width: 100%;
}
</style>
