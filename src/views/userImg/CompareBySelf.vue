<!--同人对比详情页-->
<template>
  <div class="compare_detail_wrap">
    <!-- 筛选条件-->
    <div class="InfoBox">
      <div class="title">
        <em />
        <span>{{ name }}</span>
      </div>
      <div style="margin-top: 10px; padding-left: 20px">
        <!--筛选条件-->
        <filter-detail
          :filter-data="filterData"
          :filter-number="filterNumber"
        />
      </div>
    </div>
    <div class="content">
      <div class="title">
        <div>
          <em />
          <span class="tf">画像对比</span>
        </div>
        <div>
          <el-button
            size="small"
            type="primary"
            icon="el-icon-plus"
            @click="openDialog"
          >新增画像</el-button>
          <!--<el-button size="small" type="primary" icon="el-icon-download" @click="downImg">下载</el-button>-->
        </div>
      </div>
      <div class="content_main">
        <div class="content_main_progress">
          <div class="progress_box">
            <el-progress
              type="circle"
              :percentage="peopleNumVo.percentage?peopleNumVo.percentage:0"
              :color="customColor"
              :width="62"
            />
            <div class="num">
              <p class="f18 fWeight">{{ peopleNumVo.subTotal }} <span class="f12">万人</span></p>
              <p class="f12 color99">在 全部用户 {{ peopleNumVo.total }}万人中占比{{ peopleNumVo.percentage }}%</p>
            </div>
          </div>
        </div>
        <div class="content_main_time">
          <el-row :gutter="24">
            <el-col
              v-for="item of dateList"
              :key="item.profileId"
              :span="8"
            ><div class="grid-content bg-purple">
              {{ item.startTime }}至{{ item.endTime }}
            </div></el-col>
          </el-row>
        </div>
        <div>
          <compare-list ref="compare" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import filterDetail from './components/ConditionDetail'
import compareList from './components/CompareList'
import { userImgDetail, userImgDetailMutiple } from '@api/userImg'
export default {
  name: 'CompareDetail',
  components: {
    filterDetail,
    compareList
  },
  filters: {
    filterTimes(val) {
      if (val) {
        if (val.startsWith('同人对比')) {
          return val.substring(5)
        } else {
          return '默认'
        }
      } else {
        return val
      }
    }
  },
  data() {
    return {
      customColor: [
        { color: '#866CEDFF', percentage: 20 },
        { color: '#866CEDFF', percentage: 40 },
        { color: '#866CEDFF', percentage: 60 },
        { color: '#866CEDFF', percentage: 80 },
        { color: '#866CEDFF', percentage: 100 }
      ],
      name: '',
      dateList: [],
      peopleNumVo: '',
      filterData: '', // 筛选条件数据
      filterNumber: '', // 筛选条件数量
      dialogFormVisible: false
    }
  },
  mounted() {
    this.getDetailData()
    this.getUserImgDetail()
  },
  methods: {
    getUserImgDetail() {
      const ids = this.$route.query.profileNo + ',' + this.$route.query.ids
      userImgDetailMutiple({
        profileNo: ids
      }).then((res) => {
        if (res.code === 200) {
          this.dateList = res.data.itemDateList
        }
      })
    },
    // 获取详情数据
    async getDetailData() {
      const result = await userImgDetail(this.$route.query.profileNo)
      if (result.code === 200) {
        const ids = this.$route.query.profileNo + ',' + this.$route.query.ids
        console.log(result.data)
        this.$refs.compare.getTitleList(ids)
        this.peopleNumVo = result.data.peopleNumVo
        this.name = result.data.profileName
        this.filterData = result.data.requestJson
        this.filterNumber = result.data.filter
      }
    },
    openDialog() {
      this.$refs.compare.dialogFormVisible = true
    },
    downImg() {}
  }
}
</script>

<style scoped lang="less">
.f18 {
  font-size: 18px;
}
.f12 {
  font-size: 12px;
}
.f14 {
  font-size: 14px;
}
.fWeight {
  font-weight: bolder;
}
.compare_detail_wrap {
  min-height: calc(100vh - 80px);
  background-color: #fff;
  .InfoBox {
    padding: 20px 10px;
    margin-bottom: 10px;
    .peopleNum {
      border: 1px solid #dddee1ff;
      border-radius: 3px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      margin-top: 10px;
      .leftItem {
        display: flex;
        align-items: center;
        .num {
          margin-left: 10px;
          i {
            color: #b8b8b8ff;
            font-size: 12px;
          }
        }
      }
      .rightItem {
        p {
          margin-bottom: 10px;
          color: #999999ff;
        }
      }
    }
    .grid-content {
      margin-right: 5px;
      margin-top: 5px;
      border: 1px solid #dddee1ff;
      border-radius: 3px;
      /*width: 350px;*/
      height: 280px;
      .chartTitle {
        padding: 5px;
        display: flex;
        justify-content: space-between;
        span {
          font-size: 12px;
          .active {
            color: #930cea;
          }
        }
      }
      .chartBox {
        padding: 10px;
      }
    }
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
  .content {
    padding: 10px;
    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #dddee1;
      padding-bottom: 5px;
      margin-bottom: 5px;
      em {
        display: inline-block;
        width: 3px;
        height: 16px;
        background-color: #930ceaff;
      }
      .tf {
        font-size: 16px;
        color: #333333ff;
        margin-left: 5px;
        font-weight: bolder;
        margin-right: 10px;
      }
    }
    .content_main {
      &_progress {
        padding: 10px;
        border-radius: 4px;
        border: 1px solid rgba(221, 222, 225, 1);
        .progress_box {
          display: flex;
          width: 300px;
          margin: 0 auto;
          .num {
            margin-left: 10px;
            margin-top: 10px;
            i {
              color: #b8b8b8ff;
              font-size: 12px;
            }
          }
        }
      }
      &_time {
        margin-top: 10px;
        .grid-content {
          height: 30px;
          line-height: 30px;
          text-align: center;
          background: rgba(255, 255, 255, 1);
          border-radius: 4px;
          border: 1px solid rgba(109, 212, 0, 1);
          font-size: 16px;
          font-weight: 600;
          color: rgba(51, 51, 51, 1);
        }
        /deep/ .el-col {
          &:nth-child(3n + 1) {
            .grid-content {
              border: 1px solid rgba(109, 212, 0, 1);
            }
          }
          &:nth-child(3n + 2) {
            .grid-content {
              border: 1px solid rgba(247, 181, 0, 1);
            }
          }
          &:nth-child(3n + 3) {
            .grid-content {
              border: 1px solid rgba(50, 197, 255, 1);
            }
          }
        }
      }
    }
  }
}
</style>
