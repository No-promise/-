<template>
<div class="content">
  <el-container>
    <div class="el-aside">
      <left-menu :appId="appId"></left-menu>
    </div>
    <el-container>
      <el-header>
        <div>
          <el-select v-model="value" size="medium" placeholder="请选择产品" @change="getAppId(value)">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              >
            </el-option>
          </el-select>
        </div>
        <div>
          <span v-if="this.$store.state.commonData.user" style="color:#fff">{{JSON.parse(this.$store.state.commonData.user).name}}</span>
          <span class="back" @click="back">退出</span>
        </div>
      </el-header>
      <el-main class="loadingContent">
        <div class="head-title">
          <div>{{this.$store.state.activeRouter.slice(1) | titleFilters}}</div>
          <!--<div v-if="this.$store.state.activeRouter.slice(1) === 'ContentCount'">
            <el-button size="mini" type="primary" @click="addContent">添加</el-button>
          </div>-->
        </div>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</div>
</template>

<script>
import LeftMenu from '@/components/common/LeftMenu'
// import FormForContent from '@/components/form/FormForContent' // 添加内容表单
import {titleFilters} from '@/filters/filters'
export default {
  name: 'MainContain',
  data () {
    return {
      options: [],
      // 产品默认值
      value: '看点头条',
      appId: '',
      // html代码
      rawHtml: '',
      innerVisible: false,
      // 添加内容表单
      formData: {},
      formDataShow: false
    }
  },
  methods: {
    // 打开内层dialog
    openPreview (val) {
      this.innerVisible = true
      this.rawHtml = val
    },

    // 退出登录
    back () {
      this.$confirm('确定要退出登录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        localStorage.clear()
        this.$router.push('/')
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },

    // 获取产品列表
    getApp () {
      this.$http.post(this.$store.state.testApi + '/admin/bops/app/list',
        this.filterData()
      ).then(res => {
        if (res.data.code === '0') {
          for (let i = 0; i < res.data.result.length; i++) {
            this.options.push({
              value: res.data.result[i].appId,
              label: res.data.result[i].appName
            })
          }
        }
      })
    },

    // 获取产品id
    getAppId (val) {
      this.appId = val
      this.$store.commit('setAppID', val)
    },

    // // 打开添加内容表单
    // addContent () {
    //   this.formDataShow = true
    // },

    // 关闭表单
    cancelDialog (val) {
      this.formDataShow = val
    }
  },
  mounted () {
    this.getApp()
    // 不存在accessToken跳转到首页
    if (!JSON.parse(this.$store.state.commonData.user)) {
      this.$router.push('/')
    }
  },
  components: {
    LeftMenu
    // FormForContent
  },
  filters: {
    titleFilters
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.content,.el-container{
  width: 100%;
  height:100%;
}
.el-header, .el-footer {
  color: #333;
  text-align: center;
  line-height: 56px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background: #333
}
.el-main {
  background-color: #E9EEF3;
  color: #333;
  line-height: 100%;
  height: 100%
}
.el-aside {
  width: 200px;
  height: 100%;
  background-color: #ffffff;
}
.el-main::-webkit-scrollbar {
  display:none
}
.head-title{
  position: relative;
  top: -4px;
  text-align: left;
  padding-bottom: 10px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: space-between;
}
.back{
  cursor: pointer;
  font-size: 14px;
  color: rgba(255, 255, 255, 1);
}

.loadingContent {
  position: relative
}
</style>
