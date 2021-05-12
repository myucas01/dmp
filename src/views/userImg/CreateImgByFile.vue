<template>
  <div class="creat_wrap">
    <div class="title">
      <h1 v-if="!titleEditStatus">{{ titleVal }}</h1>
      <el-input v-if="titleEditStatus" v-model="titleVal" placeholder="请输入内容" @blur="titleEditStatus = false" />
      <img v-if="!titleEditStatus" src="@assets/img/userImg/edit@2x.png" @click=" titleEditStatus = !titleEditStatus">
    </div>
    <div class="content">
      <div class="header" style="margin-top: 10px;">
        <img
          v-if="!filterOpenStatus"
          src="@assets/img/userImg/filterOpen.png"
        >
        <h1>选择创建画像分类</h1>
      </div>
      <div class="filter-time-content filter-category-content">
        <h5>选择分类</h5>
        <!--v-model="userImgCategoryVal"-->
        <el-select v-model="userImgTypeVal" placeholder="请选择">
          <el-option
            v-for="item in userImgTypeOptions"
            :key="item.categoryName"
            :label="item.categoryName"
            :value="item.id"
          />
        </el-select>
      </div>
      <div class="header">
        <img
          v-if="filterOpenStatus"
          src="@assets/img/userImg/filterClose.png"
          @click="filterOpenStatus = !filterOpenStatus"
        >
        <img
          v-if="!filterOpenStatus"
          src="@assets/img/userImg/filterOpen.png"
          @click="filterOpenStatus = !filterOpenStatus"
        >
        <h1>选择画像人群的筛选条件</h1>
      </div>
      <div v-show="!filterOpenStatus" class="content">
        <h5 class="content_header">在 <strong>全部用户</strong> 中筛选</h5>
        <!-- 筛选 主体  -->
        <div v-show="!filterOpenStatus" class="filter_box">
          <date-time-picker v-model="times" style="width: 220px;" :time-option="timeOptions" />
          <div class="upload_btn">
            <el-upload
              v-show="!fileName"
              ref="upload"
              class="upload-demo"
              accept=".csv"
              action=""
              multiple
              :limit="1"
              :auto-upload="true"
              :http-request="customUpload"
            >
              <el-button size="small" type="text">上传文件</el-button>
            </el-upload>
          </div>
          <div v-show="fileName" class="upload_box">
            <img src="@/assets/img/userImg/excel@2x.png" alt="">
            <div class="upload_info">
              <p class="file_name">{{ fileName }}</p>
              <div class="file_schedule">
                <div v-if="!uploadStatus" class="file_progress_warp">
                  <div class="file_progress">
                    <el-progress :percentage="progressNumber" :stroke-width="10" color="#72CC12" :show-text="false" />
                  </div>
                  <span>上传中... {{ progressNumber }}%</span>
                </div>
                <span v-if="uploadStatus === 200 && progressNumber === 100" class="success">上传成功</span>
                <span v-if="uploadStatus !== 200 && progressNumber === 100" class="failed">上传失败！</span>
                <div class="operating">
                  <el-upload
                    ref="againUpload"
                    class="upload-demo"
                    action=""
                    accept=".csv"
                    multiple
                    :limit="1"
                    :auto-upload="true"
                    :before-upload="beforeUpload"
                    :http-request="customUpload"
                  >
                    <el-button size="small" type="text">重新上传</el-button>
                  </el-upload>
                  <span class="delete" @click="deleteUploadFile">删除</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="header" style="margin-top: 10px;">
        <img
          v-if="!filterOpenStatus"
          src="@assets/img/userImg/filterOpen.png"
        >
        <h1>选择品类画像</h1>
      </div>
      <div class="filter-time-content filter-category-content">
        <h5>品类画像</h5>
        <!--v-model="userImgCategoryVal"-->
        <el-cascader
          ref="cascader"
          v-model="userImgCategoryVal"
          :options="classImgOptions"
          :props="{checkStrictly: true,value: 'labelNo',label: 'labelName',children: 'children'}"
          :show-all-levels="false"
        />
      </div>
      <div class="footer">
        <el-button type="primary" @click="inquireData">查询</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import DateTimePicker from '../common/DateTimePicker'
import { createUserImg, userImgType } from '@api/userImg'
export default {
  name: 'CreateImg',
  components: {
    DateTimePicker
  },
  data() {
    return {
      times: {
        key: null,
        name: null,
        value: null
      },
      timeOptions: null,
      titleEditStatus: false, // 标题编辑
      titleVal: '未命名用户群画像1',
      filterOpenStatus: false, // 筛选条件展开状态
      progressNumber: 0, // 上传进度值
      fileName: '', // 文件名称
      uploadStatus: '',
      form: {
        profileName: '',
        filePath: '',
        startTime: '',
        endTime: ''
      },
      userImgCategoryVal: '',
      classImgOptions: [],
      userImgTypeOptions: [],
      userImgTypeVal: ''
    }
  },
  async mounted() {
    let localData = await localStorage.getItem('labelTree')
    localData = JSON.parse(localData)
    const list = localData.labelTree
    for (const i in list) {
      console.log(list[i])
      if (list[i].labelNo === 'U001') {
        this.classImgOptions = list[i].children
      }
    }
    console.log(this.classImgOptions)
    this.getUserImgType()
  },
  methods: {
    // 获取画像类型
    getUserImgType() {
      userImgType()
        .then(res => {
          if (res.code === 200) {
            this.userImgTypeOptions = res.data
          }
        })
    },
    // 上传文件
    customUpload(file) {
      const _this = this
      const formData = new FormData()
      _this.fileName = file.file.name
      formData.append('file', file.file)

      axios({
        method: 'post',
        url: '/userImg/putObject',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: function(progressEvent) {
          _this.progressNumber = Number(((progressEvent.loaded / progressEvent.total) * 100).toFixed(2))
        }
      })
        .then(res => {
          if (res.data.code === 200) {
            _this.form.filePath = res.data.description
          }
          _this.uploadStatus = res.data.code
          _this.$refs.upload.clearFiles()
        })
        .catch(err => console.error(err))
    },
    beforeUpload() {
      this.progressNumber = 0
      this.form.filePath = ''
      this.uploadStatus = ''
      this.$refs.againUpload.clearFiles()
    },
    // 删除上传文件
    deleteUploadFile() {
      this.progressNumber = 0
      this.form.filePath = ''
      this.uploadStatus = ''
      this.fileName = ''
    },
    // 发起查询
    inquireData() {
      const _this = this
      if (!_this.titleVal) {
        _this.$message({
          message: '画像名称不能为空！',
          type: 'warning'
        })
        return
      }
      if (!_this.times.key) {
        _this.$message({
          message: '请选择应用时间段！',
          type: 'warning'
        })
        return
      }
      if (!_this.form.filePath) {
        _this.$message({
          message: '请上传文件！',
          type: 'warning'
        })
        return
      }
      const userImgCategoryobj = this.$refs.cascader.getCheckedNodes()[0]
      const data = {
        profileName: _this.titleVal,
        type: this.userImgTypeVal,
        typeName: this.userImgTypeOptions.filter(item => item.id === this.userImgTypeVal).length > 0 ? this.userImgTypeOptions.filter(item => item.id === this.userImgTypeVal)[0]['categoryName'] : '',
        upload: {
          'filePath': _this.form.filePath,
          'startTime': _this.times ? _this.times.key.split('|')[0] : null,
          'endTime': _this.times ? _this.times.key.split('|')[1] : null
        },
        goodsCategory: userImgCategoryobj ? userImgCategoryobj.value : '',
        goodsCategoryName: userImgCategoryobj ? userImgCategoryobj.label : ''

      }
      createUserImg(data)
        .then(res => {
          if (res.code === 200) {
            _this.$router.push('/userImg/index')
          }
        })
        .catch(err => console.log(err))
    }
  }
}
</script>

<style scoped lang="less">
  .creat_wrap {
    min-height: calc(100vh - 80px);
    background-color: #fff;
    padding: 20px;
    /deep/ .el-button{
      &:focus {
        color: #930CEA !important;
      }
      &:hover{
        color: #930CEA !important;;
      }
    }
  }

  .title {
    height: 30px;
    line-height: 30px;
    position: relative;
    overflow: hidden;

    &:before {
      width: 3px;
      height: 16px;
      content: '';
      background: rgba(147, 12, 234, 1);
      position: absolute;
      top: 8px;
      left: 0;
    }

    h1 {
      font-size: 16px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: rgba(51, 51, 51, 1);
      text-indent: 10px;
      float: left;
    }

    img {
      display: inline-block;
      width: 16px;
      height: 16px;
      cursor: pointer;
      float: left;
      position: relative;
      top: 8px;
      left: 10px;
    }
    /deep/ .el-input{
      width: 200px;
      float: left;
      margin-left: 10px;
    }
    /deep/ .el-input__inner{
      height: 30px;
      line-height: 30px;
    }
  }
  .content{
    margin-top: 20px;
    .header {
      position: relative;
      overflow: hidden;

      img {
        display: inline-block;
        width: 14px;
        height: 14px;
        float: left;
        position: relative;
        top: 3px;
        cursor: pointer;
      }

      h1 {
        font-size: 15px;
        font-weight: 600;
        color: rgba(51, 51, 51, 1);
        float: left;
        margin-left: 10px;
      }
    }
    .content {
      background: rgba(255, 255, 255, 1);
      border-radius: 4px;
      border: 1px solid rgba(221, 222, 225, 1);
      margin-top: 10px;

      &_header {
        font-size: 13px;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        margin-top: 10px;
        padding-left: 15px;
        position: relative;
        padding-bottom: 10px;
      }

      .add_filters {
        position: absolute;
        top: 0;
        right: 10px;
        cursor: pointer;

        img {
          display: inline-block;
          width: 14px;
          height: 14px;
        }

        span {
          font-size: 12px;
          font-weight: 600;
          color: rgba(51, 51, 51, 1);
        }
      }
    }
    .filter_box{
      height: 100px;
      border-top: 1px solid #DDDEE1;
      padding: 30px;
    }
  }
  .footer {
    margin-top: 30px;
    /deep/ .el-button{
      &:hover{
        color: #fff !important;
      }
    }
  }
  .filter_box{
    display: flex;
    img{
      display: inline-block;
      width: 38px;
      height: 38px;
    }
    .upload_box{
      display: flex;
    }
    .upload_info{
      position: relative;
      margin-left: 10px;
      .file_name{
        font-size:12px;
        font-weight:500;
        color:rgba(58,58,58,1);
        margin-bottom: 0;
      }
      .file_progress_warp{
        display: flex;
        align-items: center;
        span{
          margin-left: 10px;
        }
      }
      .file_schedule{
        display: flex;
        align-items: center;
        position: relative;
        top: -2px;
        .file_progress{
          width:115px;
        }
        span{
          font-size:12px;
          font-weight:400;
          color:rgba(153,153,153,1);
          float: left;
          margin-right: 10px;
        }
        .success{
          color: #60BB00;
        }
        .failed{
          color: #D64735;
        }
        .operating{
          display: flex;
          align-items: center;
          /deep/ .el-button--text{
            font-size:12px;
            font-weight:400;
            color:rgba(153,153,153,1);
            text-decoration: underline;
            cursor: pointer;
            &:hover{
              color:rgba(153,153,153,1);
            }
          }
        }
        .delete{
          font-size:12px;
          font-weight:400;
          color:rgba(153,153,153,1);
          text-decoration: underline;
          cursor: pointer;
          margin-left: 10px;
        }
      }

    }
    .upload_btn{
      display: flex;
      align-items: center;
      margin-left: 15px;
    }
  }
.filter-time-content {
      display: flex;
      height: 60px;
      border: 1px solid #DDDEE1;
      align-items: center;
      justify-items: center;
      border-radius: 4px;

      h5 {
        font-size: 12px;
        font-weight: 400;
        color: #333333;
        line-height: 60px;
        padding: 0;
        margin: 0 10px 0 12px;
      }

      /deep/ .el-input__inner {
        width: 260px;
        height: 32px;
        background: #FFFFFF;
        border-radius: 4px;
        border: 1px solid #DDDEE1;
      }

      /deep/ .el-input__icon {
        line-height: 32px;
      }
    }
  .filter-time-content {
    display: flex;
    height: 60px;
    border: 1px solid #DDDEE1;
    align-items: center;
    justify-items: center;
    border-radius: 4px;
    margin-bottom: 20px;

    h5 {
      font-size: 12px;
      font-weight: 400;
      color: #333333;
      line-height: 60px;
      padding: 0;
      margin: 0 10px 0 12px;
    }

    /deep/ .el-input__inner {
      width: 260px;
      height: 32px;
      background: #FFFFFF;
      border-radius: 4px;
      border: 1px solid #DDDEE1;
    }

    /deep/ .el-input__icon {
      line-height: 32px;
    }
  }
</style>
