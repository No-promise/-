<template>
  <!-- 添加推送 -->
  <el-form
    label-width="90px"
    :model="formData"
    label-position="right"
    :rules="rules"
    ref="formData"
    class="dialog-form push-dialog"
  >
    <el-form-item label="推送类型" prop="type">
      <el-select v-model="formData.type" placeholder="请选择推送类型" size="small" :disabled="handleType === 'scan' ? true : false">
        <el-option v-for="item in pushTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="标题" prop="title">
      <el-input v-model="formData.title" size="small" :disabled="handleType === 'scan' ? true : false"></el-input>
    </el-form-item>
    <el-form-item label="描述" prop="detail">
      <el-input v-model="formData.detail" size="small" :disabled="handleType === 'scan' ? true : false"></el-input>
    </el-form-item>
    <el-form-item label="推送时间">
      <div class="time-bar inline-block">
        <el-form-item prop="date">
          <el-date-picker
            v-model="date"
            placeholder="选择日期"
            type="date"
            value-format="yyyy-MM-dd"
            size="small"
            @change="getDate"
            style="width: 95%;margin-right:5%" :disabled="handleType === 'scan' ? true : false"
            :picker-options="pickerOptions"
          >
           </el-date-picker>
        </el-form-item>
      </div>
      <div class="time-bar inline-block">
        <el-form-item prop="time">
          <el-time-picker
            v-model="time"
            placeholder="选择时间"
            value-format="HH:mm:ss"
            size="small"
            @change="getTime"
            style="width: 95%;margin-left:5%"
            :disabled="handleType === 'scan' ? true : false"
          ></el-time-picker>
        </el-form-item>
      </div>
    </el-form-item>
    <el-form-item label="跳转地址" prop="extra">
      <el-input v-model="formData.extra" size="small" :disabled="handleType === 'scan' ? true : false"></el-input>
    </el-form-item>
    <el-form-item label="推送奖励">
      <template>
        <el-radio @click.native.prevent="pushReward(10)" v-model="formData.reward" :label="10" :disabled="handleType === 'scan' ? true : false">阅读+10金币</el-radio>
      </template>
    </el-form-item>
    <div class="dialog-footer">
      <el-button size="small" @click="cancel('formData')">{{handleType !== 'scan' ? '取消' : '关闭'}}</el-button>
      <el-button type="primary" size="small" @click="submit('formData')" v-if="handleType !== 'scan'">保存</el-button>
    </div>
  </el-form>
</template>

<script>
export default {
  name: 'FormForPush',
  props: ['formData', 'handleType'],
  data () {
    return {
      pushFormData: '',
      pushTypes: [
        {
          value: '0',
          label: '营销'
        },
        {
          value: '1',
          label: '文章'
        }
      ],
      date: '',
      time: '',
      rules: {
        type: [
          { required: true, message: '请选择推送类型', trigger: 'change' }
        ],
        title: [
          { required: true, message: '请填写推送标题', trigger: 'blur' }
        ],
        detail: [
          { required: true, message: '请填写推送描述', trigger: 'blur' }
        ],
        date: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ],
        time: [
          { required: true, message: '请选择时间', trigger: 'change' }
        ],
        extra: [
          { required: true, message: '请填写跳转地址', trigger: 'blur' }
        ]
      },
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    }
  },
  mounted () {
    this.date = this.formData.date ? this.formData.date : this.formData.pushTime.split(' ')[0] || new Date()
    this.time = this.formData.time ? this.formData.time : this.formData.pushTime.split(' ')[1] || new Date()
    this.formData.reward = parseInt(this.formData.reward) || 0
  },
  watch: {
    formData: {
      handler (newValue, oldValue) {
        this.date = newValue.date ? newValue.date : newValue.pushTime.split(' ')[0] || new Date()
        this.time = newValue.time ? newValue.time : newValue.pushTime.split(' ')[1] || new Date()
        this.formData.reward = parseInt(this.formData.reward) || 0
      },
      deep: true
    }
  },
  methods: {
    // 关闭弹窗
    cancel (ruleForm) {
      this.$emit('cancelDialog', true)
      this.$refs[ruleForm].resetFields()
    },

    // 提交回传表单信息给父组件
    submit (ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          let params = this.formData
          params.pushTime = this.date + ' ' + this.time
          if (params.extra.substr(0, 7).toLowerCase() !== 'http://' && params.extra.indexOf('.') !== -1) {
            params.extra = 'http://' + params.extra
          }
          delete params.date
          delete params.time
          this.$http.post(this.$store.state.testApi + '/admin/bops/push/save',
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

    // 选择是否发放推送奖励
    pushReward (rewardFlag) {
      rewardFlag === this.formData.reward ? this.formData.reward = 0 : this.formData.reward = rewardFlag
    },

    // 获得日期
    getDate (val) {
      this.formData.date = val
      this.date = val
    },

    // 获得时间
    getTime (val) {
      this.formData.time = val
      this.time = val
    }
  }
}
</script>

<style scoped>
.dialog-form {
  margin-bottom: 80px
}

.push-dialog {
  padding-right: 15px
}
</style>
