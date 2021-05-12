<template>
  <div class="pages">
    <div class="topBox">
      <div class="left">
        <div class="title">
          <em />
          <span>用户画像</span>
        </div>
        <div class="info">
          <p><em>1</em>使用 <span>标签、用户行为、用户属性</span> 进行筛选</p>
          <p>
            <em>2</em>观察目标群体的 <span>标签分布、行为指标</span> 和
            <span>用户构成</span>
          </p>
          <p>
            <em>3</em>将目标群体保存为 <span>用户群标签</span> 或
            <span>导出人群列表</span>
          </p>
        </div>
        <el-button
          v-auth="'profileinfo:create'"
          type="primary"
          @click="dialogCreateVisible = true"
        >创建用户画像</el-button>
      </div>
      <div class="right">
        <img src="@assets/img/userImg/indexbg.png" alt="">
      </div>
    </div>
    <div class="listBox">
      <div class="top">
        <div class="title">
          <em />
          <span>用户画像列表</span>
          <span
            style="font-size: 12px;color: #999999FF;"
          >共 {{ listNum }}个</span>
        </div>
      </div>
      <!-- 用户画像列表 -->
      <portraitList :list-num="listNum" />
    </div>
    <!-- 创建 画像 入口 -->
    <el-dialog
      title="选择创建画像方式"
      custom-class="createMethod"
      :visible.sync="dialogCreateVisible"
      width="500px"
    >
      <div class="create_wrap">
        <ul>
          <li>
            <span
              class="icon"
              :class="{ icon_active: createTypeCode == 'condition' }"
              @click="createTypeCode = 'condition'"
            />
            <div class="lis_content" @click="createTypeCode = 'condition'">
              <img src="@assets/img/userImg/create_user@2x.png" alt="">
              <span>筛选条件创建画像</span>
            </div>
          </li>
          <li>
            <span
              class="icon"
              :class="{ icon_active: createTypeCode == 'file' }"
              @click="createTypeCode = 'file'"
            />
            <div class="lis_content" @click="createTypeCode = 'file'">
              <img src="@assets/img/userImg/create_file@2x.png" alt="">
              <span>人群包创建画像</span>
            </div>
          </li>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCreateVisible = false">取 消</el-button>
        <router-link
          v-auth="'profileinfo:create'"
          :to="{
            path: `/userImg/${
              createTypeCode == 'file' ? 'CompareByFile' : 'createByCondition'
            }`
          }"
          style="padding:12px 20px;background:rgba(147,12,234,1);color: #fff;text-align: center;line-height: 30px;border: 1px solid rgba(147,12,234,1);border-radius: 4px; margin-left: 10px;"
        >确 定</router-link>
      </span>
    </el-dialog>
    <el-dialog
      title="请选择你要分享的人"
      class="enjoy-dialog"
      :visible.sync="dialogVisibleEnjoy"
      width="550px"
    >
      <div class="enjoy-content">
        <div class="enjoy-content-header">
          <el-input
            v-model="searchUser"
            placeholder="请输入内容"
          >
            <i slot="prefix" class="el-input__icon el-icon-search" />
          </el-input>
        </div>
        <div class="enjoy-content-ct">
          <el-table
            :data="tableData"
            border
            height="200"
            style="width: 100%"
          >
            <el-table-column
              type="selection"
              align="center"
              width="55"
            />
            <el-table-column
              prop="date"
              align="center"
              label="账号名称"
            />
            <el-table-column
              prop="name"
              align="center"
              label="账号"
            />
          </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import portraitList from './List.vue' // 画像列表
export default {
  components: {
    portraitList
  },
  data() {
    return {
      dialogVisible: false,
      createYes: true,
      dialogCreateVisible: false,
      createTypeCode: 'condition',
      dialogVisibleEnjoy: false,
      searchUser: '',
      tableData: [],
      listNum: 0
    }
  }
}
</script>

<style lang="less" scoped>
.pages {
  min-height: calc(100vh - 80px);
  background-color: #fff;
  /deep/.el-dialog__body {
    padding: 0 20px;
    border-top: 1px solid #dddee1ff;
    border-bottom: 1px solid #dddee1ff;
    padding: 10px 20px;
  }
}
.topBox {
  padding: 20px;
  display: flex;
  border-bottom: 10px solid #f5f5f5ff;
}
.title {
  display: flex;
  align-items: center;
  em {
    display: inline-block;
    width: 3px;
    height: 16px;
    background-color: #930ceaff;
  }
  span {
    font-size: 16px;
    color: #333333ff;
    margin-left: 5px;
    font-weight: bolder;
  }
}
.topBox {
  .info {
    margin-bottom: 20px;
    margin-top: 20px;
    p {
      color: #4d4d4dff;
      font-size: 12px;
      margin-bottom: 10px;
      em {
        display: inline-block;
        width: 16px;
        height: 16px;
        border-radius: 16px;
        border: 2px solid #930ceaff;
        text-align: center;
        line-height: 14px;
        color: #930ceaff;
        font-size: 12px;
        margin-right: 20px;
      }
      span {
        color: #4d4d4dff;
        font-weight: bold;
      }
    }
  }
  .left {
    /deep/ .el-button--primary {
      background-color: rgb(147, 12, 234);
      border: none;
      padding: 10px 17px;
      font-size: 12px;
    }
  }
  .right {
    img {
      height: 183px;
      margin-left: 200px;
    }
  }
}

.listBox {
  padding-top: 20px;
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
  }
  .info {
    border-top: 1px solid #dddee1ff;
    margin-top: 20px;
    padding: 20px;
  }
  /deep/ .el-button--primary {
    background-color: rgb(147, 12, 234);
    border: none;
    padding: 10px 17px;
  }
}

.itemBox {
  display: inline-block;
  width: 30%;
  margin-bottom: 10px;
  .el-checkbox {
    margin-right: 5px;
  }
  .nameBox {
    cursor: pointer;
    font-size: 12px;
    &:hover {
      color: #930ceaff;
    }
  }
}
.el-checkbox:hover {
  color: #930ceaff;
}
.dialog {
  p {
    font-size: 12px;
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    em {
      width: 6px;
      height: 6px;
      border-radius: 6px;
      background-color: #930ceaff;
      display: inline-block;
      margin-right: 10px;
    }
  }
  h3 {
    margin-bottom: 30px;
  }
}
.create_wrap {
  ul {
    display: block;
    width: 300px;
    margin: 0 auto;
    li {
      position: relative;
      margin-bottom: 25px;
      margin-left: 40px;
      &:last-child {
        margin-bottom: 0;
      }
      .icon {
        display: inline-block;
        width: 16px;
        height: 16px;
        background: rgba(255, 255, 255, 1);
        border-radius: 8px;
        border: 1px solid rgba(192, 204, 218, 1);
        position: absolute;
        top: 15px;
        left: -40px;
        cursor: pointer;
      }
      .icon_active {
        border: 1px solid rgba(147, 12, 234, 1);
        &:before {
          content: "";
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(147, 12, 234, 1);
          position: absolute;
          top: 50%;
          left: 50%;
          margin-left: -4px;
          margin-top: -4px;
        }
      }
    }
  }
  .lis_content {
    display: flex;
    align-items: center;
    width: 213px;
    height: 49px;
    line-height: 49px;
    background: rgba(250, 247, 252, 1);
    border-radius: 8px;
    border: 1px solid rgba(147, 12, 234, 1);
    font-size: 16px;
    font-weight: 600;
    color: rgba(147, 12, 234, 1);
    cursor: pointer;
    img {
      display: inline-block;
      width: 30px;
      height: 30px;
      margin-left: 20px;
      margin-right: 15px;
    }
  }
}
.enjoy-dialog{
  .enjoy-content{
    &-header{
      width: 200px;
      height: 32px;
      background: #FFFFFF;
      border-radius: 4px;
      border: 1px solid #E0E6ED;
    }
    &-ct{
      margin-top: 20px;
    }
  }
  /deep/ .el-dialog__body{
    border-top: none;
  }
}
</style>
<style lang="less">
.createMethod {
  .el-dialog__body {
    padding: 50px 0 !important;
    border: none !important;
  }
}
</style>
