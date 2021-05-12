<template>
  <div class="log-wrap">
    <div class="header">
      <h5 class="title">日志管理</h5>
      <button class="down-btn"  @click="exportLog">
        <svg-icon icon-class="downIcon"/>
        下载日志
      </button>
    </div>
    <div class="content">
      <el-table
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column
          prop="logNo"
          label="日志ID"
        />
        <el-table-column
          prop="operate"
          label="事件名"
        />
        <el-table-column
          prop="content"
          label="事件描述"
        />
<!--        <el-table-column-->
<!--          prop="model"-->
<!--          label="模块"-->
<!--        />-->
        <el-table-column
          prop="userName"
          label="操作人"
        />
        <el-table-column
          prop="createTime"
          label="记录时间"
        />
      </el-table>
      <div class="pages-box">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[30, 80, 100, 200]"
          :page-size="pageSizes"
          layout="total, sizes, prev, pager, next"
          :total="total"/>
      </div>
    </div>
  </div>
</template>

<script>
import { logList, exportLog } from '@api/log'

export default {
  name: 'Index',
  data() {
    return {
      currentPage: 1,
      pageSizes: 30,
      total: 0,
      tableData: []
    }
  },
  mounted() {
    this.getLogList()
  },
  methods: {
    handleSizeChange(val) {
      this.pageSizes = val
      this.getLogList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getLogList()
    },
    getLogList() {
      logList({
        pageNum: this.currentPage,
        pageSize: this.pageSizes
      })
        .then(res => {
          if (res.code === 200) {
            this.tableData = res.data ? res.data.list : []
            this.total = res.data ? res.data.total : 0
          }
        })
    },
    exportLog() {
      const iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      iframe.style.height = 0
      iframe.src = exportLog()
      document.body.appendChild(iframe)
      setTimeout(() => {
        iframe.remove()
      }, 5 * 60 * 1000)
    }
  }
}
</script>

<style scoped lang="less">
.log-wrap {
  .header {
    display: flex;
    height: 40px;
    align-items: center;
    justify-content: space-between;

    .title {
      position: relative;
      font-size: 16px;
      font-weight: 600;
      color: #333333;
      padding-left: 10px;

      &:before {
        width: 3px;
        height: 16px;
        background-color: #930CEA;
        content: '';
        position: absolute;
        top: 5px;
        left: 0;
      }
    }

    .down-btn {
      background: #930CEA;
      border-radius: 4px;
      border: none;
      outline: none;
      font-size: 12px;
      font-weight: 600;
      color: #FFFFFF;
      padding: 7px;
      cursor: pointer;
    }
  }

  .content {
    padding: 10px 10px 102px 10px;
    background-color: #fff;
    position: relative;
  }

  .pages-box {
    position: absolute;
    bottom: 30px;
    right: 10px;
  }
}
</style>
