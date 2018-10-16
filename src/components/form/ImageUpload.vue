<template>
<div>
  <el-upload
    class="upload"
    :action="uploadUrl"
    :on-preview="OnPreview"
    :on-remove="OnRemove"
    :on-success="OnSuccess"
    :on-error="OnError"
    :file-list="imageUrl"
    :limit="adLayoutData.limitNumber"
    list-type="picture"
    :disabled="sdkFlag"
    >
    <el-button size="small" type="primary" :disabled="sdkFlag">点击上传</el-button>
    <div slot="tip" class="el-upload__tip">{{adLayoutData.uploadTip}}</div>
  </el-upload>
</div>
</template>

<script>
export default {
  name: 'ImageUpload',
  props: {
    adLayoutData: Object,
    index: Number,
    reset: Boolean,
    sdkFlag: Boolean
  },
  data () {
    return {
      imageUrl: [],
      imageUrlHttp: '',
      uploadUrl: 'http://mgr.janesi.com/admin/bops/file/upload' // 测试
    }
  },
  watch: {
    'reset': function (val, oldV) {
      if (val === true) {
        this.imageUrl = []
      }
    }
  },
  methods: {
    OnPreview (file) {
      // console.log(file)
    },
    OnRemove (file, fileList) {
      if (fileList.length > 0) {
        let imgUrls = ''
        for (var i = 0; i < fileList.length; i++) {
          imgUrls = imgUrls + ',' + fileList[i].response.result[0]
        }
        this.imageUrlHttp = imgUrls.slice(1)
      } else {
        this.imageUrlHttp = ''
      }
      this.$emit('uploadImage', [this.imageUrlHttp, this.index])
    },
    OnSuccess (response, file, fileList) {
      if (fileList.length === 1) {
        this.imageUrlHttp = response.result[0]
      } else if (fileList.length > 1) {
        this.imageUrlHttp = this.imageUrlHttp + ',' + response.result[0]
        // var imgUrls = fileList[0].url
        // for (var i = 1; i < fileList.length; i++) {
        //   imgUrls = imgUrls + ',' + fileList[i].url
        // }
        // this.imageUrlHttp = imgUrls
      }
      this.imageUrl = fileList
      this.$emit('uploadImage', [this.imageUrlHttp, this.index])
    },
    OnError (err, file, fileList) {
      this.$message({
        message: err.msg ? err.msg : '上传失败，请重试或联系管理员',
        type: 'error'
      })
    }
  }
}
</script>

<style>
.el-upload-list .el-upload-list__item {
  width: 200px;
  height: 56px;
  padding: 10px 10px 10px 50px;
  float: left;
  margin-right: 15px;
}

.el-upload-list .el-upload-list__item img {
  width: 36px;
  height: 36px;
  margin-left: -45px;
}

.el-upload-list .el-upload-list__item-name {
  line-height: 33px !important;
  margin-right: 20px;
}

.el-upload-list--picture .el-upload-list__item-name {
  margin-top: 0;
}

.el-upload-list--picture .el-upload-list__item-name i {
  font-size: 35px;
  line-height: 1;
  position: absolute;
  left: 9px;
  height: auto;
  top: 10px;
}
</style>
