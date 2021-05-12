<template>
  <div style="min-width:1300px;overflow:auto;">
    <div class="InfoBox">
      <div class="title">
        <em />
        <span>{{ info.profileName }}</span>
      </div>
      <div style="margin-top:10px;padding-left: 20px">
        <!--筛选条件-->
        <condition-detail :filter-data="filterData" :filter-number="filterNumber" :computed-time="computedTime" />
      </div>
    </div>
    <draw-info ref="drawInfo" :list="list" :info="info" />
  </div>
</template>

<script>
import { userImgDetail } from '@api/userImg'
import drawInfo from './components/DrawInfo'
import ConditionDetail from './components/ConditionDetail'
export default {
  components: {
    drawInfo,
    ConditionDetail
  },
  data() {
    return {
      info: {
        statisticsTime: '',
        profileName: '',
        profileNo: '',
        filterData: '',
        percentage: '',
        subTotal: '',
        total: '',
        fileName: ''
      },
      checkList: [],
      createYes: true,
      list: [],
      id: '',
      ageChartType: 1,
      filterData: '',
      filterNumber: '',
      profileId: '',
      computedTime: ''
    }
  },
  computed: {
  },
  mounted() {
    this.id = this.$route.query.id
    this.getUserImgDetail()
  },
  methods: {
    handleCheckedChange(val) {},
    goCompare() {
      this.$router.push('/userDrawIndex/userDrawCompare')
    },
    getUserImgDetail() {
      userImgDetail(this.id)
        .then(res => {
          if (res.code === 200) {
            this.info = {
              statisticsTime: res.data ? res.data.statisticsTime : '',
              profileName: res.data ? res.data.profileName : '',
              profileNo: res.data ? res.data.profileNo : '',
              filterData: res.data ? res.data.requestJson : ''
            }
            this.filterData = res.data ? res.data.requestJson : ''
            this.computedTime = res.data ? `${res.data.calStartDate}~${res.data.calEndDate}` : ''
            const dataResultVoList = res.data ? res.data.dataResultVoList : ''
            this.filterNumber = res.data ? res.data.filter : ''
            this.profileId = res.data ? res.data.profileId : ''
            if (res.data && res.data.peopleNumVo) {
              this.info = {
                ...this.info,
                percentage: res.data.peopleNumVo.percentage,
                subTotal: res.data.peopleNumVo.subTotal,
                total: res.data.peopleNumVo.total,
                statisticsTime: res.data.statisticsTime,
                fileName: res.data.fileName
              }
            }

            this.$set(this, 'list', dataResultVoList)
            this.$nextTick(function() {
              this.$refs.drawInfo.getTitleList(this.id)
            })
          }
        })
    }
  }
}
</script>

<style lang="less"  scoped>
  .f12{
    font-size: 12px;
  }
  .f14{
    font-size: 14px;
  }
  .f18{
    font-size: 18px;
  }
  .color99{
      color:#999999FF;
  }
  .color33{
    color: #333333;
  }
  .pl10{
    padding-left: 10px;
  }
  .title{
    display: flex;
    align-items: center;
    em{
      display: inline-block;width: 3px;height: 16px;background-color: #930CEAFF
    }
    span{
      font-size: 16px;color: #333333FF;margin-left: 5px;font-weight: bolder
    }

  }
  .InfoBox{
    padding: 20px 10px;
    margin-bottom: 10px;
    .peopleNum{
      border: 1px solid #DDDEE1FF;
      border-radius: 3px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      margin-top: 10px;
      .leftItem{
        display: flex;
        align-items: center;
        .num{
          margin-left: 10px;
          i{
            color: #B8B8B8FF;
            font-size: 12px;
          }
        }
      }
      .rightItem{
        p{
          margin-bottom: 10px;
          color: #999999FF;
        }
      }
    }
    .grid-content{
      margin-right: 5px;
      margin-top: 5px;
      border: 1px solid #DDDEE1FF ;
      border-radius: 3px;
      /*width: 350px;*/
      height: 280px;
      .chartTitle{
        padding: 5px;
        display: flex;
        justify-content: space-between;
        span{
          font-size: 12px;
          .active{
            color: #930CEA;
          }
        }
      }
      .chartBox{
        padding: 10px;
      }
    }
  }
  .InfoBox{
    padding: 20px 10px;
    background: #fff;
    margin-bottom: 10px;
    .peopleNum{
      border: 1px solid #DDDEE1FF;
      border-radius: 3px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      margin-top: 10px;
      .leftItem{
        display: flex;
        align-items: center;
        .num{
          margin-left: 10px;
          i{
            color: #B8B8B8FF;
            font-size: 12px;
          }
        }
      }
      .rightItem{
        p{
          margin-bottom: 10px;
          color: #999999FF;
        }

      }
    }
    .addBtn{
      text-align: center;
      line-height: 280px;
      color: #ccc;
      font-size: 20px;
      i{
        margin-right: 5px;
      }
    }
    .grid-content{
      margin-right: 5px;
      margin-top: 5px;
      border: 1px solid #DDDEE1FF ;
      border-radius: 3px;
      /*width: 350px;*/
      height: 300px;
      &:hover{
        border-color: #930CEA;
        cursor: pointer;
        &.addBtn{
          color: #930CEA;
        }
        .right{
          i{
            color: #930CEA;
          }
        }
      }
      .chartTitle{
        padding: 5px;
        display: flex;
        justify-content: space-between;
        span{
          font-size: 12px;
          .active{
            color: #930CEA;
          }
        }
        .right{
          i{
            cursor: pointer;
            &:hover{
              color: #930CEA;
            }
          }
        }
      }
      .chartBox{
        padding: 10px;
        height: 230px;
      }
    }

  }
</style>
