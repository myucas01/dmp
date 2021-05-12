<template>
  <div class="pages">
    <div class="InfoBox">
      <div class="title">
        <div>
          <em />
          <span class="tf">画像对比</span>
          <span class="f12 color99" />
        </div>
        <div>
          <el-button size="small" type="primary" icon="el-icon-plus" @click="openDialog">新增画像</el-button>
          <!--<el-button size="small" type="primary" icon="el-icon-download">下载</el-button>-->
        </div>
      </div>
      <div class="nameList listBox">
        <el-row>
          <el-col v-for="(item,index) in profileList" :key="item.id" :span="8">
            <div class="grid-content bg-purple" :class="{'color1':index==0,'color2':index==1,'color3':index==2,}">
              <h3>{{ item.profileName }}</h3>
              <div><span class="f12 color99">已选{{ item.filter }}个条件</span> <span class="f12 btn" @click="goDetail(item.profileNo)">查看</span></div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="peopleNum listBox">
        <div class="title">
          <div>
            <b class="f14">画像总人数对比</b>
            <el-tooltip class="item" effect="light" placement="right-start">
              <div slot="content" style="max-width: 200px;">条件筛选出的用户和用户表的用户加和后去重</div>
              <i class="el-icon-question f14 color99" />
            </el-tooltip>
          </div>
        </div>
        <el-row>
          <el-col v-for="(item,index) in totalList" :key="item.id" :span="8">
            <div class="leftItem grid-content bg-purple" :class="{'color1':index==0,'color2':index==1,'color3':index==2,}">
              <el-progress type="circle" :percentage="Number((item.percentage*100).toFixed(2))" :color="customColor" :width="62" />
              <div class="num">
                <p class="f18">{{ item.subTotal | currency }} <span class="f12">人</span></p>
                <p class="f12 color99">在 全部用户 {{ item.total | currency }}人中占比{{ item.percentage*100 | currency }}%</p>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <resultList ref="compare" />
  </div>
</template>

<script>
import resultList from './components/CompareList'
import { userImgDetailMutiple } from '@api/userImg'
export default {
  components: {
    resultList
  },
  data() {
    return {
      checkList: [],
      customColor: [
        { color: '#866CEDFF', percentage: 20 },
        { color: '#866CEDFF', percentage: 40 },
        { color: '#866CEDFF', percentage: 60 },
        { color: '#866CEDFF', percentage: 80 },
        { color: '#866CEDFF', percentage: 100 }
      ],
      nameList: [],
      dialogVisible: false,
      createYes: true,
      list: [],
      profileList: [],
      totalList: [],
      compareList: [],
      ids: ''
    }
  },
  computed: {
  },
  mounted() {
    this.ids = this.$route.query.ids
    this.getList()
  },
  methods: {
    goDetail(id) {
      this.$router.push('/userImg/detail?id=' + id)
    },
    handleCheckedChange(val) {
      console.log(val)
    },
    getList() {
      userImgDetailMutiple({ profileNo: this.ids })
        .then(res => {
          if (res.code === 200) {
            this.profileList = res.data.profileList
            this.totalList = res.data.totalList
            // const list = res.data
            console.log(this.info)
            const _this = this
            this.$nextTick(function() {
              setTimeout(function() {
                _this.$refs.compare.getTitleList(_this.ids)
              }, 100)
            })
          }
        })
    },
    create() {
      this.dialogVisible = true
      if (this.checkList.length !== 2 && this.checkList.length !== 3) {
        this.createYes = false
      } else {
        this.createYes = true
      }
    },
    openDialog() {
      this.$refs.compare.dialogFormVisible = true
    },
    goCompare() {
      this.$router.push('/userDrawIndex/userDrawCompare')
    }
  }
}
</script>

<style lang="less"  scoped>
.pages{
  min-width: 1300px;
  min-height: calc(100vh - 80px);
}
  .title{
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #DDDEE1;
    padding-bottom: 5px;
    margin-bottom: 5px;
    em{
      display: inline-block;width: 3px;height: 16px;background-color: #930CEAFF
    }
    .tf{
      font-size: 16px;color: #333333FF;margin-left: 5px;font-weight: bolder;
      margin-right: 10px;
    }
  }
  .InfoBox{
    padding: 10px;
    background: #ffffff;
    .peopleNum{
      border-radius: 3px;
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
    }
    .grid-content{
      margin-right: 5px;
      margin-top: 5px;
      border: 1px solid #DDDEE1FF ;
      border-radius: 3px;
      padding: 10px;
      .chartTitle{
        padding: 5px;
        display: flex;
        justify-content: space-between;
      }
      .chartBox{
        padding: 10px;
      }
      &.color1{
        border-color: #6DD400;
      }
      &.color2{
        border-color: #F7B500;
      }
      &.color3{
        border-color: #32C5FF;
      }
    }
  }

  .nameList{
    .grid-content{
      padding-top: 12px;
      padding-left: 10px;
      h3{
        font-size: 16px;
        color: #333333;
        font-weight: bolder;
      }
      .btn{
        cursor: pointer;
        color: #930CEA;
        border-bottom: 1px solid #930CEA;
      }
    }
  }
  .listBox{
    /*margin-top: 15px;*/
    background: #ffffff;
  }
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
  .el-icon-close{
    cursor: pointer;
  }
</style>
