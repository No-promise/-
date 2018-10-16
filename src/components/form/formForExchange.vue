<template>
  <!-- 添加推送 -->
  <el-form
    label-width="90px"
    :model="childFormData"
    label-position="right"
    class="dialog-form exchange-dialog"
  >
    <el-form-item label="兑换汇率">
      <span class="proportion-head">0.</span>
      <el-input-number class="proportion-body" v-model="childFormData.very" controls-position="right" :min="0" :max="9"></el-input-number>
      <el-input-number class="proportion-body" v-model="childFormData.percentile" controls-position="right" :min="0" :max="9"></el-input-number>
      <el-input-number class="proportion-body" v-model="childFormData.thousandth" controls-position="right" :min="0" :max="9"></el-input-number>
    </el-form-item>
    <div class="dialog-footer">
      <el-button size="small" @click="cancel('formData')">取消</el-button>
      <el-button type="primary" size="small" @click="submit('formData')">保存</el-button>
    </div>
  </el-form>
</template>

<script>
export default {
  name: 'FormForExchange',
  props: ['formData'],
  data () {
    return {
      childFormData: {
        very: '0',
        percentile: '0',
        thousandth: '0'
      },
      numCount: ''
    }
  },
  mounted () {
    this.getNums()
  },
  methods: {
    // 获取十分位、百分位、千分位
    getNums () {
      this.childFormData.very = this.formData.proportion.slice(0, 1)
      this.childFormData.percentile = this.formData.proportion.slice(1, 2)
      this.childFormData.thousandth = this.formData.proportion.slice(2, 3)
      this.numCount = parseInt(this.childFormData.very + this.childFormData.percentile + this.childFormData.thousandth)
    },
    // 关闭弹窗
    cancel (ruleForm) {
      this.$emit('cancelDialog', true)
      this.getNums()
    },

    // 提交回传表单信息给父组件
    submit (ruleForm) {
      if (this.numCount === parseInt(0)) {
        this.$message.error('汇率不得为0，请重新填写。')
        return false
      } else {
        this.formData.proportion = this.childFormData.very.toString() + this.childFormData.percentile.toString() + this.childFormData.thousandth.toString()
        let params = this.formData
        this.$http.post(this.$store.state.testApi + '/admin/bops/proportion/save',
          this.filterData(params)
        ).then(res => {
          if (res.data.code === '0') {
            this.$emit('submitForm', true)
          } else {
            this.$message.error(res.data.msg)
          }
        })
      }
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

.proportion-head {
  font-size: 36px
}

.proportion-body {
  width: 90px;
}
</style>
