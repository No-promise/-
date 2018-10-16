<template>
  <!-- 信息流广告 -->
  <div>
    <el-dialog title="添加-信息流广告" :visible.sync="dialogFormVisible.show" width="40%">
      <el-form ref="formData" :model="formData" :rules="rules" label-width="90px" label-position="right">
        <el-form-item label="系统选择" prop="osType">
          <el-select v-model="formData.osType" placeholder="请选择系统" size="small" @change="getSorts">
            <el-option v-for="item in channelTypes" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 广告选择 -->
        <el-row :span="24">
          <el-col :span="12">
            <el-form-item label="广告选择" prop="position">
              <el-select v-model="formData.position" placeholder="请选择广告" size="small" @change="getSorts">
                <el-option v-for="item in adTypes" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="formData.position === '5' || formData.position === '6' || formData.position === '11' || formData.position === '12'">
            <el-form-item label="广告类型" prop="layout">
              <el-select v-model="formData.layout" placeholder="请选择广告类型" size="small" @change="changeLayout">
                <el-option v-for="item in layouts" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div :class="index === formData.formDataArr.length - 1 ? 'form-div' : 'form-divD'" :key="index" v-for="(item, index) in formData.formDataArr">
          <el-form-item label="排序选择">
            <el-select v-model="item.orderNum" placeholder="请选择排序" size="small">
              <el-option v-for="val in item.sorts" :key="val.value" :label="val.label" :value="val.value">
              </el-option>
            </el-select>
            <span class="sort-tip">注：非必填 不选择默认时间倒序排列</span>
          </el-form-item>
          <el-form-item label="广告标题" v-if="formData.position !== '7' && formData.position !== '14'">
            <el-row :span="24">
              <el-col :span="18">
                <el-input v-model="item.title" size="small" placeholder="请输入广告标题"></el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="广告标题" v-else :key="'formDataArr.' + index + '.title'" :prop="'formDataArr.' + index + '.title'" :rules="{ max: 6, message: '福利广告标题不得超过6个字符', trigger: 'blur' }">
            <el-row :span="24">
              <el-col :span="18">
                <el-input v-model="item.title" size="small" placeholder="请输入广告标题"></el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="上传封面" v-if="formData.position !== '7' && formData.layout !== 'NOP'">
            <image-upload :reset="reset" :index="index" :adLayoutData="adLayoutData" @uploadImage="getImageUrl"></image-upload>
          </el-form-item>
          <el-form-item label="跳转地址">
            <el-row :span="24">
              <el-col :span="18">
                <el-input v-model="item.linkUrl" size="small" placeholder="请输入跳转地址"></el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="备注">
            <el-row :span="24">
              <el-col :span="18">
                <el-input v-model="item.remark" size="small" placeholder="请输入备注"></el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="是否奖励" v-if="formData.position === '5' || formData.position === '6' || formData.position === '11' || formData.position === '12'">
            <el-row :span="24">
              <el-col :span="18">
                <el-radio @click.native.prevent="hasReward(1, index)" v-model="item.isreward" :label='1'>
                  是
                </el-radio>
                <span class="reward" v-if="item.isreward === 1">
                  <label>奖励金币</label>
                  <el-input-number size="mini" v-model="item.reward" controls-position="right" :min="1" :max="50"></el-input-number>
                </span>
              </el-col>
            </el-row>
          </el-form-item>
        </div>
        <div class="add-class blue" @click="add">
          <i v-if="formData.osType && formData.position" class="el-icon-plus blue"></i>
          <span v-if="formData.osType && formData.position">添加</span>
        </div>
        <div class="dialog-footer">
          <el-button size="small" @click="dialogFormVisible.show = false">取消</el-button>
          <el-button type="primary" size="small" @click="submit('formData')">保存</el-button>
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
      isreward: 0, // 是否有奖励
      formData: {
        osType: '', // 系统选择
        position: '', // 广告选择
        layout: '', // 广告类型
        formDataArr: [
          {
            orderNum: '',
            title: '',
            imageUrl: '',
            linkUrl: '',
            remark: '',
            reward: 0,
            isreward: 0,
            sorts: []
          }
        ]
      },
      rules: {
        osType: [
          { required: true, message: '请选择系统', trigger: 'change' }
        ],
        position: [
          { required: true, message: '请选择广告', trigger: 'change' }
        ],
        layout: [
          { required: false, message: '请选择广告类型', trigger: 'change' }
        ]
      },
      channelTypes: [
        {
          value: 'IOS',
          label: 'IOS'
        },
        {
          value: 'ANDROID',
          label: '安卓'
        },
        {
          value: 'ALL',
          label: '全部'
        }
      ],
      layouts: [
        {
          value: 'IMAGE',
          label: '大图'
        },
        {
          value: 'LARP',
          label: '小图'
        },
        {
          value: 'TWB3P',
          label: '三图'
        },
        {
          value: 'NOP',
          label: '纯文字'
        }
      ],
      // 图片上传数据
      adLayoutData: {
        uploadTip: '只能上传jpg/png格式文件，文件不能超过500k，尺寸390*160',
        limitNumber: 1
      },
      // 广告选择数组
      adTypes: []
    }
  },
  mounted () {
    this.getAdTypes()
  },
  methods: {
    // 获取广告选择初始数据
    getAdTypes () {
      this.$http.post(this.$store.state.testApi + '/admin/bops/adInfo/position',
        this.filterData()
      ).then(res => {
        if (res.data.code === '0') {
          for (let index = 0; index < res.data.result.length; index++) {
            this.adTypes.push(
              {
                value: res.data.result[index].position,
                label: res.data.result[index].name
              }
            )
          }
        }
      })
    },

    // 是否有广告奖励
    hasReward (rewardFlag, arrIndex, position) {
      let dataArr = this.formData.formDataArr[arrIndex]
      rewardFlag === dataArr.isreward ? dataArr.isreward = 0 : dataArr.isreward = rewardFlag
      if (dataArr.isreward === 0) {
        dataArr.reward = 0
      }
    },

    // 获取排序总数
    getSorts () {
      if (this.formData.position !== '5' || this.formData.position !== '6' || this.formData.position !== '11' || this.formData.position !== '12') {
        this.formData.layout = ''
      }
      this.changeLayout()
      if (this.formData.osType && this.formData.position) {
        let bean = {
          osType: this.formData.osType,
          position: this.formData.position
        }
        this.$http.post(this.$store.state.testApi + '/admin/bops/adInfo/count',
          this.filterData(bean)
        ).then(res => {
          if (res.data.code === '0') {
            this.formData.formDataArr[0].sorts = this.sortLength(Number(res.data.result) + 1)
          }
        })
      }
    },

    // 添加多图
    add () {
      if (this.formData.formDataArr[0].sorts.length) {
        this.formData.formDataArr.push(
          {
            orderNum: '',
            title: '',
            imageUrl: '',
            linkUrl: '',
            remark: '',
            reward: 0,
            isreward: 0,
            sorts: this.sortLength(this.formData.formDataArr[0].sorts.length + this.formData.formDataArr.length)
          }
        )
      } else {
        this.$message({
          message: '系统异常无法添加',
          type: 'error'
        })
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
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let bean = this.formData.formDataArr
          for (let index = 0; index < bean.length; index++) {
            bean[index].osType = this.formData.osType
            bean[index].position = this.formData.position
            bean[index].layout = this.formData.layout
          }
          let beanData = {
            adInfoVOs: JSON.stringify(bean)
          }
          this.$http.post(this.$store.state.testApi + '/admin/bops/adInfo/save',
            this.filterData(beanData)
          ).then(res => {
            if (res.data.code === '0') {
              this.$message({
                type: 'success',
                message: '添加成功'
              })
              this.$emit('refresh')
              this.reset = true
              this.dialogFormVisible.show = false
              this.formData.formDataArr = [
                {
                  orderNum: '',
                  title: '',
                  imageUrl: '',
                  linkUrl: '',
                  remark: '',
                  reward: 0,
                  sorts: []
                }
              ]
            }
          })
        } else {
          return false
        }
      })
    },

    // 获取图片列表
    getImageUrl (val) {
      this.formData.formDataArr[val[1]].imageUrl = val[0]
    },

    // 过滤传大图小图文字
    changeLayout () {
      if (this.formData.layout === 'LARP') {
        this.adLayoutData.uploadTip = '只能上传jpg/png格式文件，文件不能超过500k，尺寸224*160'
        this.adLayoutData.limitNumber = 1
      } else if (this.formData.layout === 'IMAGE') {
        this.adLayoutData.uploadTip = '只能上传jpg/png格式文件，文件不能超过500k，尺寸690*384'
        this.adLayoutData.limitNumber = 1
      } else if (this.formData.layout === 'TWB3P') {
        this.adLayoutData.uploadTip = '只能上传三张jpg/png格式文件，文件不能超过500k，尺寸224*160'
        this.adLayoutData.limitNumber = 3
      } else if (this.formData.position === '1' || this.formData.position === '2') {
        this.adLayoutData.uploadTip = '只能上传jpg/png格式文件，文件不能超过500k，尺寸140*160'
        this.adLayoutData.limitNumber = 1
      } else if (this.formData.position === '4') {
        this.adLayoutData.uploadTip = '只能上传jpg/png格式文件，文件不能超过500k，尺寸448*244'
        this.adLayoutData.limitNumber = 1
      } else if (this.formData.position === '7' || this.formData.position === '9') {
        this.adLayoutData.uploadTip = '只能上传jpg/png格式文件，文件不能超过500k，尺寸560*684，小图32*36'
        this.adLayoutData.limitNumber = 1
      } else if (this.formData.position === '8') {
        this.adLayoutData.uploadTip = '只能上传jpg/png格式文件，文件不能超过500k，尺寸750*120'
        this.adLayoutData.limitNumber = 1
      } else if (this.formData.position === '10') {
        this.adLayoutData.uploadTip = '只能上传jpg/png格式文件，文件不能超过500k，IOS6个尺寸750*1334，1242*2208，1125*2436，640*1136，640*960，320*480.安卓720*1280'
        this.adLayoutData.limitNumber = 1
      } else if (this.formData.position === '3') {
        this.adLayoutData.uploadTip = '只能上传jpg/png格式文件，文件不能超过500k，尺寸636*156'
        this.adLayoutData.limitNumber = 1
      } else if (this.formData.position === '14') {
        this.adLayoutData.uploadTip = '只能上传jpg/png格式文件，文件不能超过500k，尺寸36*38'
        this.adLayoutData.limitNumber = 1
      }
    }
  },
  components: {
    ImageUpload
  },
  props: {
    dialogFormVisible: Object
  },
  watch: {
    'dialogFormVisible.show': function (val, oldV) {
      if (val === true) {
        this.reset = false
        this.formData.formDataArr[0].isreward = 0
        this.formData.formDataArr[0].reward = 0
      }
    }
  }
}
</script>

<style scoped>
.form-divD {
  border-bottom: 1px solid #e9e9e9;
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

.el-input-number--mini {
  width: 125px;
}
</style>
