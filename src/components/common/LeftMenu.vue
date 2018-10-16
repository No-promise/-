<template>
  <div class="contain">
    <img src="https://janesi-oss.oss-cn-shanghai.aliyuncs.com/mgr-web/images/top-left-logo.png" class="menu-logo" style="background:#333;padding:10px 20px 11px">
    <el-menu
     :default-active="activeRouter"
     class="el-menu-vertical"
     active-text-color="#409eff"
     router
     unique-opened
     >
      <el-submenu :index="item.url" :key="index" v-for="(item, index) in routeData[0]">
        <template slot="title">
          <i :class="item.icon"></i>
          <span>{{item.name}}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item :key="index2" v-for="(item2, index2) in item.childNavigation" :index="item2.url">{{item2.name}}</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>
<script>
export default {
  data () {
    return {
      activeRouter: '',
      routeData: []
    }
  },
  mounted () {
    this.getRouter()
  },
  methods: {
    // 获取当前路由
    getNavType () {
      this.activeRouter = this.$store.state.activeRouter
    },

    // 获取路由
    getRouter (bean) {
      this.$http.post(this.$store.state.testApi + '/admin/bops/app/navigation',
        this.filterData(bean)
      ).then(res => {
        if (res.data.code === '0' && res.data.result.length !== 0) {
          this.routeData.push(res.data.result)
        } else {
          this.routeData = []
        }
      })
    }
  },
  watch: {
    // 监测store.state
    '$store.state.activeRouter': 'getNavType',
    'appId': function (val, oldVal) {
      this.getRouter()
    }
  },
  props: {
    appId: String
  }
}
</script>
<style scoped>
.el-menu {
  border-right: none;
}

.iconfont {
    position: absolute;
    left: 40px;
}
</style>
