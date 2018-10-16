<template>
  <!-- 信息流广告 -->
  <div>
    <el-dialog title="编辑-信息流广告" :visible.sync="dialogFormEdit.show" width="40%">
      <el-form ref="formDataEdit" :model="formDataEdit" :rules="rules" label-width="90px" label-position="right">
        <div class="form-divD">
          <el-form-item label="排序选择">
            <el-select v-model="formDataEdit.orderNum" placeholder="请选择排序" size="small">
              <el-option v-for="val in sorts" :key="val.value" :label="val.label" :value="val.value">
              </el-option>
            </el-select>
            <span class="sort-tip">注：非必填 不选择默认时间倒序排列</span>
          </el-form-item>
          <el-form-item label="广告标题" v-if="formDataEdit.position !== '7' && formDataEdit.position !== '14'">
            <el-row :span="24">
              <el-col :span="18">
                <el-input v-model="formDataEdit.title" size="small" placeholder="请输入广告标题"></el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="广告标题" v-else prop="title">
            <el-row :span="24">
              <el-col :span="18">
                <el-input :disabled="dialogFormEdit.isSdk" v-model="formDataEdit.title" size="small" placeholder="请输入广告标题"></el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="上传封面" v-if="formDataEdit.layout !== 'NOP' && formDataEdit.position !== '7'">
            <image-upload :disabled="dialogFormEdit.isSdk" :reset="reset" :adLayoutData="adLayoutData" @uploadImage="getImageUrl"></image-upload>
          </el-form-item>
          <el-form-item label="跳转地址">
            <el-row :span="24">
              <el-col :span="18">
                <el-input v-model="formDataEdit.linkUrl" size="small" placeholder="请输入跳转地址"></el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="备注">
            <el-row :span="24">
              <el-col :span="18">
                <el-input v-model="formDataEdit.remark" size="small" placeholder="请输入备注"></el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="是否奖励" v-if="formDataEdit.position === '5' || formDataEdit.position === '6' || formDataEdit.position === '11' || formDataEdit.position === '12'">
            <el-row :span="24">
              <el-col :span="18">
                <el-radio @click.native.prevent="hasReward(1, 'click')" v-model="isreward" :label='1'>
                  是
                </el-radio>
                <span class="reward" v-if="isreward === 1">
                  <label>奖励金币</label>
                  <el-input-number :disabled="dialogFormEdit.isSdk" size="mini" v-model="reward" controls-position="right" :min="1" :max="50"></el-input-number>
                </span>
              </el-col>
            </el-row>
          </el-form-item>
        </div>
        <div class="dialog-footer">
          <el-button size="small" @click="cancel('formDataEdit')">取消</el-button>
          <el-button type="primary" size="small" @click="submit('formDataEdit')">保存</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import ImageUpload from '@/components/form/ImageUpload'
export default {
  name: 'FormWithSelect',
  data () {
    return {
      reset: false, // 控制图片上传是否清空
      isreward: 0, // 是否有广告奖励
      reward: 0, // 奖励金额
      formDataEdit: {},
      // 图片上传数据
      adLayoutData: {
        uploadTip: '只能上传jpg/png格式文件，文件不能超过500k，尺寸390*160',
        limitNumber: 1
      },
      sorts: [],
      rules: {
        title: [
          { max: 6, message: '福利广告标题不得超过6个字符', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
  },
  methods: {
    // 获取排序总数
    getSorts () {
      if (this.formDataEdit.osType && this.formDataEdit.position) {
        let bean = {
          osType: this.formDataEdit.osType,
          position: this.formDataEdit.position
        }
        this.$http.post(this.$store.state.testApi + '/admin/bops/adInfo/count',
          this.filterData(bean)
        ).then(res => {
          if (res.data.code === '0') {
            this.sorts = this.sortLength(Number(res.data.result) + 1)
          }
        })
      }
    },

    // 是否有广告奖励
    hasReward (rewardFlag, checkType, position) {
      if (checkType === 'edit') {
        this.isreward = rewardFlag
        this.reward = this.formDataEdit.reward
      } else if (checkType === 'click') {
        rewardFlag === this.isreward ? this.isreward = 0 : this.isreward = rewardFlag
        if (this.isreward === 0) {
          this.reward = 0
        } else {
          this.reward = this.formDataEdit.reward
        }
      }
    },

    // 过滤排序数组
    sortLength (length) {
      let arr = []
      for (let index = 1; index <= length; index++) {
        arr.push(
          {
            value: index,
            label: index
          }
        )
      }
      return arr
    },

    // 提交表单
    submit (formName) {
      this.formDataEdit.reward = this.reward
      let params = Object.assign({}, this.formDataEdit)
      if (params.position !== '5' && params.position !== '6' && params.position !== '11' && params.position !== '12') {
        params.reward = 0
      }
      let bean = [params]
      let beanData = {
        adInfoVOs: JSON.stringify(bean)
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.post(this.$store.state.testApi + '/admin/bops/adInfo/save',
            this.filterData(beanData)
          ).then(res => {
            if (res.data.code === '0') {
              this.$message({
                type: 'success',
                message: '编辑成功'
              })
              this.reset = true
              this.$emit('refresh')
              this.dialogFormEdit.show = false
              this.isreward = ''
            }
          })
        } else {
          return false
        }
      })
    },

    // 关闭弹窗
    cancel (formName) {
      this.dialogFormEdit.show = false
      // 重置表单
      // this.$refs[formName].resetFields()
    },

    // 获取图片列表
    getImageUrl (val) {
      this.formDataEdit.imageUrl = val[0]
      // console.log('imageurl' + val)
    },

    // 过滤传大图小图文字
    changeLayout () {
      if (this.formDataEdit.layout === 'small') {
        this.adLayoutData.uploadTip = '只能上传jpg/png格式文件，文件不能超过500k，尺寸390*160'
        this.adLayoutData.limitNumber = 1
      } else if (this.formDataEdit.layout === 'big') {
        this.adLayoutData.uploadTip = '只能上传jpg/png格式文件，文件不能超过500k，尺寸690*300'
        this.adLayoutData.limitNumber = 1
      } else if (this.formDataEdit.layout === 'three') {
        this.adLayoutData.uploadTip = '只能上传三张jpg/png格式文件，文件不能超过500k，尺寸390*160'
        this.adLayoutData.limitNumber = 3
      } else {
        this.adLayoutData.uploadTip = ''
        this.adLayoutData.limitNumber = 0
      }
    }
  },
  components: {
    ImageUpload
  },
  props: {
    dialogFormEdit: Object,
    rowData: String
  },
  watch: {
    'dialogFormEdit.show': function (val, oldV) {
      if (val === true) {
        this.formDataEdit = JSON.parse(this.rowData)
        if (this.formDataEdit.reward !== null && this.formDataEdit.reward !== '' && this.formDataEdit.reward !== '0') {
          this.hasReward(1, 'edit')
        } else {
          this.hasReward(0, 'edit')
        }
        this.getSorts()
        this.changeLayout()
        this.reset = false
      }
    }
  }
}
</script>

<style scoped>
.form-divD {
  margin-bottom: 30px;
}
.form-div {
  background-color: rgb(247, 247, 247);
  border: 1px dashed rgb(64, 158, 255);
}
.blue {
  color: #409eff;
  margin-right: 10px;
}
.add-class {
  font-size: 14px;
  text-align: center;
  margin: 10px 0 50px 0;
  cursor: pointer;
}
.sort-tip {
  margin-left: 10px;
  font-size: 12px;
  color: #606266;
}

.reward {
  margin-left: 40px;
}

.reward label {
  margin-right: 5px;
}
</style>
