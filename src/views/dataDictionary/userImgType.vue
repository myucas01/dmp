<!--画像类型-->
<template>
  <div class="userType-box">
    <div class="userType-header">
      <p>画像类型</p>
      <el-button type="primary" icon="el-icon-plus" @click="dialogVisible = true">新增</el-button>
    </div>
    <div class="userType-content">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column
          prop="categoryName"
          label="画像类型"
        >
          <template slot-scope="scope">
            <span v-if="!scope.row.editBoolean">{{ scope.row.categoryName }}</span>
            <el-input v-if="scope.row.editBoolean" v-model="scope.row.categoryName" class="name-input" placeholder="请输入内容" @keyup.enter.native="updateName(scope.row)" />
            <span v-if="!scope.row.editBoolean" class="edit-span" @click="scope.row.editBoolean = true"><svg-icon icon-class="bianji" /></span>
          </template>
        </el-table-column>
        <el-table-column
          prop="zip"
          label="排序"
        >
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.sort" :min="1" :max="10" label="描述文字" @keyup.enter.native="updateName(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="deleteType(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table></div>
    <el-dialog
      title="新增画像类型"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <div class="content">
        <el-input v-model="input" placeholder="请输入内容" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveData">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { userImgType, userImgTypeAdd, userImgTypeUpdate, userImgTypeDelete } from '@api/userImg'
export default {
  name: 'UserImgType',
  data() {
    return {
      tableData: [],
      input: '',
      dialogVisible: false
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    deleteType(id) {
      userImgTypeDelete(id)
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
    getList() {
      userImgType()
        .then(res => {
          if (res.code === 200) {
            this.tableData = res.data
            if (this.tableData && this.tableData.length > 0) {
              for (const item of this.tableData) {
                this.$set(item, 'editBoolean', false)
              }
            }
          }
        })
    },
    updateName(row) {
      userImgTypeUpdate({
        id: row.id,
        categoryName: row.categoryName,
        sort: row.sort
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
    saveData() {
      userImgTypeAdd({
        categoryName: this.input
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
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped lang="less">
  .userType-box{
  }
  .userType-header{
    height: 60px;
    position: relative;
    background-color: #fff;
    p{
      line-height: 60px;
      font-size: 16px;
      font-weight: 600;
      padding-left: 20px;
    }
    /deep/ .el-button {
      width: 200px;
      position: absolute;
      top: 10px;
      right: 20px;
    }
  }
  .userType-content{
    margin-top: 10px;
    background-color: #fff;
    .content-item{
      height: 40px;
    }
    .edit-span{
      cursor: pointer;
      margin-left: 10px;
    }
  }
</style>
