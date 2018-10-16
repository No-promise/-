<template>
  <div class="content-box">
    <div class="table-cont">
      <h3>
        <span>兑换汇率：</span>
        <span class="proportion-value">{{'0.' + formData.proportion}}</span>
        <span class="proportion-title">/1000</span>
        <span class="edit-proportion" @click="exchangeDialogVisible = true">
          <i class="el-icon-edit-outline" style="margin-right: 3px"></i>编辑</span>
      </h3>
      <p class="tips">兑现当日凌晨开始生效</p>
      <el-dialog title="编辑兑换汇率" :visible.sync="exchangeDialogVisible" width="650px">
        <form-for-exchange :formData="formData" @cancelDialog="cancelDialog" @submitForm="submitForm">
        </form-for-exchange>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import FormForExchange from '@/components/form/FormForExchange' // 引入计数组件
export default {
  name: 'HelloWorld',
  data () {
    return {
      formData: {
        proportion: ''
      },
      bean: {},
      exchangeDialogVisible: false
    }
  },
  mounted () {
    this.$store.state.activeRouter = '/ExchangeRate'
    this.getData()
  },
  methods: {
    // 获得汇率
    getData () {
      this.$http.post(this.$store.state.testApi + '/admin/bops/proportion/get',
        this.filterData(this.bean)
      ).then(res => {
        switch (res.data.result.proportion.length) {
          case 1:
            this.formData.proportion = '00' + res.data.result.proportion
            break
          case 2:
            this.formData.proportion = '0' + res.data.result.proportion
            break
          default:
            this.formData.proportion = res.data.result.proportion
        }
      })
    },

    // 关闭弹窗
    cancelDialog (val) {
      this.getData(this.bean)
      this.exchangeDialogVisible = false
    },

    // 提交表单
    submitForm (val) {
      this.getData(this.bean)
      this.exchangeDialogVisible = false
    }
  },
  components: {
    FormForExchange
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.table-cont {
  height: 100%;
  padding: 15px 25px;
  background-color: #fff;
  box-sizing: border-box;
}

.table-cont h3 {
  padding: 25px 0 !important;
}

.proportion-title,
.proportion-value {
  font-size: 36px;
}

.edit-proportion {
  margin-left: 15px;
  color: #409eff;
  cursor: pointer;
}

.tips {
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
}
</style>
