<template>
  <!-- 版本推送 -->
  <el-form label-width="90px" :model="formData" label-position="right" :rules="rules" ref="formData" class="dialog-form version-dialog">
    <el-form-item label="推送类型" prop="osType">
      <el-select class="form-select" v-model="formData.osType" placeholder="请选择推送类型" size="small">
        <el-option v-for="item in osTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="版本号" prop="version">
      <el-input v-model="formData.version" size="small"></el-input>
    </el-form-item>
    <el-form-item label="更新内容" prop="updateTips">
      <el-input type="textarea" v-model="formData.updateTips" size="small"></el-input>
    </el-form-item>
    <el-form-item label="更新时间">
      <div class="time-bar inline-block">
        <el-form-item prop="date">
          <el-date-picker v-model="date" placeholder="选择日期" type="date" value-format="yyyy-MM-dd" size="small" @change="getDate" style="width: 95%;margin-right:5%" :disabled="handleType === 'scan' ? true : false" :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
      </div>
      <div class="time-bar inline-block">
        <el-form-item prop="time">
          <el-time-picker v-model="time" placeholder="选择时间" value-format="HH:mm:ss" size="small" @change="getTime" style="width: 95%;margin-left:5%" :disabled="handleType === 'scan' ? true : false">
          </el-time-picker>
        </el-form-item>
      </div>
    </el-form-item>
    <el-form-item label="强制更新" prop="updateLevel">
      <el-select class="form-select" v-model="formData.updateLevel" placeholder="请选择更新重要度" size="small">
        <el-option v-for="item in updateLevels" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
       <el-radio style="margin-left:30px" @click.native.prevent="updateVersion(0)" v-model="isUpdate" :label='0' v-if="formData.osType !== 'IOS'">强制更新版本号</el-radio>
    </el-form-item>
    <div class="dialog-footer">
      <el-button size="small" @click="cancel('formData')">取消</el-button>
      <el-button type="primary" size="small" @click="submit('formData')">保存</el-button>
    </div>
  </el-form>
</template>

<script>

export default {
  name: 'FormWithSelect',
  props: ['formData', 'handleType'],
  data () {
    var validateVersion = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入版本号，格式示例：1.1.0'))
      }
      if (value.match(/\d+(\.\d+){2}/) === null) {
        callback(new Error('请输入正确的版本号,示例：1.1.0'))
      } else {
        this.formData.version = value.match(/\d\.\d\.\d/)[0]
        callback()
      }
    }
    return {
      osTypes: [
        {
          value: 'IOS',
          label: 'IOS'
        },
        {
          value: 'ANDROID',
          label: '安卓'
        }
      ],
      updateLevels: [
        {
          value: '0',
          label: '不更新'
        },
        {
          value: '1',
          label: '建议更新'
        },
        {
          value: '2',
          label: '强制更新'
        }
      ],
      date: '',
      time: '',
      rules: {
        osType: [
          { required: true, message: '请选择推送类型', trigger: 'change' }
        ],
        version: [
          { required: true, validator: validateVersion, trigger: 'blur' }
        ],
        updateTips: [
          { required: true, message: '请填写更新内容', trigger: 'blur' }
        ],
        date: [
          { required: true, message: '请选择更新日期', trigger: 'change' }
        ],
        time: [
          { required: true, message: '请选择更新时间', trigger: 'change' }
        ],
        updateLevel: [
          { required: true, message: '请选择更新重要度', trigger: 'change' }
        ]
      },
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      isUpdate: 1
    }
  },
  mounted () {
    this.date = this.formData.date ? this.formData.date : this.formData.updateTime.split(' ')[0]
    this.time = this.formData.time ? this.formData.time : this.formData.updateTime.split(' ')[1]
  },
  watch: {
    formData: {
      handler (newValue, oldValue) {
        this.date = newValue.date ? newValue.date : newValue.updateTime.split(' ')[0]
        this.time = newValue.time ? newValue.time : newValue.updateTime.split(' ')[1]
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
          params.updateTime = this.date + ' ' + this.time
          delete params.date
          delete params.time
          params.update = this.isUpdate
          this.$http.post(this.$store.state.testApi + '/admin/bops/app_version/save',
            this.filterData(params)
          ).then(res => {
            if (res.data.code === '0') {
              this.$emit('submitForm', true)
              this.$refs[ruleForm].resetFields()
              this.isUpdate = 1
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
    getDate (val) {
      this.formData.date = val
      this.date = val
    },

    // 获得时间
    getTime (val) {
      this.formData.time = val
      this.time = val
    },

    // 是否更新版本号 0：更新  1：不更新
    updateVersion (updateFlag) {
      updateFlag === this.isUpdate ? this.isUpdate = 1 : this.isUpdate = updateFlag
    }
  }
}
</script>

<style scoped>
.dialog-form {
  margin-bottom: 80px;
}

.push-dialog {
  padding-right: 15px;
}

.form-select {
  width: 240px;
}
</style>
