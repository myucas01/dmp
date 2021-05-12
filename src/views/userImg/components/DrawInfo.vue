<template>
  <div class="pages">
    <div class="InfoBox">
      <div class="title">
        <em />
        <span>画像信息</span>
      </div>
      <div class="peopleNum">
        <div class="leftItem">
          <el-progress
            type="circle"
            :percentage="Number((info.percentage * 100).toFixed(2))"
            :color="customColor"
            :width="62"
          />
          <div class="num">
            <div class="f18">
              {{
                info.subTotal
                  | currency({ fractionCount: '', symbolSpacing: false })
              }}
              <span class="f12">人</span>
              <el-tooltip
                class="item"
                popper-class="tip-content"
                effect="light"
                placement="right-start"
              >
                <div slot="content" style="max-width: 200px">
                  条件筛选出的用户和用户表的用户加和后去重
                </div>
                <i class="el-icon-question f14 color99" />
              </el-tooltip>
            </div>
            <p class="f12 color99">
              在 全部用户
              {{
                info.total
                  | currency({ fractionCount: '', symbolSpacing: false })
              }}人中占比{{ (info.percentage * 100) | currency }}%
            </p>
          </div>
        </div>
        <div class="rightItem">
          <p class="f12">计算于{{ info.statisticsTime }}</p>
          <div style="display: flex">
            <el-button
              v-auth="'profileinfo:fellow'"
              size="small"
              type="primary"
              @click="computedAgain"
            ><img src="@assets/img/userImg/people.png" alt=""><span>重新计算</span></el-button>
            <el-button
              v-auth="'profileinfo:fellow'"
              size="small"
              type="primary"
              @click="getCompareImgList"
            ><img src="@assets/img/userImg/people.png" alt=""><span>同人对比</span></el-button>
            <el-button
              v-auth="'profileinfo:download'"
              size="small"
              type="primary"
              @click="downLoad('', '014')"
            ><img src="@assets/img/userImg/drawDown.png" alt=""><span>下载统计结果</span></el-button>
            <el-button
              v-auth="'profileinfo:download'"
              size="small"
              type="primary"
              @click="downPeople"
            ><img src="@assets/img/userImg/people.png" alt=""><span>下载人群包</span></el-button>
          </div>
        </div>
      </div>
      <div v-for="(nitem, num) in list" :key="num" class="chart">
        <div class="title">{{ nitem.typeName }} <span
          style="color: #999999;font-size: 12px;font-weight:normal;"
        >{{ nitem.desc }}</span></div>
        <el-row>
          <el-col
            v-for="(item, index) in nitem.dataResultVoList"
            :key="index"
            :span="item.statNo == '200' || item.statNo == '202' || item.statNo == '508' ? 16 : 8"
          >
            <div class="grid-content bg-purple">
              <div class="chartTitle">
                <div class="left">
                  <div>
                    <b class="f14">{{ item.titleName }}</b>
                    <el-tooltip
                      class="item"
                      effect="light"
                      :content="item.description"
                      placement="right-start"
                      popper-class="tip-content"
                    >
                      <div
                        slot="content"
                        style="max-width: 200px"
                        v-html="item.description"
                      >
                        {{ item.description }}
                      </div>
                      <i class="el-icon-question f14 color99" />
                    </el-tooltip>
                    <span
                      v-if="item.statNo == '012'"
                      @click="openTagDialog(index)"
                    >词云过滤</span>
                  </div>
                  <div class="f12 color99">{{ item.titleDesc }}</div>
                  <!--                    <p><span class="f12 color99">总计：</span>4985  <span class="f12 color99">均值：</span>50</p>-->
                </div>
                <div class="right">
                  <span
                    v-if="item.statNo == '102'"
                  ><em
                    :class="{ active: ageChartType == 1 }"
                    @click="drawAgeChart(item, num, index, 1)"
                  >分性别</em>
                    |
                    <em
                      :class="{ active: ageChartType == 2 }"
                      @click="drawAgeChart(item, num, index, 2)"
                    >合计</em></span>
                  <span
                    v-if="item.statNo == '401'"
                  ><em
                    :class="{ active: tagChartType == 1 }"
                    @click="drawtagChart(item, num, index, 1)"
                  >柱状图</em>
                    |
                    <em
                      :class="{ active: tagChartType == 2 }"
                      @click="drawtagChart(item, num, index, 2)"
                    >词云图</em></span>
                  <i
                    v-auth="'profileinfo:download'"
                    class="el-icon-download f14 color99"
                    @click="downLoad(item.statNo, item.statNo)"
                  />
                  <i
                    class="el-icon-close f14 color99"
                    @click="delChart(num, index, item.statNo)"
                  />
                </div>
              </div>
              <div
                v-if="
                  item.statNo == '300' ||
                    item.statNo == '301' ||
                    item.statNo == '306' ||
                    item.statNo == '500' ||
                    item.statNo == '501' ||
                    item.statNo == '506'
                "
                class="f12 color99 pl10"
              >
                总订单数：<span
                  class="f14 color33"
                  style="font-weight: bolder; margin-right: 5px"
                >{{ item.total | currency }}</span>
                {{ item.statName }}
                ：<span class="f14 color33" style="font-weight: bolder">{{
                  item.avg
                }}</span>
              </div>
              <div
                v-if="
                  item.statNo == '302' ||
                    item.statNo == '502'
                "
                class="f12 color99 pl10"
              >
                总件数：<span
                  class="f14 color33"
                  style="font-weight: bolder; margin-right: 5px"
                >{{ item.total | currency }}</span>
                {{ item.statName }}：<span
                  class="f14 color33"
                  style="font-weight: bolder"
                >{{ item.avg }}</span>
              </div>
              <div
                v-if="
                  item.statNo == '303' ||
                    item.statNo == '304' ||
                    item.statNo == '305' ||
                    item.statNo == '307' ||
                    item.statNo == '503' ||
                    item.statNo == '504' ||
                    item.statNo == '505' ||
                    item.statNo == '507'
                "
                class="f12 color99 pl10"
              >
                总人数：<span
                  class="f14 color33"
                  style="font-weight: bolder; margin-right: 5px"
                >{{ item.total | currency }}</span>
                {{ item.statName }}：<span
                  class="f14 color33"
                  style="font-weight: bolder"
                >{{ item.avg }}</span>
              </div>
              <div
                v-if="item.statStruct"
                :id="'c' + num + (index + 1)"
                class="chartBox"
              />
              <div v-if="!item.statStruct" class="message">
                {{ item.resultDescription }}
              </div>
            </div>
          </el-col>
          <el-col v-if="showList" :span="8">
            <div class="grid-content bg-purple addBtn" @click="openDialog">
              <span><i class="el-icon-plus" />新增画像</span>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <el-dialog
      title="请选择你需要的画像"
      :visible.sync="dialogFormVisible"
      width="600px"
    >
      <div>
        <el-checkbox
          v-model="checkAll"
          :indeterminate="isIndeterminate"
          @change="handleCheckAllChange"
        >全选
        </el-checkbox>
        <el-checkbox
          v-model="checkDefault"
          @change="defaultChange"
        >默认模块
        </el-checkbox>
        <div style="margin: 15px 0" />
        <div v-for="(item, index) in titleList" :key="index">
          <div>{{ item.name }}</div>
          <el-checkbox-group v-model="item.checkedTitle">
            <el-checkbox
              v-for="city in item.configVo"
              :key="city.statNo"
              :label="city.statNo"
              :value="city.statNo"
              @change="handleCheckedCitiesChange2"
            >{{ city.statName }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeDialog">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="词云过滤" :visible.sync="tagChartVisible" width="600px">
      <div class="tag_content">
        <el-checkbox
          v-model="tagCheckAll"
          @change="handleTagCheckAllChange"
        >全选
        </el-checkbox>
        <el-checkbox
          v-model="reverseCheck"
          @change="handleReverseChange"
        >反选
        </el-checkbox>
        <div style="margin: 15px 0" />
        <el-checkbox-group v-model="checkedTag">
          <el-checkbox
            v-for="city in tagDialogInfo.statStruct"
            :key="city.item"
            :label="city.item"
          >{{ city.item }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="tagChartVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeTagDialog">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 同人对比 -->
    <div class="compareBycolleague">
      <el-dialog title="请选择对比时间段" :visible.sync="dateVisible">
        <div>
          <h5 class="color99 f12">请添加1至2个时间段进行同人对比</h5>
          <div class="time_add">
            <ul>
              <li
                v-for="(item, index) of compareWithColleague"
                :key="item.value"
              >
                <span>时间段{{ index + 1 }}</span>
                <el-date-picker
                  v-model="item.value"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  type="daterange"
                  :disabled="item.timeDisabled"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="datePickerChange($event, index)"
                />
                <div v-if="compareWithColleagueAdd" @click="addTimePeriod">
                  <img src="@assets/img/userImg/add@2x.png" alt="">
                  <span>添加</span>
                </div>
                <div
                  v-if="!compareWithColleagueAdd"
                  @click="deleteTimePeriod(index)"
                >
                  <img src="@/assets/img/userImg/delete 22@2x.png" alt="">
                  <span>删除</span>
                </div>
              </li>
            </ul>
          </div>
          <div v-if="comparelist && comparelist.length > 0" class="list">
            <h5>历史</h5>
            <el-checkbox-group
              v-model="chooseCompareVal"
              :max="maxNum"
              @change="histroyChange"
            >
              <el-checkbox
                v-for="item in comparelist"
                :key="item.profileNo"
                :label="item.profileNo"
              >{{ item.profileName | filterProfileName }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dateVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="createSelfCompareImg"
          >对 比
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'

require('echarts-wordcloud')
import 'echarts/theme/macarons.js'
import 'echarts-wordcloud/dist/echarts-wordcloud'
import {
  createSelfCompare,
  createSelfCompareList,
  configList,
  againCompute,
  userImgDetail,
  setDefaultNos
} from '@/api/userImg'

export default {
  filters: {
    filterProfileName(val) {
      if (val) {
        return val.substring(5)
      } else {
        return null
      }
    },
    capitalize: function(num) {
      if (typeof num === 'undefined' || num === null) {
        return '-'
      } else {
        const res = num.toString().replace(/\d+/, (n) => {
          // 先提取整数部分
          return n.replace(/(\d)(?=(\d{3})+$)/g, ($1) => {
            return $1 + ','
          })
        })
        return res
      }
    }
  },
  props: {
    info: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      id: '',
      checked: false,
      customColor: [
        { color: '#866CEDFF', percentage: 20 },
        { color: '#866CEDFF', percentage: 40 },
        { color: '#866CEDFF', percentage: 60 },
        { color: '#866CEDFF', percentage: 80 },
        { color: '#866CEDFF', percentage: 100 }
      ],
      ageChartType: 2,
      tagChartType: 1,
      dialogFormVisible: false,
      checkedTag: [],
      tagChartVisible: false, // 过滤词云
      tagChartInfo: '',
      tagDialogInfo: '',
      tagIndex: '',
      checkAll: false,
      tagCheckAll: true,
      reverseCheck: false,
      checkDefault: true,
      isIndeterminate: true,
      list: [],
      initiaTitle: [], // 初始要选中的默认
      allcheckedIds: [],
      initialList: [], // 初始所有结果
      showList: [], // 要展示的结果
      titleList: [],
      dateVisible: false, // 同人对比弹框
      compareWithColleague: [
        // 同人对比
        {
          value: '',
          id: ''
        }
      ],
      compareWithColleagueAdd: true,
      comparelist: [],
      chooseCompareVal: [],
      timeDisabled: false,
      maxNum: 2,
      profileId: ''
    }
  },
  mounted() {
    // this.getTitleList(id);
  },
  methods: {
    async getUserImgDetail(id, statNo) {
      const result = await userImgDetail(id, {
        statNo: statNo.toString()
      })
      if (result.code === 200) {
        this.list = result.data.profileDataResultVoList
        this.profileId = result.data.profileId
        // console.log(this.list)
        this.$nextTick(function() {
          for (const i in this.list) {
            this.drawChart(this.list[i].dataResultVoList, i)
          }
        })
      }
    },
    async setDefault(list) {
      // console.log(this.titleList)

      await setDefaultNos({
        statNo: list
      })
    },
    handleCheckAllChange(val) {
      // const list = []
      // for (let i = 0; i < this.titleList.length; i++) {
      //   list.push(this.titleList[i].statNo);
      // }
      // if (!val) {
      //   this.checkDefault = false;
      // }
      // this.checkedTitle = val ? list : [];
      // this.isIndeterminate = false;
      for (const i in this.titleList) {
        this.titleList[i].checkedTitle = this.titleList[i].allTitle
        this.allcheckedIds = this.allcheckedIds.concat(
          this.titleList[i].checkedTitle
        )
      }
      // console.log(this.allcheckedIds)
    },
    handleCheckedCitiesChange(value) {
      // console.log(value)
      // this.titleList[index].checkedTitle = value
    },
    handleCheckedCitiesChange2(value) {
      // console.log(value)
      this.$forceUpdate()
      // this.titleList[index].checkedTitle = value
    },
    openDialog() {
      this.dialogFormVisible = true
    },
    changeDialog() {
      // console.log(this.checkDefault)
      const list = []
      for (const i in this.titleList) {
        for (const o in this.titleList[i].checkedTitle) {
          list.push(this.titleList[i].checkedTitle[o])
        }
      }
      if (this.checkDefault) {
        this.setDefault(list)
      }
      for (let i = 0; i < this.list.length; i++) {
        for (let o = 0; o < this.list[i].dataResultVoList.length; o++) {
          const dom = document.getElementById('c' + i + (o + 1))
          if (dom) {
            dom.innerHTML = ''
            dom.removeAttribute('_echarts_instance_')
          }
        }
      }

      this.dialogFormVisible = false
      this.getUserImgDetail(this.id, list)
    },
    openTagDialog(index) {
      this.tagChartVisible = true
      this.tagIndex = index
      for (const lableItem of this.tagChartInfo.statStruct) {
        this.checkedTag.push(lableItem.item)
      }
      this.tagCheckAll = true
    },
    // 过滤词云
    changeTagDialog() {
      this.tagChartVisible = false
      const list = this.tagDialogInfo.statStruct.filter((item) =>
        this.checkedTag.some((e) => e === item.item)
      )
      this.tagChartInfo.statStruct = JSON.parse(JSON.stringify(list))
      this.drawtagChart(this.tagChartInfo, this.tagIndex, 1)
    },
    // 获取常量配置显示表单
    getTitleList(id) {
      configList().then((res) => {
        this.id = id
        // console.log('获取常量配置显示表单', res)
        if (res.code === 200) {
          this.titleList = res.data
          let list = []
          for (const i in this.titleList) {
            this.titleList[i].checkedTitle = []
            this.titleList[i].allTitle = []
            this.titleList[i].defaultTitle = []
            for (const o in this.titleList[i].configVo) {
              if (this.titleList[i].configVo[o].isDefault === '1') {
                this.titleList[i].defaultTitle.push(
                  this.titleList[i].configVo[o].statNo
                )
              }
              this.titleList[i].checkedTitle = this.titleList[i].defaultTitle
              this.titleList[i].allTitle.push(
                this.titleList[i].configVo[o].statNo
              )
            }
            list = list.concat(this.titleList[i].checkedTitle)
          }
          // console.log(list)
          this.allcheckedIds = list
          // console.log(this.allcheckedIds)
          if (this.showList) {
            this.$nextTick(function() {
              this.getUserImgDetail(id, this.allcheckedIds)
            })
          }
        }
      })
    },
    getArrDifference(arr1, arr2) {
      return arr1.concat(arr2).filter(function(v, i, arr) {
        return arr.indexOf(v) === arr.lastIndexOf(v)
      })
    },
    defaultChange() {
      // if (this.checkDefault) {
      //   this.checkedTitle = this.initiaTitle;
      // } else {
      // }
      // this.isIndeterminate = true;
    },
    getList(list, profileId) {
      const regLess = /^\</g
      const regMore = /\+/g
      this.profileId = profileId
      this.list = list
      for (const item of list) {
        if (item.statStruct) {
          for (const labelItem of item.statStruct) {
            if (regLess.test(labelItem.item)) {
              labelItem.item = labelItem.item.replace(regLess, '小于')
            }
            if (regMore.test(labelItem.item)) {
              labelItem.item = labelItem.item.replace(regMore, '')
              labelItem.item = '大于' + labelItem.item
            }
          }
        }
      }
      this.initialList = list
      this.getTitleList()
    },
    drawChart(list, num) {
      // console.log(list)
      const vars = {}
      for (let i = 0; i < list.length; i++) {
        if (!list[i].statStruct) {
          continue
        }
        if (list[i].statNo === '102') {
          this.drawAgeChart(list[i], num, i, 2)
        } else if (list[i].statNo === '107') {
          this.drawMemberAgeChart(list[i], num, i)
        } else if (list[i].statNo === '401') {
          this.$set(this, 'tagDialogInfo', JSON.parse(JSON.stringify(list[i])))
          // 初始化词云过滤
          const tagList = []
          for (const o in list[i].statStruct) {
            const labelItem = list[i].statStruct[o].item.split('|')
            tagList.push(labelItem[0])
          }
          this.checkedTag = tagList
          this.$set(this, 'tagChartInfo', list[i])
          this.drawtagChart(list[i], num, i, 1)
        } else {
          const xData = []
          const yData = []
          const varName = 'chart' + i
          // 会员等级分布数据特殊处理
          if (list[i].statNo === '103') {
            list[i].statStruct.forEach((list) => {
              if (list.sub[0]) {
                list.mes =
                  '其中' +
                  (list.sub[0].subPercent * 100).toFixed(2) +
                  '%也为' +
                  list.sub[0].subItem
              }
            })
          }
          if (list[i].statNo === '105') {
            list[i].statStruct.forEach((item) => {
              // console.log(item)
              if (item) {
                item.br = true
              }
            })
          }
          list[i].statStruct.forEach((list) => {
            xData.push(list.item)
            yData.push({
              value: list.percent * 100,
              percent: list.percent,
              item: list
            })
          })
          let option = {}
          vars[varName] = echarts.init(
            document.getElementById('c' + num + (i + 1))
          )
          const yInterval = Number(list[i].maxPercent / 5)
          // console.log(yInterval)
          // 饼图  使用echart组件
          if (
            list[i].statNo === '101' ||
            list[i].statNo === '103' ||
            list[i].statNo === '104' ||
            list[i].statNo === '105' ||
            list[i].statNo === '108' ||
            list[i].statNo === '109' ||
            list[i].statNo === '111' ||
            list[i].statNo === '112' ||
            list[i].statNo === '400'
          ) {
            option = {
              tooltip: {
                trigger: 'item',
                backgroundColor: 'rgba(250,250,250,0.9)',
                extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
                borderColor: '#930CEA',
                borderWidth: 1,
                textStyle: {
                  color: '#333333',
                  fontSize: 12,
                  fontWeight: 'bolder'
                },
                formatter: (params) => {
                  // 格式化数据的函数
                  let p = ''
                  if (list[i].statNo === '101') {
                    p = '注册性别：'
                  }
                  const num = this.$options.filters['capitalize'](
                    params.data.value
                  )
                  return (
                    '<span style="float:left;">' +
                    p +
                    params.data.item +
                    '</span></br>' +
                    '\n' +
                    '人数：' +
                    num
                  )
                }
              },
              grid: {
                left: '5%',
                right: '15%',
                top: '5%',
                bottom: 10,
                containLabel: true
              },
              // width: 100,
              color: [
                '#866CED',
                '#FFEA6C',
                '#74C1F6',
                '#F4901A',
                '#5AD8A6',
                '#FAB8FF',
                '#FF6491',
                '#0091FF',
                '#6DD400',
                '#FA6400'
              ],
              series: [
                {
                  name: '访问来源',
                  type: 'pie',
                  radius: ['30%', '50%'],
                  center: ['50%', '50%'],
                  data: list[i].statStruct,
                  emphasis: {
                    itemStyle: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                  },
                  label: {
                    show: true,
                    position: 'outside',
                    color: '#333333',
                    fontSize: 12,
                    formatter: (params) => {
                      if (params.data.br) {
                        let text = ''
                        const info = params.data.item.split('、')
                        for (const i in info) {
                          text = text + '\n' + info[i]
                        }
                        return (
                          text +
                          ':' +
                          (params.data.percent * 100).toFixed(2) +
                          '%'
                        )
                      } else {
                        return (
                          params.data.item +
                          ':' +
                          (params.data.percent * 100).toFixed(2) +
                          '%'
                        )
                      }
                    },
                    rich: {
                      a: {
                        color: '#495060',
                        fontSize: 9,
                        fontWeight: 'bolder',
                        lineHeight: 16
                      }
                    }
                  }
                }
              ]
            }
          }
          // 折线图
          if (
            list[i].statNo === '200' ||
            list[i].statNo === '202' ||
            list[i].statNo === '208' ||
            list[i].statNo === '209' ||
            list[i].statNo === '508' ||
            list[i].statNo === '509'
          ) {
            option = {
              xAxis: {
                type: 'category',
                name: '时间段',
                axisLine: {
                  lineStyle: {
                    color: '#8b8b8d'
                  }
                },
                axisTick: {
                  show: false,
                  alignWithLabel: true,
                  interval: 0
                },
                axisLabel: {
                  interval: 0,
                  color: '#666666',
                  fontSize: 10,
                  formatter: function(value) {
                    if (value.indexOf('(') !== -1) {
                      value = value.slice(0, value.indexOf('('))
                    }
                    let result = '' // 拼接加\n返回的类目项
                    const maxLength = 3 // 每项显示文字个数
                    const valLength = value.length // X轴类目项的文字个数
                    const rowNumber = Math.ceil(valLength / maxLength) // 类目项需要换行的行数
                    if (rowNumber > 1) {
                      // 如果文字大于3,
                      for (var i = 0; i < rowNumber; i++) {
                        let temp = '' // 每次截取的字符串
                        const start = i * maxLength // 开始截取的位置
                        const end = start + maxLength // 结束截取的位置
                        temp = value.substring(start, end) + '\n'
                        result += temp // 拼接生成最终的字符串
                      }
                      return result
                    } else {
                      return value
                    }
                  }
                },
                data: xData
              },
              yAxis: {
                type: 'value',
                name: '人数占比',
                nameLocation: 'end',
                nameGap: 20,
                min: 0,
                max: list[i].maxPercent,
                splitNumber: 5,
                interval: yInterval,
                axisLine: {
                  lineStyle: {
                    color: '#8b8b8d'
                  }
                },
                axisTick: {
                  show: false
                },
                axisLabel: {
                  show: true,
                  color: '#666666',
                  interval: 'auto',
                  formatter: (params) => {
                    // 格式化数据的函数
                    if (params) {
                      return params + '%'
                    } else {
                      return '0%'
                    }
                  }
                },
                splitLine: {
                  // 坐标轴在 grid 区域中的分隔线
                  show: true,
                  lineStyle: {
                    type: 'dashed',
                    color: '#EEEEEE'
                  }
                }
              },
              grid: {
                left: '5%',
                right: '10%',
                bottom: '3%',
                top: 35,
                containLabel: true
              },
              tooltip: {
                show: true,
                backgroundColor: 'rgba(250,250,250,0.9)',
                extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
                borderColor: '#930CEA',
                borderWidth: 1,
                textStyle: {
                  color: '#333333',
                  fontSize: 12,
                  fontWeight: 'bolder'
                },
                formatter: (params) => {
                  // 格式化数据的函数c
                  // console.log(params)
                  const num = this.$options.filters['capitalize'](
                    params.data.item.value
                  )
                  return (
                    '<span style="float:left;">' +
                    params.name +
                    '</span></br>' +
                    '\n' +
                    '人数：' +
                    num
                  )
                }
                // formatter:
              },
              series: [
                {
                  data: yData,
                  symbol: 'circle',
                  type: 'line',
                  symbolSize: 6,
                  lineStyle: {
                    // 线条的配置
                    color: '#866CED'
                  },
                  itemStyle: {
                    // 折现拐点的配置
                    color: '#866CED',
                    borderColor: '#866CED'
                  }
                }
              ]
            }
          }
          // 柱状图
          if (
            list[i].statNo === '106' ||
            list[i].statNo === '110' ||
            list[i].statNo === '201' ||
            list[i].statNo === '203' ||
            list[i].statNo === '204' ||
            list[i].statNo === '205' ||
            list[i].statNo === '206' ||
            list[i].statNo === '207' ||
            list[i].statNo === '300' ||
            list[i].statNo === '301' ||
            list[i].statNo === '302' ||
            list[i].statNo === '303' ||
            list[i].statNo === '304' ||
            list[i].statNo === '305' ||
            list[i].statNo === '306' ||
            list[i].statNo === '307' ||
            list[i].statNo === '500' ||
            list[i].statNo === '501' ||
            list[i].statNo === '502' ||
            list[i].statNo === '503' ||
            list[i].statNo === '504' ||
            list[i].statNo === '505' ||
            list[i].statNo === '506' ||
            list[i].statNo === '507'
          ) {
            let titleName = ''
            if (list[i].statNo === '106') {
              titleName = '年份'
            } else if (
              list[i].statNo === '204' ||
              list[i].statNo === '205' ||
              list[i].statNo === '302' ||
              list[i].statNo === '303' ||
              list[i].statNo === '304' ||
              list[i].statNo === '306' ||
              list[i].statNo === '307' ||
              list[i].statNo === '502' ||
              list[i].statNo === '503' ||
              list[i].statNo === '504' ||
              list[i].statNo === '506' ||
              list[i].statNo === '507'
            ) {
              titleName = '元'
            } else if (list[i].statNo === '206' || list[i].statNo === '207') {
              titleName = '商圈'
            } else if (list[i].statNo === '305' || list[i].statNo === '505') {
              titleName = '次数'
            } else if (
              list[i].statNo === '300' ||
              list[i].statNo === '301' ||
              list[i].statNo === '500' ||
              list[i].statNo === '501'
            ) {
              titleName = '件'
            }

            option = this.getOption(list[i], titleName)
          }
          vars[varName].setOption(option)
        }
      }
    },
    // 柱状图的option
    getOption(info, titleName) {
      // console.log(info)
      const xData = []
      const yData = []
      info.statStruct.forEach((list) => {
        if (info.statNo === '012') {
          xData.push(list.tag)
        } else {
          xData.push(list.item)
        }
        yData.push({
          value: list.percent * 100,
          percent: list.percent,
          item: list
        })
      })
      const yInterval = Number(info.maxPercent / 5)
      // console.log(yInterval)
      let yAxisName = ''
      switch (info.statNo) {
        case '300': // 购买件数
          yAxisName = '订单占比'
          break
        case '306': // 人均客单价（未税）
          yAxisName = '订单占比'
          break
        default:
          yAxisName = '人数占比'
      }
      const barWidth = this.computedHistogramWeight(xData)
      const option = {
        xAxis: {
          type: 'category',
          name: titleName,
          axisLine: {
            lineStyle: {
              color: '#8b8b8d'
            }
          },
          axisTick: {
            show: false,
            alignWithLabel: true,
            interval: 0
          },
          axisLabel: {
            interval: 0,
            color: '#666666',
            fontSize: 10,
            formatter: function(value) {
              if (value.indexOf('(') !== -1) {
                value = value.slice(0, value.indexOf('('))
              }

              let result = '' // 拼接加\n返回的类目项
              let maxLength = 3 // 每项显示文字个数
              if (
                info.statNo === '106' ||
                info.statNo === '300' ||
                info.statNo === '301' ||
                info.statNo === '302' ||
                info.statNo === '303' ||
                info.statNo === '304' ||
                info.statNo === '305' ||
                info.statNo === '306' ||
                info.statNo === '307' ||
                info.statNo === '500' ||
                info.statNo === '501' ||
                info.statNo === '502' ||
                info.statNo === '503' ||
                info.statNo === '504' ||
                info.statNo === '505' ||
                info.statNo === '506' ||
                info.statNo === '507'
              ) {
                maxLength = 20
              }
              if (info.statNo === '401') {
                maxLength = 5
              }
              const valLength = value.length // X轴类目项的文字个数
              const rowNumber = Math.ceil(valLength / maxLength) // 类目项需要换行的行数
              if (rowNumber > 1) {
                // 如果文字大于3,
                for (var i = 0; i < rowNumber; i++) {
                  let temp = '' // 每次截取的字符串
                  const start = i * maxLength // 开始截取的位置
                  const end = start + maxLength // 结束截取的位置
                  temp = value.substring(start, end) + '\n'
                  result += temp // 拼接生成最终的字符串
                }
                return result
              } else {
                return value
              }
            }
          },
          data: xData
        },
        grid: {
          left: '5%',
          right: '10%',
          bottom: '3%',
          top: 35,
          containLabel: true
        },
        yAxis: {
          type: 'value',
          name: yAxisName,
          nameLocation: 'end',
          nameGap: 20,
          boundaryGap: 0,
          min: 0,
          max: info.maxPercent,
          splitNumber: 5,
          interval: yInterval,
          axisLine: {
            lineStyle: {
              color: '#8b8b8d'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: true,
            color: '#666666',
            formatter: (params) => {
              // 格式化数据的函数
              if (params) {
                return params + '%'
              } else {
                return '0%'
              }
            }
          },
          splitLine: {
            // 坐标轴在 grid 区域中的分隔线
            show: true,
            lineStyle: {
              type: 'dashed',
              color: '#EEEEEE'
            }
          },
          data: yData
        },
        tooltip: {
          show: true,
          backgroundColor: 'rgba(250,250,250,0.9)',
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          borderColor: '#930CEA',
          borderWidth: 1,
          textStyle: {
            color: '#333333',
            fontSize: 12
          },
          formatter: (params) => {
            // 格式化数据的函数
            let name = params.name
            if (info.statNo === '012') {
              name = params.data.item.item
            }
            const num = this.$options.filters['capitalize'](
              params.data.item.value
            )
            return `<div class="tooltips">
                        <span style="float:left;font-weight: bolder">${name}</span>
                        </br>\n<span style="font-weight: bolder">人数: ${num}</span>
                    </div>`
          }
        },
        series: [
          {
            itemStyle: {
              normal: {
                color: '#866CED',
                label: {
                  show: true,
                  color: '#333333',
                  position: 'top', // 数据在中间显示
                  formatter: (params) => {
                    // 格式化数据的函数
                    return (params.data.percent * 100).toFixed(2) + '%'
                  }
                }
              }
            },
            barMinHeight: 5,
            barWidth: barWidth,
            label: {
              show: true,
              position: 'top',
              formatter: (params) => {
                // 格式化数据的函数
                return params + '%'
              },
              color: '#000000'
            },
            data: yData,
            type: 'bar'
          }
        ]
      }
      return option
    },
    // 标签词云
    drawtagChart(item, num, index, type) {
      this.tagChartType = type
      if (!item.statStruct) {
        return
      }
      for (const labelItem of item.statStruct) {
        this.$set(labelItem, 'tag', labelItem.item.split('|')[0])
      }
      const dom = document.getElementById('c' + num + (index + 1))
      dom.innerHTML = ''
      dom.removeAttribute('_echarts_instance_')
      const myChart = echarts.init(
        document.getElementById('c' + num + (index + 1))
      )
      let option = ''
      if (this.tagChartType === 2) {
        // 绘制字符云
        const data = []
        for (const i in this.tagChartInfo.statStruct) {
          data.push({
            name: this.tagChartInfo.statStruct[i].tag,
            value: this.tagChartInfo.statStruct[i].value,
            tipName: this.tagChartInfo.statStruct[i].item
          })
        }
        option = {
          backgroundColor: '#ffffff',
          tooltip: {
            show: true,
            backgroundColor: 'rgba(250,250,250,0.9)',
            extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
            borderColor: '#930CEA',
            borderWidth: 1,
            textStyle: {
              color: '#333333'
            },
            formatter: (params) => {
              const num = this.$options.filters['capitalize'](params.data.value)
              // 格式化数据的函数
              return `<div class="tooltips">
                        <span style="float:left;font-weight: bolder">${params.data.tipName}</span>
                        </br>\n<span style="font-weight: bolder">人数: ${num}</span>
                    </div>`
            }
            // formatter
          },
          series: [
            {
              type: 'wordCloud',
              gridSize: 1,
              sizeRange: [12, 30],
              rotationRange: [-45, 90], // 旋转角度区间
              textPadding: 1,
              shape: 'circle',
              width: 280,
              // height:200,
              textStyle: {
                normal: {
                  color: (params) => {
                    const color = [
                      '#27D38A',
                      '#FFCA1C',
                      '#5DD1FA',
                      '#F88E25',
                      '#47A0FF',
                      '#FD6565'
                    ]
                    const num = Math.floor(Math.random() * (5 + 1))
                    return color[num]
                  }
                },
                emphasis: {
                  shadowBlur: 10,
                  shadowColor: '#cccccc'
                }
              },
              data: data
            }
          ]
        }
      } else {
        const obj = JSON.parse(JSON.stringify(this.tagChartInfo))
        obj.statStruct = obj.statStruct.slice(0, 5)
        option = this.getOption(obj, '标签')
      }
      myChart.setOption(option)
    },
    // 会员年龄
    drawMemberAgeChart(item, num, index) {
      const labelY = []
      const totalList = []
      if (item && item.statStruct) {
        for (const item of item.statStruct) {
          labelY.push(item.item)
          totalList.push(item)
        }
      }
      const dom = document.getElementById('c' + num + (index + 1))
      dom.innerHTML = ''
      dom.removeAttribute('_echarts_instance_')
      const myChart = echarts.init(
        document.getElementById('c' + num + (index + 1))
      )
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          // show: true,
          backgroundColor: 'rgba(250,250,250,0.9)',
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          borderColor: '#930CEA',
          borderWidth: 1,
          textStyle: {
            color: '#333333',
            fontSize: 12,
            fontWeight: 'bolder'
          }
        },
        grid: {
          top: '3%',
          left: '3%',
          right: '10%',
          bottom: '0',
          containLabel: true
        },
        xAxis: [
          {
            type: 'value',
            boundaryGap: true,
            show: false,
            axisLabel: {
              show: true,
              interval: 'auto'
            },
            axisTick: {
              show: false,
              alignWithLabel: true,
              interval: 0
            }
          }
        ],
        yAxis: [
          {
            name: '年龄段',
            type: 'category',
            boundaryGap: true,
            show: true,
            max: 12,
            axisTick: {
              show: false,
              alignWithLabel: true,
              interval: 0
            },
            axisLine: {
              show: false
            },
            axisLabel: {
              show: true,
              interval: 0
            },
            data: labelY.reverse()
          }
        ],
        series: [
          {
            name: '人数',
            type: 'bar',
            stack: '总量',
            barWidth: 10,
            label: {
              show: true,
              position: 'right',
              formatter: (params) => {
                // 格式化数据的函数
                return (params.data.percent * 100).toFixed(2) + '%'
              },
              color: '#333333'
            },
            itemStyle: {
              color: '#74C1F6',
              barBorderRadius: 15,
              height: 5
            },
            data: totalList.reverse()
          }
        ]
      }
      myChart.setOption(option)
    },
    // 注册年龄图表
    drawAgeChart(item, num, index, type) {
      this.ageChartType = type
      if (!item.statStruct) {
        return
      }
      const dom = document.getElementById('c' + num + (index + 1))
      dom.innerHTML = ''
      dom.removeAttribute('_echarts_instance_')
      const myChart = echarts.init(
        document.getElementById('c' + num + (index + 1))
      )
      let option = ''
      const boyList = []
      const grilList = []
      const labelY = []
      const totalList = []
      for (let i = 0; i < item.statStruct.length; i++) {
        for (let x = 0; x < item.statStruct[i].sub.length; x++) {
          if (item.statStruct[i].sub[x].subItem === '男') {
            boyList.push({
              value: item.statStruct[i].sub[x].subValue,
              subPercent: item.statStruct[i].sub[x].subPercent
            })
          }
          if (item.statStruct[i].sub[x].subItem === '女') {
            // console.log(item.statStruct[i].sub[x].subValue)
            // grilList.push([item.statStruct[i].sub[x].subPercent,item.statStruct[i].sub[x].subValue])
            grilList.push({
              value: Number('-' + item.statStruct[i].sub[x].subValue),
              subPercent: item.statStruct[i].sub[x].subPercent
            })
          }
        }
        labelY.push(item.statStruct[i].item)
        totalList.push({
          value: item.statStruct[i].value,
          percent: item.statStruct[i].percent
        })
      }
      if (this.ageChartType === 1) {
        // 分性别绘制
        option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            },
            // show: true,
            backgroundColor: 'rgba(250,250,250,0.9)',
            extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
            borderColor: '#930CEA',
            borderWidth: 1,
            textStyle: {
              color: '#333333',
              fontSize: 12,
              fontWeight: 'bolder'
            },
            formatter: (params) => {
              // 格式化数据的函数
              const num = this.$options.filters['capitalize'](
                Math.abs(params[0].value)
              )
              return (
                params[0].name + '</br>' + params[0].seriesName + ':' + num
              )
            }
          },
          legend: {
            data: ['女性', '男性']
          },
          xAxis: [
            {
              type: 'value',
              gridIndex: 0,
              axisTick: { show: false, inside: false },
              axisLabel: { show: false },
              axisLine: {
                // Y轴轴线样式
                show: false,
                lineStyle: {
                  color: '#000'
                }
              },
              splitLine: {
                show: false
              }
            },
            {
              type: 'value',
              gridIndex: 1,
              axisTick: { show: false }, // 是否显示刻度
              axisLine: {
                // Y轴轴线样式
                show: false, // 是否显示X轴
                lineStyle: {
                  color: '#000'
                }
              },
              axisLabel: {
                show: false // 是否显示X轴内容
              },
              splitLine: {
                show: false
              }
            }
          ],
          yAxis: [
            {
              type: 'category',
              gridIndex: 0,
              inverse: true,
              data: labelY,
              axisTick: { show: false },
              axisLabel: { show: false },
              axisLine: {
                // Y轴轴线样式
                show: false,
                lineStyle: {
                  color: '#000'
                }
              }
            },
            {
              type: 'category',
              gridIndex: 1,
              inverse: true,
              data: labelY,
              axisTick: { show: false },
              axisLabel: {
                align: 'center',
                margin: 30
              },
              axisLine: {
                show: false // 是否显示轴线
              }
            }
          ],
          grid: [
            {
              top: 50,
              width: '38%',
              bottom: 10,
              left: '10%',
              gridIndex: 0
            },
            {
              top: 50,
              bottom: 10,
              left: '60%',
              gridIndex: 1
            }
          ],
          color: ['#2FACFA', '#F5A623'],
          series: [
            {
              name: '女性',
              type: 'bar',
              gridIndex: 0,
              barWidth: 10,
              itemStyle: {
                normal: {
                  show: true,
                  color: '#866CED',
                  barBorderRadius: 50,
                  borderWidth: 0,
                  borderColor: '#333',
                  label: {
                    color: '#495060',
                    show: true,
                    position: 'left',
                    formatter: function(v) {
                      return (v.data.subPercent * 100).toFixed(2) + '%'
                    }
                  }
                }
              },
              data: grilList
            },
            {
              name: '男性',
              type: 'bar',
              xAxisIndex: 1,
              yAxisIndex: 1,
              barWidth: 10,
              itemStyle: {
                normal: {
                  show: true,
                  color: '#74C1F6',
                  barBorderRadius: 50,
                  borderWidth: 0,
                  borderColor: '#333',
                  label: {
                    color: '#495060',
                    show: true,
                    position: 'right',
                    formatter: function(v) {
                      return (v.data.subPercent * 100).toFixed(2) + '%'
                    }
                  }
                }
              },
              data: boyList
            }
          ]
        }
      } else {
        option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            },
            // show: true,
            backgroundColor: 'rgba(250,250,250,0.9)',
            extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
            borderColor: '#930CEA',
            borderWidth: 1,
            textStyle: {
              color: '#333333',
              fontSize: 12,
              fontWeight: 'bolder'
            }
          },
          legend: {
            data: ['支出', '收入']
          },
          grid: {
            top: '3%',
            left: '3%',
            right: '10%',
            bottom: '0',
            containLabel: true
          },
          xAxis: [
            {
              type: 'value',
              boundaryGap: true,
              show: false,
              axisLabel: {
                show: true,
                interval: 'auto'
              },
              axisTick: {
                show: false,
                alignWithLabel: true,
                interval: 0
              }
            }
          ],
          yAxis: [
            {
              name: '年龄段',
              type: 'category',
              boundaryGap: true,
              show: true,
              axisTick: {
                show: false,
                alignWithLabel: true,
                interval: 0
              },
              axisLine: {
                show: false
              },
              axisLabel: {
                show: true,
                interval: 0
              },
              data: labelY.reverse()
            }
          ],
          series: [
            {
              name: '人数',
              type: 'bar',
              stack: '总量',
              barWidth: 10,
              label: {
                show: true,
                position: 'right',
                formatter: (params) => {
                  // 格式化数据的函数
                  return (params.data.percent * 100).toFixed(2) + '%'
                },
                color: '#333333'
              },
              itemStyle: {
                color: '#74C1F6',
                barBorderRadius: 15,
                height: 5
              },
              data: totalList.reverse()
            }
          ]
        }
      }
      myChart.setOption(option)
    },
    delChart(num, index, statNo) {
      // console.log(index)
      // console.log(this.list[num].dataResultVoList)
      this.list[num].dataResultVoList.splice(index, 1)
      // console.log(this.list[num].dataResultVoList)
      this.titleList[num].checkedTitle = this.titleList[
        num
      ].checkedTitle.filter((item) => item !== statNo)
      for (let i = 0; i < this.list[num].dataResultVoList.length; i++) {
        const dom = document.getElementById('c' + num + (i + 1))
        if (dom) {
          dom.innerHTML = ''
          dom.removeAttribute('_echarts_instance_')
        }
      }
      // console.log(this.list[num].dataResultVoList)
      setTimeout(() => {
        this.drawChart(this.list[num].dataResultVoList, num)
      }, 100)
    },
    downLoad(id, status) {
      const downloadUrl = [
        `/userImg/download/info/excel?profileNo=` +
        this.info.profileNo +
        '&statNo=' +
        id +
        '&status=' +
        status
      ]
      downloadUrl.forEach((url) => {
        const iframe = document.createElement('iframe')
        iframe.style.display = 'none'
        iframe.style.height = 0
        iframe.src = url
        document.body.appendChild(iframe)
        setTimeout(() => {
          iframe.remove()
        }, 5 * 60 * 1000)
      })
    },
    downPeople() {
      const iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      iframe.style.height = 0
      iframe.src = this.info.fileName
      document.body.appendChild(iframe)
      setTimeout(() => {
        iframe.remove()
      }, 5 * 60 * 1000)
    },
    computedHistogramWeight(data) {
      if (data.length === 0) {
        return 18
      } else if (data.length <= 4) {
        return 30
      } else if (data.length <= 7) {
        return 24
      } else if (data.length <= 10) {
        return 15
      } else {
        return 10
      }
    },
    // 添加时间段
    addTimePeriod() {
      const valData = this.compareWithColleague.filter((item) => item.value)
      if (valData.length + this.chooseCompareVal.length === 2) {
        this.$message({
          message: '最多可添加两条记录',
          type: 'warning'
        })
        return
      }

      this.compareWithColleague.push({
        value: '',
        id: '',
        timeDisabled: false
      })
      if (this.compareWithColleague && this.compareWithColleague.length === 2) {
        this.compareWithColleagueAdd = false
      } else {
        this.compareWithColleagueAdd = true
      }
    },
    // 删除时间段
    deleteTimePeriod(index) {
      this.compareWithColleague.splice(index, 1)
      this.compareWithColleagueAdd = true
      this.datePickerChange()
    },
    // 获取对比结果
    async getCompareImgList() {
      const result = await createSelfCompareList(this.$route.query.id, {
        currentPage: 1,
        pageSize: 5
      })
      if (result.code === 200) {
        this.comparelist = result.data
      }
      this.dateVisible = true
    },
    datePickerChange(val, index) {
      const startNum = 2
      const valData = this.compareWithColleague.filter((item) => item.value)
      this.maxNum = startNum - valData.length
      // if (valData.length + this.chooseCompareVal.length === 2) { }
      for (const item of this.compareWithColleague) {
        if (!item.value) {
          this.$set(
            item,
            'timeDisabled',
            this.chooseCompareVal.length + valData.length === 2
          )
        }
      }
    },
    histroyChange() {
      for (const item of this.compareWithColleague) {
        this.$set(item, 'timeDisabled', this.chooseCompareVal.length === 2)
      }
    },
    // 创建同人对比
    createSelfCompareImg() {
      if (!this.compareWithColleague) {
        return
      }
      const data = {
        contrastItem: [],
        profileNo: this.$route.query.id
      }
      const profileNo = this.$route.query.id
      const nullData = []
      for (const item of this.compareWithColleague) {
        if (item.value) {
          data.contrastItem.push({
            startTime: item.value ? item.value[0] : '',
            endTime: item.value ? item.value[1] : ''
          })
        } else {
          nullData.push(item)
        }
      }
      if (!data.profileNo) {
        this.$message({
          message: '参数缺失',
          type: 'warning'
        })
        return
      }
      // console.log(this.chooseCompareVal)
      if (
        this.chooseCompareVal.length === 2 ||
        data.contrastItem.length === 0
      ) {
        this.$router.push(
          `/userImg/compareByself?profileNo=${profileNo}&ids=${this.chooseCompareVal.join(
            ','
          )}`
        )
        return
      }

      const _this = this
      createSelfCompare(data)
        .then((res) => {
          if (res.code === 200) {
            _this.$message({
              message: '数据提交成功，计算中...',
              type: 'success'
            })
            _this.dateVisible = false
            _this.compareWithColleague = [{ value: '', id: '' }]
            let ids = []
            if (res.data) {
              for (const item of res.data) {
                ids.push(item.profileNo)
              }
            }
            ids = ids.concat(this.chooseCompareVal)
            _this.chooseCompareVal = []
            _this.maxNum = 2
            _this.$router.push(
              `/userImg/compareByself?ids=${profileNo},${ids.join(',')}`
            )
          }
        })
        .catch((err) => console.log(err))
    },
    // 词云过滤 全选
    handleTagCheckAllChange(val) {
      const allVal = []
      for (const item of this.tagDialogInfo.statStruct) {
        allVal.push(item.item)
      }
      this.checkedTag = val ? allVal : []
    },
    // 词云过滤 反选
    handleReverseChange(val) {
      const checkVal = this.tagDialogInfo.statStruct.filter(
        (tagItem) => this.checkedTag.indexOf(tagItem.item) < 0
      )
      this.checkedTag = []
      for (const tagItem of checkVal) {
        this.checkedTag.push(tagItem.item)
      }
      if (this.checkedTag.length === this.tagDialogInfo.statStruct.length) {
        this.tagCheckAll = false
      } else {
        this.tagCheckAll = true
      }
    },
    // 重新计算
    computedAgain() {
      // console.info('重新计算', this)
      againCompute([this.profileId])
      this.$message({
        message: '操作成功',
        type: 'success'
      })
    }
  }
}
</script>
<style lang="less" scoped>
.pages {
  background: #f5f5f5;

  .el-checkbox {
    width: 180px;
    margin-right: 0;
  }
}

.f12 {
  font-size: 12px;
}

.f14 {
  font-size: 14px;
}

.f18 {
  font-size: 18px;
}

.color99 {
  color: #999999ff;
}

.color33 {
  color: #333333;
}

.pl10 {
  padding-left: 10px;
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

.InfoBox {
  padding: 20px 10px;
  background: #fff;
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

      .el-button {
        height: 32px;
        display: flex;
        align-items: center;
      }

      img {
        width: 16px;
        margin-right: 5px;
      }
    }
  }

  .addBtn {
    text-align: center;
    line-height: 280px;
    color: #ccc;
    font-size: 20px;

    i {
      margin-right: 5px;
    }
  }

  .grid-content {
    margin-right: 5px;
    margin-top: 5px;
    border: 1px solid #dddee1ff;
    border-radius: 3px;
    /*width: 350px;*/
    height: 300px;
    display: flex;
    flex-direction: column;

    &:hover {
      border-color: #930cea;
      cursor: pointer;

      &.addBtn {
        color: #930cea;
      }

      .right {
        i {
          color: #930cea;
        }
      }
    }

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

      .right {
        i {
          cursor: pointer;

          &:hover {
            color: #930cea;
          }
        }
      }
    }

    .chartBox {
      padding: 10px;
      flex: 1;
    }

    .message {
      text-align: center;
      font-size: 20px;
      line-height: 150px;
    }
  }
}

.compareBycolleague {
  /deep/ .el-dialog__body {
    padding-top: 0px;
  }

  .color99 {
    margin-bottom: 40px;
  }
}

.time_add {
  ul {
    li {
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      div {
        margin-left: 10px;
        cursor: pointer;

        img {
          display: inline-block;
          width: 14px;
          height: 14px;
        }

        span {
          font-size: 12px;
          font-weight: 600;
          color: rgba(51, 51, 51, 1);
        }
      }
    }
  }
}

.list {
  padding-top: 10px;

  h5 {
    margin-bottom: 10px;
  }

  /deep/ .el-checkbox__label {
    color: #999797;
  }

  /deep/ .el-checkbox {
    display: block;
    margin-bottom: 10px;
  }
}

.tag_content {
  /deep/ .el-checkbox {
    width: auto;
    margin-right: 20px;
    margin-bottom: 10px;
  }
}

.tipContent {
  ol li {
    list-style-type: decimal;
    list-style-position: inside;
  }
}

.chart {
  overflow: hidden;
  margin-top: 10px;

  .el-row {
    padding: 5px;
    padding-top: 0;
  }

  .title {
    font-size: 14px;
    font-weight: 600;
    color: #333333;
    line-height: 30px;
    border-bottom: 1px solid #dddee1;
    margin: 10px 5px;
  }
}

/deep/ .el-tooltip__popper.is-light {
  broder-color: #30313354 !important;
}
</style>
<style lang="less">
.tip-content {
  color: #000000;
  font-family: Verdana, Arial, Helvetica, sans-serif;
  font-size: 14px;
  line-height: 1.3;
  background-color: red;
  padding-left: 15px;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.04), 0 2px 4px 0 rgba(0, 0, 0, 0.12);

  ul {
    display: block;
    list-style-type: disc;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 10px;
  }

  ol {
    display: block;
    list-style-type: decimal;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 10px;
  }
}
</style>
<!--<style lang="less">-->
<!--  .tooltips{-->
<!--    position: relative;-->
<!--    &:before{-->
<!--      content: '';-->
<!--      width: 0;-->
<!--      height: 0;-->
<!--      border-style: solid;-->
<!--      border-width: 10px 5px 0 5px;-->
<!--      border-color: #930CEAFF transparent transparent;-->
<!--      position: absolute;-->
<!--      bottom: -15px;-->
<!--      left: 5px;-->
<!--    }-->
<!--    &:after{-->
<!--      content: '';-->
<!--      width: 0;-->
<!--      height: 0;-->
<!--      border-style: solid;-->
<!--      border-width: 10px 5px 0 5px;-->
<!--      border-color: #fff transparent transparent;-->
<!--      position: absolute;-->
<!--      bottom: -13px;-->
<!--      left: 5px;-->
<!--    }-->
<!--  }-->
<!--</style>-->
