<!--筛选组件主体-->
<template>
  <div
    v-show="rulesParams.nodes.length > 0"
    v-loading="loading"
    class="filter-wrap"
    :class="{'filter_wrap_border': rulesParams.nodes.length > 1}"
  >
    <span v-if="rulesParams.nodes.length > 1" class="relations" @click="changeRelation('all')">{{ rulesParams.relation | relationTxt }}</span>
    <ul class="filter-uls">
      <li
        v-for="(item, index) of rulesParams.nodes"
        :key="index"
        class="filter-lis"
        :class="{'borderClass': item.nodes.length > 1}"
      >
        <span v-if="item.nodes.length > 1" class="relations" @click="changeRelation('children',index)">{{ item.relation | relationTxt }}</span>
        <div v-for="(nodeItem, nodeIndex) in item.nodes" :key="nodeIndex" class="lis_item">
          <span class="number">{{ nodeItem.name }}</span>
          <div class="params_left">
            <date-time-picker v-model="nodeItem.date" style="width: 190px;" :time-option="timeOptions" />
          </div>
          <div class="params_right">
            <div v-for="(childItem, childIndex) in nodeItem.children" :key="childIndex" class="params_right_lis">
              <!-- 大类 -->
              <div class="params_class">
                <el-select
                  v-model="childItem.classLabelNo"
                  placeholder="请选择"
                  @change="classHandleChange($event, index, nodeIndex, childIndex)"
                  @focus="classHandleFocus($event, index, nodeIndex, childIndex)"
                >
                  <el-option
                    v-for="classOptionItem in nodeItem.classOption"
                    :key="classOptionItem.labelNo"
                    :label="classOptionItem.labelName"
                    :disabled="classOptionItem.disabled"
                    :value="classOptionItem.labelNo"
                  />
                </el-select>
              </div>
              <!-- 关联关系 -->
              <div class="function">
                <el-select
                  v-model="childItem.relation"
                  placeholder="请选择"
                  @change="relationChange($event, index, nodeIndex, childIndex, 'relationName')"
                >
                  <el-option
                    v-for="functionItem in handleRelationData(relationOptions)"
                    :key="functionItem.id"
                    :label="functionItem.name"
                    :value="functionItem.id"
                  />
                </el-select>
              </div>
              <div v-if="childItem.showVal" style="display: flex">
                <!-- 值 -->
                <div class="params_val">
                  <el-cascader
                    v-if="childItem.showVal"
                    :key="timeKey"
                    v-model="childItem.type"
                    :props="childItem.propsOption"
                    :options="childItem.basicData"
                    :show-all-levels="false"
                    filterable
                  />
                </div>
                <!--值对应关联关系 -->
                <div v-if="childItem.setVal" class="val_function">
                  <el-select
                    v-model="childItem.typeRelation"
                    placeholder="请选择"
                    @change="relationChange($event, index, nodeIndex, childIndex, 'typeRelationName')"
                  >
                    <el-option
                      v-for="relationItem in filterRelationData(relationOptions)"
                      :key="relationItem.value"
                      :label="relationItem.name"
                      :value="relationItem.key"
                    />
                  </el-select>
                </div>
                <!-- 货对应 -->
                <div v-if="childItem.setVal" class="params_good">
                  <!-- 非区间 -->
                  <div v-if="childItem.typeRelation != 7">
                    <el-input v-model="childItem.value0" placeholder="请输入内容" />
                    <span style="margin-left:5px;">次</span>
                  </div>
                  <!-- 区间 -->
                  <div v-if="childItem.typeRelation == 7" class="interval_val">
                    <el-input v-model="childItem.value0" placeholder="请输入内容" />
                    <span>至</span>
                    <el-input v-model="childItem.value1" placeholder="请输入内容" />
                    <span>次</span>
                  </div>
                </div>
              </div>
              <!-- 添加筛选 -->
              <div v-if="!childIndex" class="add_child_rules" @click="addFilters(index, nodeIndex, childIndex)">
                <img src="@assets/img/userImg/add.png" alt="">
                <span>添加筛选</span>
              </div>
              <!-- 删除筛选 -->
              <img
                v-if="childIndex"
                src="@assets/img/userImg/close@2x.png"
                class="delete_filter"
                @click="deleteFilters(index, nodeIndex, childIndex)"
              >
            </div>
          </div>
          <div class="operating">
            <div v-if="item.nodes.length < threshold.childNum" class="add" @click="addRules(index, nodeIndex)">
              <img src="@assets/img/userImg/add_line@2x.png" alt="">
              <span>新增</span>
            </div>
            <img src="@assets/img/userImg/close@2x.png" alt="" class="reduce" @click="deleteRules(index, nodeIndex)">
          </div>
        </div>
      </li>
    </ul>
    {{ letterShow }}
  </div>
</template>

<script>
/**
   * 规则数据结构
   *  A => {A1,A2,A3}
   *  阀值: 3*3 (一级大类5个，每个大类子集3个）
   */
import DateTimePicker from '../../common/DateTimePicker'
import { letter } from '@config'
import { userImgDetail } from '@api/userImg'

export default {
  name: 'FilerContent',
  components: {
    DateTimePicker
  },
  filters: {
    relationTxt(val) {
      const relationTxtMap = {
        'and': '且',
        'or': '或'
      }
      return relationTxtMap[val]
    }
  },
  data() {
    return {
      loading: true,
      timeOptions: {}, // 时间
      basicDataOptions: '', // 基础数据
      relationOptions: '', // 关联关系
      options: [],
      rulesParams: {
        relation: 'and',
        nodes: []
      },
      threshold: { // 阀值限制
        first: 5,
        childNum: 3
      },
      propsOption: {
        value: 'value',
        label: 'labelAlias',
        children: 'children',
        checkStrictly: true
      },
      classOptions: {
        value: [],
        Map: new Map(),
        classMap: new Map()
      },
      timeKey: new Date().getTime(),
      relationMap: new Map(),
      timeOptionMap: new Map(),
      copyUserImgId: '' // 复制对象ID
    }
  },
  computed: {
    letterShow() {
      const { rulesParams } = this
      let count = 0
      for (const item of rulesParams.nodes) {
        for (const node of item.nodes) {
          node['name'] = letter[count]
          count += 1
        }
      }
      return null
    }
  },
  mounted() {
    this.getBaseData()
    this.init()
    this.copyUserImgId = this.$route.query.editId
  },
  methods: {
    // 获取配置详情
    async getDetail() {
      const result = await userImgDetail(this.copyUserImgId)
      if (result.data) {
        const filterJson = JSON.parse(result.data.requestJson)
        this.$store.commit('userImg/SET_EDIT_USER_IMG', filterJson)

        // 数据处理
        if (filterJson) {
          filterJson.relation = filterJson.relation === '8' ? 'and' : 'or'
          for (const firstNode of filterJson.nodes) {
            firstNode.relation = firstNode.relation === '8' ? 'and' : 'or'
            for (const secondNode of firstNode.nodes) {
              if (this.timeOptionMap.has(secondNode.date)) {
                secondNode.date = this.timeOptionMap.get(secondNode.date)
              } else {
                secondNode.date = {
                  key: secondNode.date,
                  name: secondNode.date,
                  type: 'date',
                  value: secondNode.date
                }
              }
              this.$set(secondNode, 'classOption', JSON.parse(JSON.stringify(this.classOptions.value)))
              for (const childItem of secondNode.children) {
                this.$set(childItem, 'propsOption', { ...JSON.parse(JSON.stringify(this.propsOption)), checkStrictly: childItem.classLabelNo === 'U001' || childItem.classLabelNo === 'U006' })
                this.$set(childItem, 'basicData', this.classOptions.Map.get(childItem.classLabelNo))
                this.$set(childItem, 'showVal', true)
                this.$set(childItem, 'type', `${childItem.labelId}$${childItem.labelNo}$${childItem.level}$${childItem.type}$${childItem.labelName}`)
                this.$set(childItem, 'setVal', childItem.classLabelNo === 'U001')
              }
            }
          }
          this.$parent.userImgTypeVal = filterJson.type ? Number(filterJson.type) : filterJson.type
          this.$parent.userImgCategoryVal = filterJson.goodsCategory
          if (this.timeOptionMap.has(filterJson.calculateDate)) {
            this.$parent.intervalTime = this.timeOptionMap.get(filterJson.calculateDate)
          } else {
            this.$parent.intervalTime = {
              key: filterJson.calculateDate,
              name: filterJson.calculateDate,
              type: 'date',
              value: filterJson.calculateDate
            }
          }
          this.$parent.timeKey = new Date().getTime()
          this.$parent.updateKey = new Date().getTime()
        }
        this.rulesParams = filterJson
        this.timeKey = new Date().getTime()
        this.$parent.loading = false
      }
    },
    // 设置默认值 (展现所有大类)
    setDefaultOption() {
      // default value
      let relation = this.relationOptions.filter(item => item.name === '等于') // 关联关系
      relation = relation[0]

      let typeRelation = this.relationOptions.filter(item => item.name === '大于') // 关联关系
      typeRelation = typeRelation[0]

      const classOption = JSON.parse(JSON.stringify(this.classOptions.value))
      for (const item of this.classOptions.value) {
        let classLabel = item // 大类默认选中
        classLabel = item.labelNo
        this.rulesParams.nodes.push({
          relation: 'and',
          nodes: [
            {
              date: this.timeOptions[0],
              name: '',
              classOption: classOption,
              children: [
                {
                  classLabelNo: classLabel,
                  className: this.classOptions.classMap.get(classLabel).labelName,
                  relation: relation.key,
                  relationName: relation.name,
                  type: '',
                  typeRelation: typeRelation.key,
                  typeRelationName: typeRelation.name,
                  value0: '1',
                  value1: '',
                  setVal: classLabel === 'U001', // 非货/订单外 都为false
                  propsOption: { ...JSON.parse(JSON.stringify(this.propsOption)), checkStrictly: classLabel === 'U001' || classLabel === 'U006' }, // 级联配置
                  basicData: this.classOptions.Map.get(classLabel), // 基础参数配置
                  showVal: true // 是否展示 设置项
                }
              ]
            }
          ]
        })
      }
    },
    // 获取树结构数据
    async getBaseData() {
      let result = await localStorage.getItem('labelTree')
      result = JSON.parse(result)
      if (result) {
        this.timeOptions = result.labelDates
        this.basicDataOptions = result.labelTree
        this.relationOptions = result.relationNodes
        for (const timeItem of this.timeOptions) {
          this.timeOptionMap.set(timeItem.key, timeItem)
        }

        this.dealbasicData(this.basicDataOptions)
        // 筛分出大类
        for (const item of this.basicDataOptions) {
          this.classOptions.value.push(
            {
              labelType: item.labelType,
              labelName: item.labelName,
              labelId: item.labelId,
              labelNo: item.labelNo,
              disabled: false
            }
          )
          this.classOptions.classMap.set(item.labelNo, {
            labelType: item.labelType,
            labelName: item.labelName,
            labelId: item.labelId,
            labelNo: item.labelNo
          })
          this.classOptions.Map.set(item.labelNo, item.children)
        }
        // 暂存 关联关系map
        for (const relationItem of this.relationOptions) {
          this.relationMap.set(relationItem.key, relationItem)
        }
        // 默认赋值
        if (!this.copyUserImgId) {
          this.setDefaultOption()
          this.$parent.loading = false
        } else {
          this.getDetail()
        }
      }
      // 品类画像大类默认 货
      this.$parent.classImgOptions = this.classOptions.Map.get('U001')
    },
    /**
       * 处理基础数据，
       */
    dealbasicData(val) {
      if (!val || val.length === 0) {
        return
      }
      for (const item of val) {
        this.$set(item, 'value', `${item.labelId}$${item.labelNo}$${item.level}$${item.labelType}$${item.labelName}`)
        this.$set(item, 'setVal', true)
        if (item.children && item.children.length !== 0) {
          this.dealbasicData(item.children)
        }
      }
    },
    // 筛选 关联数据（只保留 等于 and 不等于）
    handleRelationData(val) {
      return val.filter(item => item.name === '等于' || item.name === '不等于')
    },
    filterRelationData(val) {
      return val.filter(item => item.name === '等于' || item.name === '区间' || item.name === '大于等于' || item.name === '小于等于' || item.name === '不等于' || item.name === '大于' || item.name === '小于')
    },
    // 添加 一级筛选规则
    addRuleFirst() {
      if (this.rulesParams.nodes.length === this.threshold.first) {
        this.$message(`最多可添加${this.threshold.first}条规则`)
        return
      }
      // default value
      let relation = this.relationOptions.filter(item => item.name === '等于') // 关联关系
      relation = relation[0]

      let typeRelation = this.relationOptions.filter(item => item.name === '大于') // 关联关系
      typeRelation = typeRelation[0]

      let classLabel = this.classOptions.value[0] // 大类默认选中
      classLabel = classLabel.labelNo

      const classOption = JSON.parse(JSON.stringify(this.classOptions.value))

      this.rulesParams.nodes.push({
        relation: 'and',
        nodes: [
          {
            date: this.timeOptions[0],
            name: '',
            classOption: classOption,
            children: [
              {
                classLabelNo: classLabel, // 默认货
                className: this.classOptions.classMap.get(classLabel).labelName,
                relation: relation.key,
                relationName: relation.name,
                type: '',
                typeRelation: typeRelation.key,
                typeRelationName: typeRelation.name,
                value0: '1',
                value1: '',
                setVal: true, // 非货外 都为false
                propsOption: { ...JSON.parse(JSON.stringify(this.propsOption)), checkStrictly: classLabel === 'U001' || classLabel === 'U006' }, // 级联配置
                basicData: this.classOptions.Map.get(classLabel), // 基础参数配置
                showVal: true // 是否展示 设置项
              }
            ]
          }
        ]
      })
    },
    // 添加 筛选规则
    addFilters(firstIndex, secondIndex, thirdIndex) {
      const { rulesParams, basicDataOptions } = this
      if (rulesParams.nodes[firstIndex].nodes[secondIndex].children.length === basicDataOptions.length) {
        this.$message({
          message: `最多可添加${basicDataOptions.length}条筛选条件`,
          type: 'warning'
        })
        return
      }
      let relation = this.relationOptions.filter(item => item.name === '等于') // 关联关系
      relation = relation[0]

      rulesParams.nodes[firstIndex].nodes[secondIndex].children.push({
        classLabelNo: '', // 默认货
        className: '',
        relationName: relation.name,
        relation: relation.key,
        type: '',
        typeRelation: '',
        typeRelationName: '',
        value0: '1',
        value1: '',
        setVal: false, // 非货外 都为false
        propsOption: JSON.parse(JSON.stringify(this.propsOption)), // 级联配置
        basicData: [], // 基础参数配置
        showVal: false // 是否展示 设置项
      })
    },
    // 删除筛选
    deleteFilters(firstIndex, secondIndex, thirdIndex) {
      const { rulesParams } = this
      rulesParams.nodes[firstIndex].nodes[secondIndex].children.splice(thirdIndex, 1)
      this.timeKey = new Date().getTime()
    },
    // 新增 同级别筛选条件
    addRules(firstIndex, secondIndex) {
      const { threshold, rulesParams } = this
      if (rulesParams.nodes[firstIndex].nodes.length === threshold.childNum) {
        this.$message({
          message: `最多可添加${threshold.childNum}条`,
          type: 'warning'
        })
        return
      }
      // default value
      let relation = this.relationOptions.filter(item => item.name === '等于') // 关联关系
      relation = relation[0]

      let typeRelation = this.relationOptions.filter(item => item.name === '大于') // 关联关系
      typeRelation = typeRelation[0]

      let classLabel = this.classOptions.value[0] // 大类默认选中
      classLabel = classLabel.labelNo

      const classOption = JSON.parse(JSON.stringify(this.classOptions.value))

      rulesParams.nodes[firstIndex].nodes.push({
        date: this.timeOptions[0],
        name: '',
        classOption: classOption,
        children: [
          {
            classLabelNo: classLabel, // 默认货
            className: this.classOptions.classMap.get(classLabel).labelName,
            relation: relation.key,
            relationName: relation.name,
            type: '',
            typeRelation: typeRelation.key,
            typeRelationName: typeRelation.name,
            value0: '1',
            value1: '',
            setVal: true, // 非货外 都为false
            propsOption: JSON.parse(JSON.stringify(this.propsOption)), // 级联配置
            basicData: this.classOptions.Map.get(classLabel), // 基础参数配置
            showVal: true // 是否展示 设置项
          }
        ]
      })
    },
    // 删除 规则
    deleteRules(firstIndex, secondIndex) {
      this.rulesParams.nodes[firstIndex].nodes.splice(secondIndex, 1)
      if (this.rulesParams.nodes[firstIndex].nodes.length === 0) {
        this.rulesParams.nodes.splice(firstIndex, 1)
      }
      this.timeKey = new Date().getTime()
    },
    // 规则 大类 change
    classHandleChange($event, firstIndex, secondIndex, thirdIndex) {
      const specialCase = 'U001'
      if ($event !== specialCase) {
        this.rulesParams.nodes[firstIndex].nodes[secondIndex].children[thirdIndex].setVal = false
        this.rulesParams.nodes[firstIndex].nodes[secondIndex].children[thirdIndex].propsOption = {
          ...JSON.parse(JSON.stringify(this.propsOption)),
          checkStrictly: false
        }
        this.rulesParams.nodes[firstIndex].nodes[secondIndex].children[thirdIndex].typeRelation = null
        this.rulesParams.nodes[firstIndex].nodes[secondIndex].children[thirdIndex].typeRelationName = null
        this.rulesParams.nodes[firstIndex].nodes[secondIndex].children[thirdIndex].value0 = null
        this.rulesParams.nodes[firstIndex].nodes[secondIndex].children[thirdIndex].type = null
      } else {
        this.rulesParams.nodes[firstIndex].nodes[secondIndex].children[thirdIndex].propsOption = {
          ...JSON.parse(JSON.stringify(this.propsOption)),
          checkStrictly: true
        }
        this.rulesParams.nodes[firstIndex].nodes[secondIndex].children[thirdIndex].setVal = true
        this.rulesParams.nodes[firstIndex].nodes[secondIndex].children[thirdIndex].value0 = null
      }

      this.timeKey = new Date().getTime()

      this.rulesParams.nodes[firstIndex].nodes[secondIndex].children[thirdIndex].showVal = true
      this.rulesParams.nodes[firstIndex].nodes[secondIndex].children[thirdIndex].className = this.classOptions.classMap.get($event).labelName
      this.rulesParams.nodes[firstIndex].nodes[secondIndex].children[thirdIndex].basicData = this.classOptions.Map.get($event)

      this.classHandleFocus(null, firstIndex, secondIndex, thirdIndex)
    },
    // 规则  聚焦
    classHandleFocus($event, firstIndex, secondIndex, thirdIndex) {
      const yetData = this.rulesParams.nodes[firstIndex].nodes[secondIndex].children
      const classOption = this.rulesParams.nodes[firstIndex].nodes[secondIndex].classOption

      const yetChoose = []
      for (const item of yetData) {
        if (item.classLabelNo) {
          yetChoose.push(item.classLabelNo)
        }
      }

      for (const classItem of classOption) {
        this.$set(classItem, 'disabled', false)
        for (const yetItem of yetChoose) {
          if (classItem.labelNo === yetItem) {
            this.$set(classItem, 'disabled', true)
          }
        }
      }
    },
    // 切换关联关系
    changeRelation(type, index) {
      let relation
      if (type === 'children') {
        relation = this.rulesParams.nodes[index].relation
      } else {
        relation = this.rulesParams.relation
      }
      if (relation === 'and') {
        relation = 'or'
      } else {
        relation = 'and'
      }

      if (type === 'children') {
        this.rulesParams.nodes[index].relation = relation
      } else {
        this.rulesParams.relation = relation
      }
    },
    // 初始化
    init() {
      this.rulesParams = {
        relation: 'and',
        nodes: []
      }
    },
    // 切换关联关系
    relationChange(val, firstIndex, secondIndex, thirdIndex, type) {
      this.rulesParams.nodes[firstIndex].nodes[secondIndex].children[thirdIndex][type] = this.relationMap.get(val).name
    }
  }
}
</script>

<style scoped lang="less">
  /**----------------------**\
          common
  \**-----------------------**/
  .diyElementSelect(@val) {
    /deep/ .el-input {
      width: @val;
      font-size: 12px;
    }
  }

  /**----------------------**\
         filter-wrap
 \**-----------------------**/
  .filter-wrap {

    position: relative;
    margin: 15px;

    .relations {
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
      cursor: pointer;
      z-index: 10;
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
        margin-right: 5px;
        position: relative;
        top: 9px;
      }

      .operating {
        display: flex;
        height: 40px;
        position: absolute;
        top: 0;
        right: 3px;
        align-items: center;

        .add {
          font-size: 12px;
          font-weight: 400;
          color: rgba(109, 114, 120, 1);

          img {
            display: inline-block;
            width: 14px;
            position: relative;
            top: -1px;
            left: -2px;
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
        height: 40px;
        margin-right: 5px;
      }

      .params_right {

        &_lis {
          flex: 1;
          display: flex;
          margin-bottom: 5px;
          height: 40px;

          &:last-child {
            margin-bottom: 0;
          }
        }

        .function {
          .diyElementSelect(80px);
          margin-right: 5px;
        }

        .params_val {
          /deep/ .el-input {
            min-width: 120px;
          }

          /deep/ .el-cascader {
            width: 170px;
            font-size: 12px;
          }

          /deep/ .el-input__inner {
            font-size: 12px;
          }
        }
      }

      .val_function {
        margin-left: 5px;
        .diyElementSelect(80px);
      }

      .params_good {
        margin-left: 5px;
        .diyElementSelect(50px);
      }
    }

    .add_child_rules {
      display: flex;
      align-items: center;
      margin-left: 5px;
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
      border-left: 1px solid #E2BDF8;

      .lis_item {
        padding-left: 20px;
      }
    }

  }

  .filter_wrap_border {
    border-left: 1px solid #E2BDF8;
    padding-left: 20px;
  }

  .params_class {
    .diyElementSelect(70px);
    margin-right: 5px;
  }
</style>
