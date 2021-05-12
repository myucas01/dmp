<template>
  <div class="creat_wrap">
    <div class="title">
      <h1 v-if="!titleEditStatus">{{ titleVal }}</h1>
      <el-input v-if="titleEditStatus" v-model="titleVal" placeholder="请输入内容" @blur="titleEditStatus = false" />
      <img v-if="!titleEditStatus" src="@assets/img/userImg/edit@2x.png" @click=" titleEditStatus = !titleEditStatus">
    </div>
    <div class="content">
      <filter-component :name="titleVal" />
    </div>
  </div>
</template>

<script>
import filterComponent from './components/ConditionModule'
import { mapGetters } from 'vuex'
export default {
  name: 'CreateImg',
  components: {
    filterComponent
  },
  data() {
    return {
      titleEditStatus: false, // 标题编辑
      titleVal: '未命名用户群画像1'
    }
  },
  computed: {
    ...mapGetters([
      'editUserImg'
    ])
  },
  watch: {
    editUserImg() {
      if (this.editUserImg) {
        this.titleVal = this.editUserImg.profileName
      }
    }
  }
}
</script>

<style scoped lang="less">
  .creat_wrap {
    padding: 20px;
    min-height: calc(100vh - 80px);
    background-color: #fff;
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
  }
</style>
