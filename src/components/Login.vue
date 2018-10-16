<template>
  <div id="full">
    <div class="login">
      <div class="logo-box">
        <img src="https://janesi-oss.oss-cn-shanghai.aliyuncs.com/mgr-web/images/login-logo.png">
        <p class="login-title">简思运营后台</p>
      </div>
      <el-form :model="ruleForm" status-icon class="ruleForm">
        <el-form-item prop="username">
          <el-input
            @keydown.enter.native="onLogin()"
            class="input-opacity"
            type="text"
            v-model="ruleForm.username"
            placeholder="请输入用户名"
            prefix-icon="iconfont icon-userName"
            :maxlength="11"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="pass">
          <el-input
            @keydown.enter.native="onLogin()"
            class="input-opacity"
            type="password"
            v-model="ruleForm.pass"
            placeholder="请输入密码"
            prefix-icon="iconfont icon-password"
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="login-primary" type="primary" @click="onLogin()">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="foot">
      <p class="copy">© 2018 简思科技运营后台</p>
    </div>
    <div class="cover"></div>
  </div>
</template>
<script>

export default {
  data () {
    return {
      ruleForm: {
        username: '',
        pass: ''
      }
    }
  },
  methods: {
    // 登录接口
    onLogin () {
      let bean = {
        'userName': this.ruleForm.username,
        'passwd': this.ruleForm.pass
      }
      this.$store.dispatch('userLogin', bean)
    }
  }
}
</script>

<style scoped>
.login {
  width: 360px;
  height: 400px;
  border-radius: 2px;
  background-color: #ffffff;
  box-shadow: 0 2px 16px 0 rgba(42, 95, 150, 0.19);
  padding: 15px;
}

.logo {
  font-size: 48px;
  text-align: center;
  margin-top: 15%;
  color: #fff;
}

.logo-box {
  text-align: center;
}

.logo-box img {
  width: 80px;
  height: auto;
  margin-bottom: 15px;
}

.logo-box p {
  font-family: PingFangSC, Microsoft Yahei, sans-serif;
  font-size: 24px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: 1;
  letter-spacing: normal;
}

.ruleForm i {
  font-size: 16px;
  color: #d9d9d9;
}

.foot {
  text-align: center;
  /*margin-top: 120px;*/
  /*margin-left: 80px;*/
}

.errorBox {
  color: #f56c6c;
  font-size: 14px;
  text-align: center;
}

.copy {
  color: #fff;
}

.cover {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(1, 25, 50, 0.78);
  z-index: -1;
}
#full {
  height: 100%;
  width: 100%;
  background: url('https://janesi-oss.oss-cn-shanghai.aliyuncs.com/mgr-web/images/login-bg.png') no-repeat;
  background-size: cover;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1333;
}
</style>
