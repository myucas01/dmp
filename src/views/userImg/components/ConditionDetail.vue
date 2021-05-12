<template>
  <div class="filter_wrap">
    <div v-if="rulesParams && createType === 'diy'" class="filter-class-box">
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
        <h1><span class="required-class">创建画像的分类</span><span class="describle-txt">{{ rulesParams.typeName }}</span></h1>
      </div>
      <!-- 画像分类  -->
      <div v-if="!filterOpenClass" class="filter-class-content">
        <div class="class-box">{{ rulesParams.typeName }}</div>
      </div>
    </div>
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
        <h1>
          <span class="required-class">画像人群的筛选条件</span>
          <span v-if="filterNumber" class="describle-txt">已选{{ filterNumber }}个条件</span>
        </h1>
      </div>
      <div v-show="!filterOpenStatus" class="content">
        <!-- 筛选 主体  -->
        <div
          v-if="rulesParams && createType === 'diy'"
          class="filter_box"
          :class="{ filter_wrap_border: rulesParams.nodes.length > 1 }"
        >
          <span v-if="rulesParams.nodes.length > 1" class="relations">{{
            rulesParams.relation | relationTxt
          }}</span>
          <ul class="filter-uls">
            <li
              v-for="(item, index) of rulesParams.nodes"
              :key="index"
              class="filter-lis"
              :class="{ borderClass: item.nodes.length > 1 }"
            >
              <span v-if="item.nodes.length > 1" class="relations">{{
                item.relation | relationTxt
              }}</span>
              <div
                v-for="(nodeItem, nodeIndex) in item.nodes"
                :key="nodeIndex"
                class="lis_item"
              >
                <span class="number">{{ nodeItem.name }}</span>
                <div class="params_left el-icon-date">
                  <span style="font-size: 12px;">{{ nodeItem.date | dateFilter }}</span>
                </div>
                <div class="params_right">
                  <div
                    v-for="(childItem, childIndex) in nodeItem.children"
                    :key="childIndex"
                    class="params_right_lis"
                  >
                    <!-- 关联关系 -->
                    <div class="function">{{ childItem.relationName }}</div>
                    <!-- 大类 -->
                    <div class="params_class">{{ childItem.className }}</div>
                    <div style="display: flex">
                      <!-- 值 -->
                      <div class="params_val">{{ childItem.labelName }}</div>
                      <!--值对应关联关系 -->
                      <div v-if="childItem.typeRelation && childItem.classLabelNo === 'U001'" class="val_function">
                        {{ childItem.typeRelationName }}
                      </div>
                      <!-- 货对应 -->
                      <div v-if="childItem.typeRelation" class="params_good">
                        <!-- 非区间 -->
                        <div
                          v-if="childItem.typeRelation !== '7' && childItem.classLabelNo === 'U001' "
                          class="params_good_single"
                          :data-id="childItem.typeRelation"
                        >
                          {{ childItem.value0 }}
                        </div>
                        <!-- 区间 -->
                        <div
                          v-if="childItem.typeRelation == 7 && childItem.classLabelNo === 'U001' "
                          class="interval_val"
                        >
                          <div>{{ childItem.value0 }}</div>
                          <span>至</span>
                          <div>{{ childItem.value1 }}</div>
                        </div>
                        <span v-if="childItem.classLabelNo === 'U001' ">次</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div v-if="createType === 'file'" class="filter_box filter_file">
          <div class="times">
            {{ rulesParams.upload.startTime }} | {{ rulesParams.upload.endTime }}
          </div>
          <div class="file_info">
            <img src="@/assets/img/userImg/excel@2x.png" alt="">
            <p>{{ rulesParams.upload.filePath }}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 画像创建时间  -->
    <div v-if="rulesParams && createType === 'diy'" class="filter-time">
      <div class="filter-time-header">
        <img
          v-if="filterOpenTime"
          src="@assets/img/userImg/filterClose.png"
          @click="filterOpenTime = !filterOpenTime"
        >
        <img
          v-if="!filterOpenTime"
          src="@assets/img/userImg/filterOpen.png"
          @click="filterOpenTime = !filterOpenTime"
        >
        <h1><span class="required-class">画像计算时间</span> <span class="describle-txt">{{ computedTime }}</span></h1>
      </div>
      <div v-if="!filterOpenTime" class="filter-time-content">
        <div class="time-box">
          <i class="el-icon-date" />
          <span>{{ rulesParams.calculateDate | dateFilter }}</span>
        </div>
      </div>
    </div>
    <!-- 品类画像  -->
    <div v-if="rulesParams && createType === 'diy'" class="filter-category">
      <div class="filter-time-header">
        <img
          v-if="filterOpenCategory"
          src="@assets/img/userImg/filterClose.png"
          @click="filterOpenCategory=!filterOpenCategory"
        >
        <img
          v-if="!filterOpenCategory"
          src="@assets/img/userImg/filterOpen.png"
          @click="filterOpenCategory=!filterOpenCategory"
        >
        <h1>品类画像 <span class="describle-txt">{{ rulesParams.goodsCategoryName }}</span></h1>
      </div>
      <div v-if="!filterOpenCategory" class="filter-time-content filter-category-content">
        <div class="class-box">{{ rulesParams.goodsCategoryName }}</div>
      </div>
    </div>
    <!-- 复制画像  -->
    <el-button v-if="rulesParams && createType === 'diy'" type="primary" @click="editUserImg">修改并创建</el-button>
  </div>
</template>
<script>
export default {
  name: 'FilterDetail',
  filters: {
    relationTxt(val) {
      const relationTxtMap = {
        '8': '且',
        '9': '或'
      }
      return relationTxtMap[val]
    },
    dateFilter(val) {
      const reg = /\|/g
      if (val) {
        if (reg.test(val)) {
          return val
        } else {
          if (val < 0) {
            return `近${Math.abs(val)}天`
          } else {
            return `后${Math.abs(val)}天`
          }
        }
      } else {
        return '缺失日期'
      }
    }
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['filterData', 'filterNumber', 'computedTime'],
  data() {
    return {
      filterOpenStatus: false, // 筛选条件展开状态
      rulesParams: '',
      value: '',
      createType: '',
      filterOpenClass: false,
      filterOpenCategory: false,
      filterOpenTime: false
    }
  },
  watch: {
    filterData() {
      this.rulesParams = this.filterData ? JSON.parse(this.filterData) : ''
      if (this.rulesParams) {
        if ('upload' in this.rulesParams) {
          this.createType = 'file'
        } else {
          this.createType = 'diy'
        }
      }
    }
  },
  methods: {
    /**
     * 编辑并重新生产一个 画像
     */
    editUserImg() {
      if (this.$route.query.id) {
        this.$router.push(`/userImg/createByCondition?editId=${this.$route.query.id}`)
      }
    }
  }
}
</script>

<style scoped lang="less">
.diyElementSelect(@val) {
  /deep/ .el-input {
    width: @val;
  }
}
.font{
  font-size: 12px;
  color: #333333c9;
}
.content{
  .el-button {
    height: 32px;
    display: flex;
    align-items: center;
  }
}

.filter_wrap {
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
}
.describle-txt{
  font-size: 12px;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
  margin-left: 3px;
}
.filter_box {
  position: relative;
  margin: 15px;

  .relations {
    display: inline-block;
    width: 20px;
    height: 20px;
    background: rgba(226, 189, 248, 1);
    border-radius: 2px;
    font-size: 13px;
    color: #930cea;
    text-align: center;
    line-height: 20px;
    font-weight: 500;
    position: absolute;
    top: 50%;
    left: -10px;
    margin-top: -10px;
    cursor: pointer;
    z-index: 10;
  }

  .filter-uls {
    /*margin-left: 40px;*/
  }
  .filter-lis {
    position: relative;
    margin-bottom: 10px;

    &:last-child {
      margin-bottom: 0;
    }

    .lis_item {
      display: flex;
      position: relative;
      margin-bottom: 10px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .number {
      display: inline-block;
      width: 18px;
      height: 18px;
      background: rgba(147, 12, 234, 1);
      border-radius: 2px;
      text-align: center;
      line-height: 18px;
      color: #fff;
      margin-right: 10px;
      position: relative;
      top: 6px;
    }

    .operating {
      display: flex;
      height: 40px;
      position: absolute;
      top: 0;
      right: 10px;
      align-items: center;

      .add {
        font-size: 12px;
        font-weight: 400;
        color: rgba(109, 114, 120, 1);

        img {
          display: inline-block;
          width: 14px;
        }
      }

      .reduce {
        display: inline-block;
        width: 12px;
        height: 12px;
        margin-left: 20px;
        position: relative;
        top: 1px;
      }
    }

    .params_left {
      height: 30px;
      width: 220px;
      background: rgba(255, 255, 255, 1);
      border-radius: 4px;
      border: 1px solid rgba(221, 222, 225, 1);
      line-height: 30px;
      margin-right: 10px;
      padding-left: 10px;
      span {
        margin-left: 12px;
      }
    }
    .params_right {
       .font;
      &_lis {
        flex: 1;
        display: flex;
        margin-bottom: 10px;
        height: 30px;

        &:last-child {
          margin-bottom: 0;
        }
      }

      .function {
        width: 50px;
        height: 30px;
        background: rgba(255, 255, 255, 1);
        border-radius: 4px;
        border: 1px solid rgba(221, 222, 225, 1);
        text-align: center;
        line-height: 30px;
        margin-right: 10px;
      }

      .params_val {
        width: 230px;
        height: 30px;
        background: rgba(255, 255, 255, 1);
        border-radius: 4px;
        border: 1px solid rgba(221, 222, 225, 1);
        text-align: center;
        line-height: 30px;
        margin-right: 10px;
      }
    }

    .val_function {
      width: 70px;
      height: 30px;
      background: rgba(255, 255, 255, 1);
      border-radius: 4px;
      border: 1px solid rgba(221, 222, 225, 1);
      text-align: center;
      line-height: 30px;
      margin-right: 10px;
    }

    .params_good {
      display: flex;
      height: 30px;
      align-items: center;
      &_single {
        width: 50px;
        height: 30px;
        background: rgba(255, 255, 255, 1);
        border-radius: 4px;
        border: 1px solid rgba(221, 222, 225, 1);
        text-align: center;
        line-height: 30px;
        margin-right: 10px;
      }
      .interval_val {
        display: flex;
        align-items: center;
        div {
          width: 50px;
          height: 30px;
          background: rgba(255, 255, 255, 1);
          border-radius: 4px;
          border: 1px solid rgba(221, 222, 225, 1);
          text-align: center;
          line-height: 30px;
          margin-right: 10px;
        }
        span {
          margin-right: 10px;
        }
      }
    }
  }

  .add_child_rules {
    display: flex;
    align-items: center;
    margin-left: 10px;
    cursor: pointer;

    img {
      display: inline-block;
      width: 12px;
      height: 12px;
    }

    span {
      font-size: 12px;
      font-weight: 400;
      color: rgba(109, 114, 120, 1);
      margin-left: 3px;
    }
  }

  .delete_filter {
    display: inline-block;
    width: 12px;
    height: 12px;
    position: relative;
    top: 14px;
    margin-left: 10px;
    cursor: pointer;
  }

  .borderClass {
    border-left: 1px solid #e2bdf8;

    .lis_item {
      padding-left: 20px;
    }
  }
}

.filter_wrap_border {
  border-left: 1px solid #e2bdf8;
  padding: 0 20px;
}

.params_class {
  width: 50px;
  height: 30px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  border: 1px solid rgba(221, 222, 225, 1);
  text-align: center;
  line-height: 30px;
  margin-right: 10px;
}
.filter_file {
  display: flex;
  align-items: center;
  .times {
    width: 230px;
    height: 35px;
    border: 1px solid #dddee1ff;
    text-align: center;
    line-height: 35px;
    border-radius: 4px;
  }
  .file_info {
    display: flex;
    align-items: center;
    margin-left: 10px;
    img {
      display: inline-block;
      width: 38px;
      height: 38px;
    }
    p {
      margin-bottom: 0;
      margin-left: 5px;
    }
  }
}
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
.filter-class-box{
  margin-bottom: 10px;
  .filter-class-header{
    .header;
  }
  .filter-class-content{
    display: flex;
    height: 60px;
    align-items: center;
    justify-items: center;
    border-radius: 4px;
    h5{
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
    /deep/ .el-input__icon{
      line-height: 32px;
    }
    .class-box{
      width: 192px;
      height: 32px;
      background: #FFFFFF;
      border-radius: 4px;
      border: 1px solid #DDDEE1;
      line-height: 32px;
      text-indent: 10px;
      font-size:12px;
    }
  }
}
.filter-time{
  margin-top: 10px;
  .filter-time-header{
    .header;
  }
  .filter-time-content{
    display: flex;
    height: 60px;
    align-items: center;
    justify-items: center;
    border-radius: 4px;
    h5{
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
      padding: 0 10px;
    }
    /deep/ .el-input__icon{
      line-height: 32px;
    }
    .time-box{
      width: 260px;
      height: 32px;
      line-height: 32px;
      background: #FFFFFF;
      border-radius: 4px;
      border: 1px solid #DDDEE1;
      padding: 0 10px;
      i{
        margin-right: 5px;
      }
    }
  }
}
.filter-category{
  .filter-time;
  .filter-category-content{
    /deep/ .el-input__inner {
      width: 192px;
      height: 32px;
      background: #FFFFFF;
      border-radius: 4px;
      border: 1px solid #DDDEE1;
    }
    .class-box{
      width: 192px;
      height: 32px;
      background: #FFFFFF;
      border-radius: 4px;
      border: 1px solid #DDDEE1;
      line-height: 32px;
      text-indent: 10px;
    }
  }
}
.required-class{
  position: relative;
  &:after{
    content: "*";
    color: #f56c6c;
    margin-right: 4px;
  }
}
</style>
