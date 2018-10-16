<template>
<div>
  <!-- 添加推送 -->
  <el-form
    label-width="100px"
    :model="formData"
    label-position="right"
    :rules="rules"
    ref="formData"
    class="dialog-form push-dialog"
  >
    <!-- 文章标题 -->
    <el-form-item label="文章标题" prop="title">
      <el-row :span="24">
        <el-col :span="20">
          <el-input v-model="formData.title" size="small"></el-input>
        </el-col>
        <el-col :span="4">
          <!--<el-button class="preview" type="primary" size="small" @click="preview">预览</el-button>-->
        </el-col>
      </el-row>
    </el-form-item>
    <!-- 文章类型 -->
    <el-form-item label="文章类型" prop="contentType">
      <el-select v-model="formData.contentType" placeholder="请选择文章类型" size="small">
        <el-option
          v-for="item in contentType"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <!-- 所属频道 -->
    <el-form-item label="所属频道" prop="type">
      <el-select v-model="formData.channelId" placeholder="请选择所属频道" size="small">
        <el-option
          v-for="(item,index) in pushTypes"
          :key="index"
          :label="item.channelName"
          :value="index"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <!-- 所属内容 -->
    <el-form-item label="所属内容" prop="createType">
      <el-select v-model="formData.createType" placeholder="请选择所属内容" size="small">
        <el-option
          v-for="item in contentTypes"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <!-- 文章作者 -->
    <el-form-item label="文章作者" prop="author">
      <el-input v-model="formData.authorName" size="small" placeholder="请输入作者信息"></el-input>
    </el-form-item>
    <!-- 文章内容-->
    <el-form-item label="文章内容" v-show='this.types'>
      <div id="editor" v-model="formData.body">
      </div>
      <p class="tip">注:只能上传jpg/png格式文件，文件不能超过500K，尺寸999*999最少上传三张图片</p>
    </el-form-item>
    <el-form-item label="视频链接" v-show='!this.types'>
      <el-input v-model="formData.body" size="small" placeholder="请输入视频链接"></el-input>
    </el-form-item>
    <el-form-item label="视频封面图" v-show='!this.types'>
      <el-input v-model="formData.images" size="small" placeholder="请输入视频封面图链接"></el-input>
    </el-form-item>
    <el-form-item label="是否推荐文章">
      <template>
        <el-radio v-model="formData.isRecommend" label="1">是</el-radio>
      </template>
    </el-form-item>

    <div class="dialog-footer">
      <el-button size="small" @click="cancel('formData')">取消</el-button>
      <el-button type="primary" size="small" @click="submit('formData')">保存</el-button>
    </div>
  </el-form>
</div>
</template>
<script>
export default {
  name: 'FormForContent',
  props: ['formData', 'control', 'operation'],
  data () {
    return {
      // 所属频道
      pushTypes: [],
      // 文章类型
      contentType: [
        {
          value: 'ARTICLE',
          label: '文章'
        },
        {
          value: 'VIDEO',
          label: '视频'
        }
      ],
      // 内容类型
      contentTypes: [
        {
          value: 'QUALITY',
          label: '精品内容'
        },
        {
          value: 'JANESI',
          label: '平台内容'
        },
        {
          value: 'GENERAL',
          label: '普通内容'
        }
      ],
      editor: {},
      uploadImg: '',
      contentApi: '',
      types: true,
      rules: {
        contentType: [
          { required: true, message: '请选择文章类型', trigger: 'change' }
        ],
        title: [
          { required: true, message: '请填写文章标题', trigger: 'blur' }
        ],
        channelId: [
          { required: true, message: '请选择所属频道', trigger: 'change' }
        ],
        createType: [
          { required: true, message: '请选择所属内容', trigger: 'change' }
        ],
        authorName: [
          { required: true, message: '请填写文章作者', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    var _this = this
    var E = require('wangeditor') // 使用 npm 安装
    // 创建编辑器
    this.editor = new E('#editor')
    this.editor.customConfig.uploadImgServer = this.$store.state.testApi + '/admin/bops/file/aliyun/upload_content'
    this.editor.customConfig.uploadImgHooks = {
      before: function (xhr, editor, files) {
        // 图片上传之前触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象files是选择的图片文件
        // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
        // return {
        //     prevent: true,
        //     msg: '放弃上传'
        // }
        // console.log(xhr)
        // console.log(editor)
        // console.log(files)

      },
      success: function (xhr, editor, result) {
        // 图片上传并返回结果，图片插入成功之后触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
        // console.log(xhr, editor, result)
        // console.log(result);
        console.log(xhr)
      },
      fail: function (xhr, editor, result) {
        // 图片上传并返回结果，但图片插入错误时触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
      },
      error: function (xhr, editor) {
        // 图片上传出错时触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
        console.log(xhr)
        // console.log(editor)
      },
      timeout: function (xhr, editor) {
        // 图片上传超时时触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
      },

      // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
      // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
      customInsert: function (insertImg, result, editor) {
        // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
        // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

        // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
        // console.log(insertImg);
        // console.log(result);
        // console.log(editor);
        _this.uploadImg = result.result
        // console.log(JSON.stringify(_this.uploadImg));
        for (var i = 0; i < result.result.length; i++) {
          insertImg(result.result[i])
        }
        // result 必须是一个 JSON 格式字符串！！！否则报错
      }
    }
    this.editor.customConfig.uploadImgShowBase64 = true
    this.editor.create()
    if (this.formData.contentType === 'VIDEO') {
      this.types = false
    }
    this.channel_list(this.formData.contentType)
  },
  watch: {
    'formData.body': function (val, old) {
      this.editor.txt.html(this.formData.body)
    },
    'control': function (val, old) {
      if (val) {
        this.formData.body = ''
      }
    },
    'formData.contentType': function (val, old) {
      this.channel_list(this.formData.contentType)
      if (val !== 'VIDEO') {
        this.types = true
      } else {
        this.types = false
      }
    }

  },
  methods: {
    // 预览
    preview () {
      this.formData.body = this.editor.txt.html()
      this.$emit('openPreview', this.formData)
    },
    // 获取频道列表
    channel_list (param) {
      if (!param) {
        param = 'ARTICLE'
      }
      this.$http.post(this.$store.state.testApi + '/admin/bops/content_manage/channel_list',
        this.filterData({ channelClassify: param })
      ).then(res => {
        if (res.data.code === '0') {
          this.pushTypes = res.data.result
        }
      })
    },
    // 关闭弹窗
    cancel (ruleForm) {
      this.$emit('cancelDialog', false)
      this.$refs[ruleForm].resetFields()
      this.editor.txt.html('')
    },

    // 提交回传表单信息给父组件
    submit (ruleForm) {
      var s = this.editor.txt.html()
      var n = (s.split('img')).length - 1
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          if (this.types) {
            if (n < 3) {
              this.$message('最少上传三张图')
              return
            }
            this.formData.images = JSON.stringify(this.uploadImg)
            this.formData.body = s
          }
          this.formData.channel = this.pushTypes[parseInt(this.formData.channelId)].channelName
          if (this.formData.isRecommend) {
            this.formData.isRecommend = '1'
          } else {
            this.formData.isRecommend = '0'
          }
          if (this.operation) {
            // 添加一条内容
            this.contentApi = '/admin/bops/content_manage/add_content'
          } else {
            // 修改一条内容
            this.contentApi = '/admin/bops/content_manage/update_content'
          }

          this.$http.post(this.$store.state.testApi + this.contentApi,
            this.filterData(this.formData)
          ).then(res => {
            // console.log(res);
            if (res.data.code === '0') {
              this.$emit('cancelDialog', false)
              this.editor.txt.html('')
            }
          })
        } else {
          return false
        }
      })
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
.preview {
  margin-left: 20px;
}
.tip {
  color: #ccc;
}
#text {
  height: 300px;
  border: 1px solid #ccc;
  overflow: hidden;
  overflow-y: scroll;
  padding: 30px;
}
.text::-webkit-scrollbar {
  display: none;
}
</style>
