<template>
  <!-- 添加渠道 -->
  <el-form
    label-width="90px"
    :model="bulletinFormData"
    label-position="right"
    :rules="rules"
    ref="bulletinFormData"
    class="dialog-form bulletin-dialog"
  >
    <el-form-item label="公告标题" prop="title">
      <el-input v-model="bulletinFormData.title" size="small" :disabled="handleType === 'scan' ? true : false"></el-input>
    </el-form-item>
    <el-form-item label="公告内容" prop="content">
      <el-input resize="none" type="textarea" v-model="bulletinFormData.content" :disabled="handleType === 'scan' ? true : false"></el-input>
    </el-form-item>
    <el-form-item label="更新时间" prop="showTime">
      <div class="time-bar inline-block">
        <el-date-picker
          v-model="bulletinFormData.showTime"
          placeholder="选择日期"
          :default-value="dateNow"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          size="small"
          @change="getUpdateTime"
          style="width: 95%;margin-right:5%"
          :disabled="handleType === 'scan' ? true : false"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </div>
      <span class="tips">注：若不选时间则按照本公告添加时间进行展示</span>
    </el-form-item>
    <div class="dialog-footer">
      <el-button size="small" @click="cancel('bulletinFormData')">{{handleType !== 'scan' ? '取消' : '关闭'}}</el-button>
      <el-button type="primary" size="small" @click="submit('bulletinFormData')" v-if="handleType !== 'scan'">保存</el-button>
    </div>
  </el-form>
</template>

<script>
export default {
  name: 'FormForBulletin',
  props: ['formData', 'handleType'],
  data () {
    return {
      rules: {
        title: [
          { required: true, message: '请填写公告标题', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请填写公告内容', trigger: 'blur' }
        ]
      },
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      bulletinFormData: { // 不操作原数据
        title: '',
        content: '',
        showTime: ''
      },
      dateNow: new Date()
    }
  },
  mounted () {
    this.bulletinFormData = this.formData
  },
  watch: {
    'handleType': function (newType, oldType) {
      if (newType === 'add') {
        this.bulletinFormData = {
          title: '',
          content: '',
          showTime: ''
        }
      }
    },
    'formData': function (newData, oldData) {
      this.bulletinFormData = this.formData
    }
  },
  methods: {
    // 关闭弹窗
    cancel (ruleForm) {
      this.$emit('cancelDialog', true)
      // this.$refs[ruleForm].resetFields()
    },

    // 提交数据 提示父组件关闭弹窗
    submit (ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          let params = this.bulletinFormData
          if (params.showTime === '' || typeof (params.showTime) !== 'string') {
            let now = new Date()
            let unPickShowTime = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds())).toISOString()
            params.showTime = unPickShowTime.slice(0, 10) + ' ' + unPickShowTime.slice(11, 19)
          }
          this.$http.post(this.$store.state.testApi + '/admin/bops/notice/save_notice',
            this.filterData(params)
          ).then(res => {
            if (res.data.code === '0') {
              this.$emit('submitForm', true)
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

    // 获得日期
    getUpdateTime (val) {
      this.bulletinFormData.showTime = val
    }
  }
}
</script>

<style scoped>
.dialog-form {
  margin-bottom: 80px
}

.bulletin-dialog {
  padding-right: 15px
}

.tips {
  font-size: 12px;
  color: #999;
}

.el-textarea__inner {
  height: 100px
}
</style>
