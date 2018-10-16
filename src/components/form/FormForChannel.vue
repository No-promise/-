<template>
  <!-- 添加渠道 -->
  <el-form label-width="90px" :model="channelFormData" label-position="right" :rules="rules" ref="channelFormData" class="dialog-form channel-dialog">
    <el-form-item label="渠道名称" prop="channelName">
      <el-input v-model="channelFormData.channelName" size="small" :disabled="handleType === 'scan' ? true : false"></el-input>
    </el-form-item>
    <el-form-item label="渠道编号" prop="channelCode">
      <el-input v-model="channelFormData.channelCode" size="small" :disabled="handleType === 'scan' ? true : false"></el-input>
    </el-form-item>
    <el-form-item label="渠道地址" prop="appUrl">
      <el-input v-model="channelFormData.appUrl" size="small" :disabled="handleType === 'scan' ? true : false"></el-input>
    </el-form-item>
    <el-form-item label="版本号" prop="appVersion">
      <el-input v-model="channelFormData.appVersion" size="small" :disabled="handleType === 'scan' ? true : false"></el-input>
    </el-form-item>
    <div class="dialog-footer">
      <el-button size="small" @click="cancel('channelFormData')" :disabled="onUploading">{{handleType !== 'scan' ? '取消' : '关闭'}}</el-button>
      <el-button type="primary" size="small" @click="submit('channelFormData')" :disabled="onUploading" v-if="handleType !== 'scan'">保存</el-button>
    </div>
  </el-form>
</template>

<script>
import FileUpload from '@/components/form/FileUpload'
export default {
  name: 'FormForChannel',
  props: ['formData', 'handleType', 'channelDialogVisible'],
  data () {
    return {
      rules: {
        channelName: [
          { required: true, message: '请填写渠道名称', trigger: 'blur' }
        ],
        channelCode: [
          { required: true, message: '请填写渠道编号', trigger: 'blur' }
        ],
        appUrl: [
          { required: true, message: '请上传渠道地址', trigger: 'blur' }
        ],
        appVersion: [
          { required: true, message: '请填写版本号', trigger: 'blur' }
        ]
      },
      channelFormData: { // 不操作原数据
        channelName: '', // 渠道名
        channelCode: '', // 渠道编号
        appUrl: '', // 渠道地址
        appVersion: '' // 版本号
      },
      onUploading: false // 上传过程中禁用按钮
    }
  },
  mounted () {
    this.channelFormData = this.formData
  },
  watch: {
    'channelDialogVisible': function (newVisible, oldVisible) {
      this.reset = false
    },
    'handleType': function (newType, oldType) {
      if (newType === 'add') {
        this.resetFormData()
      }
    },
    'formData': function (newData, oldData) {
      this.channelFormData = this.formData
    }
  },
  methods: {
    // 关闭弹窗
    cancel (ruleForm) {
      this.$emit('cancelDialog', true)
      if (this.handleType === 'add') {
        this.reset = true
        this.$refs[ruleForm].resetFields()
        this.resetFormData()
      }
    },
    // 提交数据 提示父组件关闭弹窗
    submit (ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          let params = this.channelFormData
          this.$http.post(this.$store.state.testApi + '/admin/bops/app_channel/save_app_channel',
            this.filterData(params)
          ).then(res => {
            if (res.data.code === '0') {
              this.$emit('submitForm', true)
              this.reset = true
              this.$refs[ruleForm].resetFields()
            } else {
              this.$message.error(res.data.msg)
            }
          })
        } else {
          return false
        }
      })
    },

    // 重置表单
    resetFormData () {
      if (this.handleType === 'add') {
        this.channelFormData = {
          channelName: '',
          channelCode: '',
          appUrl: '',
          appVersion: ''
        }
      }
    }
  },
  components: {
    FileUpload
  }
}
</script>

<style scoped>
.dialog-form {
  margin-bottom: 80px;
}

.channel-dialog {
  padding-right: 15px;
}

.dis-none {
  display: none;
}
</style>
