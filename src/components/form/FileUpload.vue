<template>
  <!-- 暂时废弃 -->
  <div>
    <el-upload
      class="upload clearfix"
      accept=".apk"
      :action="uploadUrl"
      :data="uploadParams"
      :on-preview="OnPreview"
      :on-progress="Onprogress"
      :beforeRemove="BeforeRemove"
      :on-remove="OnRemove"
      :on-change="OnChange"
      :on-success="OnSuccess"
      :on-error="OnError"
      :on-exceed="Onexceed"
      :file-list="filesUrl"
      :auto-upload="false"
      :limit="channelUpdateData.limitNumber"
      :disabled="handleType === 'scan' ? true : false"
      ref="uploadFile"
    >
      <el-button size="small" type="primary" :disabled="onUploading">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">{{channelUpdateData.uploadTip}}</div>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: 'FileUpload',
  props: {
    channelUpdateData: Object,
    handleType: String,
    channelDialogVisible: Boolean,
    onUploading: Boolean
  },
  data () {
    return {
      // uploadUrl: 'http://mgr.janesi.com/admin/bops/file/aliyun/upload', // 文件上传地址
      uploadUrl: 'http://118.25.10.151:8800/admin/bops/file/aliyun/upload', // 测试
      // uploadUrl: 'http://10.10.10.105:8800/admin/bops/file/aliyun/upload', // 陈铁成本地
      filesUrl: [],
      filesUrlHttp: '',
      filesName: '',
      uploadParams: {
        basePath: 'android'
      }
    }
  },
  watch: {
    'channelDialogVisible': function (val, oldV) {
      if (val === false && this.handleType === 'add') {
        this.resetFile()
      } else if (val === false && this.handleType !== 'add') {
        this.$refs.uploadFile.clearFiles()
      }
    }
  },
  methods: {
    // 点击文件列表触发
    OnPreview (file) {
      // console.log('OnPreview:' + file)
    },

    // // 上传前触发
    // BeforeUpload (file) {
    //   let name = file.name.split('.')[0]
    //   let suffix = file.name.split('.')[1]
    //   var reg = /[\u4e00-\u9fa5]/
    //   if (suffix !== 'apk' || reg.test(name)) {
    //     this.$alert('请上传英文命名的Apk文件！', '提示', {
    //       confirmButtonText: '确定',
    //       type: 'warning'
    //     }).then(() => {
    //       return false
    //     })
    //   }
    // },

    // 改变后触发
    async OnChange (file, fileList) {
      let name = file.name.split('.')[0]
      let suffix = file.name.split('.')[1]
      let reg = /[\u4e00-\u9fa5]/
      let isSubmit = true
      if (suffix !== 'apk' || reg.test(name)) {
        isSubmit = await this.$alert('请上传英文命名的Apk文件！', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          return false
        })
      }
      if (isSubmit) {
        this.$refs.uploadFile.submit()
        let uploadParam = {}
        if (this.filesUrlHttp === '') {
          uploadParam = {
            uploadFile: [],
            disBtn: true
          }
        } else {
          uploadParam = {
            uploadFile: [this.filesUrlHttp],
            disBtn: false
          }
        }
        this.$emit('uploadFile', uploadParam)
      } else {
        this.OnRemove()
      }
    },

    // 删除前触发
    BeforeRemove (file, fileList) {
      return this.$confirm('确定移除' + file.name + '？')
    },

    // 删除成功时触发
    OnRemove (file, fileList) {
      this.resetFile()
      let uploadParam = {
        uploadFile: [this.filesUrlHttp],
        disBtn: false
      }
      this.$emit('uploadFile', uploadParam)
    },

    // 上传时触发
    Onprogress (event, file, fileList) {
      if (event.percent === 100) {
        event.percent = 99
      }
    },

    // 上传成功时触发
    OnSuccess (response, file, fileList) {
      this.$message({
        type: 'success',
        message: '上传成功!'
      })
      this.filesUrlHttp = response.result[0]
      this.filesName = file.name
      this.filesUrl = fileList
      let uploadParam = {
        uploadFile: [this.filesUrlHttp],
        disBtn: false
      }
      this.$emit('uploadFile', uploadParam)
      if (this.handleType === 'add') {
        this.reset = false
      }
    },

    // 报错时触发
    OnError (err, file, fileList) {
      this.$message({
        message: err.msg ? err.msg : '上传失败，请重试或联系管理员',
        type: 'error'
      })
    },

    // 文件超出上限时触发
    Onexceed (files, fileList) {
      this.$confirm('您已经上传了Apk文件,需要先删除已上传的文件才能重新上传。请是否需要删除当前文件？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.OnRemove(files, fileList)
        this.$message({
          type: 'success',
          message: '删除成功，请重新上传!'
        })
      })
    },

    // 重置
    resetFile () {
      this.filesUrlHttp = ''
      this.filesName = ''
      this.filesUrl = []
      this.$refs.uploadFile.clearFiles()
    }
  }
}
</script>

<style>
.el-upload-list .el-upload-list__item {
  width: 200px;
  border: 1px solid #ddd;
  height: 35px;
  padding: 0;
}

.el-upload-list .el-progress-bar__outer {
  width: 94%;
  margin: 0 auto;
}

.el-upload-list .el-upload-list__item-name {
  line-height: 33px !important;
  margin-right: 30px;
}

.el-upload-list__item .el-progress__text {
  position: absolute;
  right: 5px !important;
  top: -9px !important;
}

.el-upload-list__item-status-label {
  top: 4px !important;
}

.el-upload-list__item .el-icon-close {
  top: 9px !important;
}

.el-upload {
  float: left;
  margin-right: 15px;
}

.el-upload__tip {
  line-height: 40px;
  margin: 0 !important;
}

.el-upload-list__item .el-icon-close-tip {
  /* display: none; */
  top: 9px !important;
  right: -115px !important;
}
</style>
