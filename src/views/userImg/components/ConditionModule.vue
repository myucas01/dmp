<!--筛选组件-->
<template>
  <div v-loading="loading" class="filter_wrap">
    <div class="filter-class-box">
      <div class="filter-class-header">
        <img
          v-if="filterOpenClass"
          src="@assets/img/userImg/filterClose.png"
          @click="filterOpenClass = !filterOpenClass"
        >
        <img
          v-if="!filterOpenClass"
          src="@assets/img/userImg/filterOpen.png"
          @click="filterOpenClass = !filterOpenClass"
        >
        <h1 class="required-class">选择创建画像的分类</h1>
      </div>
      <!-- 画像分类  -->
      <div class="filter-class-content">
        <h5>选择分类</h5>
        <el-select :key="updateKey" v-model="userImgTypeVal" placeholder="请选择">
          <el-option
            v-for="item in userImgTypeOptions"
            :key="item.categoryName"
            :label="item.categoryName"
            :value="item.id"
          />
        </el-select>
      </div>
    </div>
    <!-- 筛选主体  -->
    <div class="filter-content">
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
        <h1 class="required-class">选择画像人群的筛选条件</h1>
      </div>
      <div v-show="!filterOpenStatus" class="content">
        <h5 class="content_header">在 <strong>全部用户</strong> 中筛选
          <div class="add_filters" @click="addFilter">
            <img src="@assets/img/userImg/add@2x.png" alt="">
            <span style="margin-left:3px;">添加</span>
          </div>
        </h5>
        <!-- 筛选 主体  -->
        <div v-show="!filterOpenStatus" class="filter_box">
          <filer-content ref="filerChild" />
        </div>
      </div>
    </div>
    <!-- 画像创建时间  -->
    <div class="filter-time">
      <div class="filter-time-header">
        <img
          v-if="filterOpenStatus"
          src="@assets/img/userImg/filterClose.png"
        >
        <img
          v-if="!filterOpenStatus"
          src="@assets/img/userImg/filterOpen.png"
        >
        <h1 class="required-class">选择画像计算时间</h1>
      </div>
      <div :key="timeKey" class="filter-time-content">
        <h5>选择时间</h5>
        <date-time-picker v-model="intervalTime" style="width: 190px;" :time-option="timeOptions" />
      </div>
    </div>
    <!-- 品类画像  -->
    <div class="filter-category">
      <div class="filter-time-header">
        <img
          v-if="filterOpenStatus"
          src="@assets/img/userImg/filterClose.png"
        >
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
          v-model="userImgCategoryVal"
          :options="classImgOptions"
          :props="{checkStrictly: true,value: 'value',label: 'labelAlias',children: 'children'}"
          :show-all-levels="false"
        />
      </div>
    </div>
    <div class="footer">
      <el-button type="primary" @click="inquireData">查询</el-button>
    </div>
  </div>
</template>

<script>
import filerContent from './ConditionModuleChild'
import { createUserImg, userImgType, userImgCategory } from '@api/userImg'
import DateTimePicker from '../../common/DateTimePicker'

export default {
  name: 'FilterComponent',
  components: {
    filerContent,
    DateTimePicker
  },
  props: {
    name: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      datePickerShow: false,
      vals: ['2020/08/11', '2020/11/21'],
      loading: true,
      filterOpenStatus: false, // 筛选条件展开状态
      filterOpenClass: false,
      userImgTypeVal: '',
      userImgCategoryVal: '',
      intervalTime: {},
      userImgTypeOptions: [],
      userImgCategoryOptions: [],
      timeKey: new Date().getTime(),
      timeOptions: [],
      updateKey: new Date().getTime(),
      classImgOptions: []
    }
  },
  async mounted() {
    this.getUserImgType()
    this.getuserImgCategory()
    let localData = await localStorage.getItem('labelTree')
    localData = JSON.parse(localData)
    this.timeOptions = localData.labelDates
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
    // 获取画像品类
    getuserImgCategory() {
      userImgCategory()
        .then(res => {
          if (res.code === 200) {
            this.userImgCategoryOptions = res.data
          }
        })
    },
    /**
     * 添加 一级大类规则
     */
    addFilter() {
      this.$refs.filerChild.addRuleFirst()
    },
    // 发起查询
    async inquireData() {
      const subData = JSON.parse(JSON.stringify(this.$refs.filerChild.rulesParams))
      if (subData.nodes.length === 0) {
        this.$message({
          message: '请添加筛选条件',
          type: 'warning'
        })
        return
      }
      subData.profileName = this.name
      // 处理数据
      if (subData.relation === 'and') {
        subData.relation = 8
      } else {
        subData.relation = 9
      }

      for (const firstItem of subData.nodes) {
        if (firstItem.relation === 'and') {
          firstItem.relation = 8
        } else {
          firstItem.relation = 9
        }
        firstItem['must_filter'] = false
        for (const secondItem of firstItem.nodes) {
          secondItem.date = secondItem.date.key
          delete secondItem.classOption
          for (const thirdItem of secondItem.children) {
            delete thirdItem.basicData
            delete thirdItem.propsOption
            delete thirdItem.setVal
            delete thirdItem.showVal
            if (thirdItem.type) {
              const typeData = typeof thirdItem.type === 'object' ? thirdItem.type[thirdItem.type.length - 1].split('$') : thirdItem.type.split('$')

              thirdItem.type = typeData[3]
              thirdItem['labelId'] = typeData[0]
              thirdItem['labelNo'] = typeData[1]
              thirdItem['level'] = typeData[2]
              thirdItem['labelName'] = typeData[4]
            } else {
              firstItem['must_filter'] = true
            }
          }
        }
      }
      subData.nodes = subData.nodes.filter(item => !item['must_filter'])
      subData['calculateDate'] = this.intervalTime ? this.intervalTime.value : ''// 画像计算时间
      // 画像 品类
      console.info(this.userImgCategoryVal)
      if (this.userImgCategoryVal && this.userImgCategoryVal.length > 0) {
        const userImgCategoryVal = this.userImgCategoryVal[this.userImgCategoryVal.length - 1].split('$')
        subData['goodsCategoryName'] = userImgCategoryVal[4]
        subData['goodsCategory'] = userImgCategoryVal[0]
      }
      // 画像 分类
      const chooseType = this.userImgTypeOptions.filter(item => item.id === this.userImgTypeVal)
      subData['type'] = this.userImgTypeVal // 画像 分类
      subData['typeName'] = chooseType && chooseType.length > 0 ? chooseType[0].categoryName : ''// 画像 分类
      if (!subData.type) {
        this.$message({
          message: '画像类型不能为空',
          type: 'warning'
        })
        return
      }
      if (subData.length === 0) {
        this.$message({
          message: '参数不能为空',
          type: 'warning'
        })
        return
      }
      if (!subData.calculateDate) {
        this.$message({
          message: '画像计算时间参数不能为空',
          type: 'warning'
        })
        return
      }
      this.createImg(subData)
    },
    // 创建画像
    createImg(data) {
      const _this = this
      if (!data) {
        return
      }
      createUserImg(data)
        .then(res => {
          if (res.code === 200) {
            _this.$message({
              message: '数据提交成功，结果计算中...',
              type: 'success'
            })
            _this.$router.push('/userImg/index')
          } else {
            this.$message.error(res.description)
          }
        })
        .catch(err => console.log(err))
    }
  }
}
</script>

<style scoped lang="less">
.filter_wrap {
  width: 1005px;

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
        position: relative;
        top: -1px;
      }

      span {
        font-size: 12px;
        font-weight: 600;
        color: rgba(51, 51, 51, 1);
      }
    }
  }

  .filter_box {
    &_relation {
      display: inline-block;
      width: 20px;
      height: 20px;
      background: rgba(226, 189, 248, 1);
      border-radius: 2px;
      font-size: 13px;
      color: #930CEA;
      text-align: center;
      line-height: 20px;
      font-weight: 500;
      position: absolute;
      top: 50%;
      left: -10px;
      margin-top: -10px;
    }
  }

  .filter-class-box {
    margin-bottom: 10px;

    .filter-class-header {
      .header;
    }

    .filter-class-content {
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
        width: 192px;
        height: 32px;
        background: #FFFFFF;
        border-radius: 4px;
        border: 1px solid #DDDEE1;
      }

      /deep/ .el-input__icon {
        line-height: 32px;
      }
    }
  }

  .filter-time {
    margin-top: 10px;

    .filter-time-header {
      .header;
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
  }

  .filter-category {
    .filter-time;

    .filter-category-content {
      /deep/ .el-input__inner {
        width: 192px;
        height: 32px;
        background: #FFFFFF;
        border-radius: 4px;
        border: 1px solid #DDDEE1;
        padding: 0 10px;
      }
    }
  }

  .footer {
    margin-top: 30px;
  }
}

.required-class {
  position: relative;

  &:after {
    content: "*";
    color: #f56c6c;
    margin-right: 4px;
  }
}
</style>
