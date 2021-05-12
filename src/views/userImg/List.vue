<template>
  <div class="userImg-wrap">
    <!-- 筛选 -->
    <div class="filter-box">
      <div class="left-box">
        <div class="filter-item">
          <h5>画像来源:</h5>
          <el-select v-model="userImgSource" placeholder="请选择" @change="getList">
            <el-option
              v-for="item in userImgSourceOptions"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </div>
        <div class="filter-item">
          <h5>画像状态:</h5>
          <el-select v-model="userImgStatus" placeholder="请选择" @change="getList">
            <el-option
              v-for="item in userImgStatusOptions"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </div>
      </div>
      <div class="right-box">
        <el-input
          v-model="searchVal"
          placeholder="输入内容检索"
          @keyup.enter.native="getList"
        >
          <i slot="prefix" class="el-input__icon el-icon-search" />
        </el-input>
        <el-button
          v-auth="'profileinfo:create'"
          type="primary"
          @click="createCompareImg"
        >创建对比画像
        </el-button>
      </div>
    </div>
    <!-- table headers -->
    <div class="filter-type-box">
      <div
        v-for="(item,index) of filterTypeOptions"
        :key="index"
        class="filter-type-item"
        :class="{'filter-type-item-active': item.active}"
        @click="chooseType(index)"
      >{{ item.categoryName }}
      </div>
    </div>
    <!-- list table -->
    <div class="list-table">
      <el-table
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column
          prop="id"
          label="画像ID"
        >
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.checked" :disabled="scope.row.disabled"/>
            <span style="margin-left: 10px;"> {{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="profileName"
          label="名称"
          width="320"
        >
          <template slot-scope="scope">
            <span class="profileName" @click="goDetail(scope.row.profileNo)">{{ scope.row.profileName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="画像来源"
        >
          <template slot-scope="scope">
            {{ scope.row.source | userImgSourceFilter(that) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="画像状态"
        >
          <template slot-scope="scope">
            <el-tooltip
              :disabled="scope.row.status == '0' ? false : true "
              class="item"
              effect="dark"
              :content="'第'+scope.row.sequence+'计算顺位'"
              placement="top-start"
            >
              <span
                :class="{
                  'successText': scope.row.status === '2',
                  'computedText': scope.row.status === '1',
                  'failedText': scope.row.status === '3',
                  'suspendText': scope.row.status === '0',
                }"
                style="cursor: pointer;"
                @click="openComputedGroup(scope.row.status)"
              >{{ scope.row.status|userImgStatusFilter(that) }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="userNmae"
          sortable
          label="创建人"
        />
        <el-table-column
          prop="updateTime"
          sortable
          label="更新时间"
        />
        <el-table-column
          prop="address"
          width="260"
          align="center"
          label="操作"
        >
          <template slot-scope="scope">
            <span class="operation-item" @click="sortUserImg('0', scope.row.profileNo)">
              <svg-icon icon-class="moveTop" class-name="icon-class" />上移</span>
            <span class="operation-item" @click="sortUserImg('1', scope.row.profileNo)">
              <svg-icon icon-class="moveBottom" class-name="icon-class" />下移</span>
            <el-tooltip content="Top center" placement="top" popper-class="tools">
              <div slot="content" class="tools-box">
                <div v-if="scope.row.source !== '2'" @click="getUserList(scope.row.profileNo)">分享</div>
                <div @click="deleteUserImg(scope.row)">删除</div>
                <div @click="openClassDialog(scope.row)">修改分类</div>
              </div>
              <div class="operation-item">
                <svg-icon icon-class="tools"/>
                更多操作
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 画像对比  -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="500px">
      <span v-if="!createYes">只能选择2至3个画像做对比，请重新选择</span>
      <div v-if="createYes" class="dialog">
        <h3>请确认要对比以下画像：</h3>
        <p v-for="checkListItem of checkList" :key="checkListItem.profileName">
          <em />{{ checkListItem.profileName }}
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button
          size="small"
          type="primary"
          @click="goCompare"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分享  -->
    <el-dialog
      title="请选择你要分享的人"
      :visible.sync="dialogVisibleEnjoy"
      width="550px"
    >
      <div class="enjoy-content">
        <el-input
          v-model="searchUserKey"
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
          clearable
          @clear="getUserList"
          @keyup.enter.native="getUserList"
        />
        <el-table
          ref="enjoyTable"
          :data="userTable"
          tooltip-effect="dark"
          style="width: 100%"
          height="300"
        >
          <el-table-column
            type="selection"
            width="80"
          />
          <el-table-column
            prop="nickName"
            label="账号名称"
            align="center"
          />
          <el-table-column
            prop="userName"
            label="姓名"
            align="center"
          />
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="userImgShare">确 定</el-button>
      </div>
    </el-dialog>
    <!--  计算队列 -->
    <el-dialog
      title="调整计算队列"
      :visible.sync="computedDialogVisible"
      width="600px"
    >
      <div class="computed-content">
        <el-table
          :data="awaitComputList"
          tooltip-effect="dark"
          style="width: 100%"
          height="300"
        >
          <el-table-column
            prop="profileName"
            label="画像名称"
            align="center"
          />
          <el-table-column
            prop="sort"
            label="序号"
            align="center"
          />
          <el-table-column
            label="操作"
          >
            <template slot-scope="scope">
              <span class="operation-item" @click="sortComputedGroup('0', scope.row.profileNo)">
                <svg-icon icon-class="moveTop" class-name="icon-class" />上移</span>
              <span class="operation-item" @click="sortComputedGroup('1', scope.row.profileNo)">
                <svg-icon icon-class="moveBottom" class-name="icon-class" />下移</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <!--  修改画像分类  -->
    <el-dialog
      title="修改画像分类"
      :visible.sync="dialogVisibleClass"
      width="390px"
    >
      <div class="class-content">
        <p>请选择目标分类:</p>
        <el-select v-model="targetClass" placeholder="请选择">
          <el-option
            v-for="item in filterTypeOptions.slice(1)"
            :key="item.categoryName"
            :label="item.categoryName"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleClass = false">取 消</el-button>
        <el-button type="primary" @click="saveChangeClass">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { userImgList, deleteImg, userImgSource, userImgStatus, userImgType, userImgSort, userImgShare, awaitComputedList, changeAwaitComputed, alterClass } from '@api/userImg'
import { userList } from '@api/user'
export default {
  title: '画像列表',
  filters: {
    userImgStatusFilter(val, that) {
      if (val) {
        if (that.statusMap.has(val)) {
          return that.statusMap.get(val)
        } else {
          return ''
        }
      } else {
        return ''
      }
    },
    userImgSourceFilter(val, that) {
      if (val) {
        if (that.sourceMap.has(val)) {
          return that.sourceMap.get(val)
        } else {
          return ''
        }
      } else {
        return ''
      }
    }
  },
  data() {
    return {
      options: [],
      userImgSource: '', // 画像来源
      userImgStatus: '', // 画像状态
      userImgType: '', // 画像类型
      searchVal: '', // 检索内容
      filterTypeOptions: [],
      tableData: [],
      checkList: [],
      dialogVisible: false,
      dialogVisibleEnjoy: false,
      computedDialogVisible: false,
      dialogVisibleClass: false,
      targetClass: '',
      createYes: false,
      deleteImgID: '',
      userImgSourceOptions: [],
      userImgStatusOptions: [],
      statusMap: new Map(),
      sourceMap: new Map(),
      that: this,
      searchUserKey: '',
      searchName: '',
      userTable: [],
      enjoyUserImgID: '',
      awaitComputList: [],
      targetProfileNo: ''
    }
  },
  mounted() {
    this.getUserImgType()
    this.getUserImgSource()
    this.getUserImgStatus()
  },
  methods: {
    // 获取画像类型
    getUserImgType() {
      userImgType()
        .then(res => {
          if (res.code === 200) {
            this.filterTypeOptions = res.data
            if (this.filterTypeOptions && this.filterTypeOptions.length > 0) {
              for (const item of this.filterTypeOptions) {
                this.$set(item, 'active', false)
              }
            }
            this.filterTypeOptions.unshift({
              categoryCode: '',
              categoryName: '全部',
              active: true
            })
          }
        })
    },
    // 获取画像来源
    getUserImgSource() {
      userImgSource()
        .then(res => {
          if (res.code === 200) {
            this.userImgSourceOptions = res.data
            if (this.userImgSourceOptions && this.userImgSourceOptions.length > 0) {
              for (const item of this.userImgSourceOptions) {
                this.sourceMap.set(item.code, item.name)
              }
            }
            this.userImgSourceOptions.unshift({
              code: '',
              name: '全部'
            })
          }
        })
    },
    // 获取画像状态
    getUserImgStatus() {
      userImgStatus()
        .then(res => {
          if (res.code === 200) {
            this.userImgStatusOptions = res.data
            if (this.userImgStatusOptions && this.userImgStatusOptions.length > 0) {
              for (const item of this.userImgStatusOptions) {
                this.statusMap.set(item.code, item.name)
              }
            }
            this.userImgStatusOptions.unshift({
              code: '',
              name: '全部'
            })
            this.getList()
          }
        })
    },
    // 获取画像配置列表
    getList() {
      userImgList({
        currentPage: 1,
        pageSize: 10000,
        source: this.userImgSource,
        status: this.userImgStatus,
        type: this.userImgType,
        profileName: this.searchVal
      }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data ? res.data.list : ''
          this.$parent.listNum = res.data ? res.data.size : 0
          for (const item of this.tableData) {
            this.$set(item, 'checked', false)
            this.$set(item, 'disabled', true)
            this.$set(item, 'openTools', false)
            if (item.status === '2') {
              this.$set(item, 'disabled', false)
            }
          }
        }
      })
    },
    // 删除用户画像
    deleteUserImg(row) {
      console.log(row)
      const _this = this
      _this.deleteImgID = row.id
      _this.$confirm('此操作将删除该画像, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.deleteImg([_this.deleteImgID])
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteImg(checkList) {
      deleteImg(checkList)
        .then(res => {
          if (res.code === 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getList()
          }
        })
        .catch(err => console.log(err))
    },
    chooseType(index) {
      for (const item of this.filterTypeOptions) {
        this.$set(item, 'active', false)
        if (this.filterTypeOptions[index].id === item.id) {
          this.$set(item, 'active', true)
          this.userImgType = item.id
        }
      }
      this.getList()
    },
    // 创建对比画像
    createCompareImg() {
      this.dialogVisible = true
      this.checkList = this.tableData.filter(item => item.checked === true)
      if (this.checkList.length !== 2 && this.checkList.length !== 3) {
        this.createYes = false
      } else {
        this.createYes = true
      }
    },
    // 前往画像对比详情页
    goCompare() {
      if (this.createYes) {
        const ids = []
        this.checkList.forEach(item => {
          ids.push(item.profileNo)
        })
        this.$router.push('/userImg/compare?ids=' + ids.toString())
      } else {
        this.dialogVisible = false
      }
    },
    // 前往详情页
    goDetail(id) {
      this.$router.push('/userImg/detail?id=' + id)
    },
    // 排序 画像
    sortUserImg(direction, profileNo) {
      userImgSort({
        direction: direction,
        profileNo: profileNo,
        code: this.userImgType
      })
        .then(res => {
          if (res.code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.getList()
          }
        })
    },
    // 获取画像列表
    getUserList(profileNo) {
      this.dialogVisibleEnjoy = true
      this.enjoyUserImgID = profileNo
      userList({
        multi: this.searchUserKey,
        page: 1,
        limit: 100
      })
        .then(res => {
          if (res.code === 200) {
            this.userTable = res.data ? res.data.list : []
          }
        })
        .catch(err => console.error(err))
    },
    // 画像分享
    userImgShare() {
      userImgShare({
        profileNo: this.enjoyUserImgID,
        receives: this.$refs.enjoyTable.selection
      })
        .then(res => {
          if (res.code === 200) {
            this.dialogVisibleEnjoy = false
          }
        }).catch(err => console.error(err))
    },
    // 开启 计算队列
    openComputedGroup(status) {
      if (status === '0' || status === '1') {
        awaitComputedList()
          .then(res => {
            if (res.code === 200) {
              this.awaitComputList = res.data
            }
          })
          .catch(err => console.error(err))
        this.computedDialogVisible = true
      }
    },
    sortComputedGroup(direction, profileNo) {
      changeAwaitComputed({
        direction: direction,
        profileNo: profileNo
      })
        .then(res => {
          if (res.code === 200) {
            this.openComputedGroup('0')
            this.getList()
          }
        })
    },
    openTools(index) {
      this.tableData[index].openTools = !this.tableData[index].openTools
      for (let i = 0; i < this.tableData.length; i++) {
        if (i !== index) {
          this.tableData[i].openTools = false
        }
      }
    },
    // 保存修改的分类
    saveChangeClass() {
      alterClass({
        profileNo: this.targetProfileNo,
        type: this.targetClass
      })
        .then(res => {
          if (res.code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.targetClass = ''
            this.dialogVisibleClass = false
            this.getList()
          }
        })
    },
    openClassDialog(row) {
      this.dialogVisibleClass = true
      this.targetProfileNo = row.profileNo
    }
  }
}
</script>
<style lang="less" scoped>
  .userImg-wrap {
    padding-top: 10px;

    .filter-box {
      display: flex;
      padding-left: 20px;
      justify-content: space-between;

      .left-box {
        display: flex;

        .filter-item {
          display: flex;
          margin-right: 25px;

          h5 {
            margin-right: 10px;
            line-height: 30px;
            font-size: 12px;
            font-weight: 600;
            color: #333333;
          }

          /deep/ .el-select {
            width: 120px;
            height: 30px;
          }

          /deep/ .el-input__inner {
            width: 120px;
            height: 30px;
            font-size: 12px;
          }

          /deep/ .el-input__icon {
            line-height: 30px;
          }
        }
      }

      .right-box {
        display: flex;

        /deep/ .el-input__inner {
          width: 200px;
          height: 30px;
          background: #FFFFFF;
          border-radius: 4px;
          border: 1px solid #E0E6ED;
          font-size: 12px;
        }

        /deep/ .el-input__icon {
          line-height: 30px;
        }

        /deep/ .el-button {
          width: 100px;
          height: 30px;
          background: #930CEA;
          border-radius: 4px;
          font-size: 12px;
          margin-left: 10px;
        }
      }
    }

    .filter-type-box {
      display: flex;
      height: 35px;
      line-height: 35px;
      margin-top: 15px;
      border-top: 1px solid #E0E6ED;
      border-bottom: 1px solid #E0E6ED;
      padding-left: 20px;
      font-size: 13px;
      font-weight: 400;
      color: #A3A3A3;

      .filter-type-item {
        padding: 0 8px;
        margin-right: 20px;
        position: relative;
        font-weight: 600;
        cursor: pointer;
      }

      .filter-type-item-active {
        color: #9E0AED;

        &:before {
          width: 100%;
          height: 2px;
          background-color: #9E0AED;
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
        }
      }
    }

    .list-table {
      /deep/ .el-table th, .el-table thead tr {
        background-color: #fff;
        border: none;
      }

      .successText {
        color: #64C300;
      }

      .computedText {
        color: #F7B500;
      }

      .failedText {
        color: #FA6400;
      }

      .suspendText {
        color: #FA6400;
      }

      .profileName {
        font-size: 12px;
        font-weight: 600;
        color: #3A3A3A;
        margin-left: 5px;
        cursor: pointer;
      }

      .operation-item {
        display: inline-block;
        padding: 0 3px;
        height: 24px;
        line-height: 24px;
        border-radius: 2px;
        border: 1px solid #E0E6ED;
        font-size: 12px;
        color: #333;
        font-weight: 400;
        margin-right: 3px;
        cursor: pointer;

        .icon-class {
          position: relative;
          top: -1px;
        }
      }
    }
  }
  .enjoy-content{
    /deep/ .el-input{
      width: 200px;
    }
    /deep/ .el-input__inner{
      width: 200px;
      margin-bottom: 10px;
    }
    /deep/ .el-input__prefix{
      height: 43px;
    }
    /deep/ .el-input__suffix{
      height: 43px;
    }
  }
  .computed-content{
    /deep/ .el-input{
      width: 200px;
    }
    /deep/ .el-input__inner{
      width: 200px;
      margin-bottom: 10px;
    }
    /deep/ .el-input__prefix{
      height: 43px;
    }
    /deep/ .el-input__suffix{
      height: 43px;
    }
    .operation-item {
      display: inline-block;
      width: 52px;
      height: 24px;
      line-height: 24px;
      border-radius: 2px;
      border: 1px solid #E0E6ED;
      font-size: 12px;
      color: #333;
      font-weight: 400;
      margin-right: 10px;
      cursor: pointer;

      .icon-class {
        position: relative;
        top: -1px;
        margin-left: 3px;
      }
    }
  }

  .tools-box {
    width: 74px;
    background: #FFFFFF;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.17);
    font-size: 12px;
    font-weight: 400;
    color: #424242;
    //position: absolute;
    //top: 30px;
    //right: 0;
    //z-index: 100;

    div {
      border-bottom: 1px solid #E0E6ED;
      padding: 8px 0;
      text-align: center;
      &:hover {
        background-color: rgba(158, 10, 237, 0.27);
        font-size: 14px;
        font-weight: 500;
        color: #fff;
      }
    }
  }

  .class-content {
    display: flex;
    height: 40px;
    justify-content: center;

    p {
      line-height: 40px;
      padding-right: 5px;
    }
  }
</style>
<style>
.tools {
  padding: 0;
}
</style>
