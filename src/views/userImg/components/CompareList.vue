<template>
  <div style="margin-top: 20px">
    <div class="filter-type-box">
      <div
        v-for="(item, index) of filterTypeOptions"
        :key="item.name"
        class="filter-type-item"
        :class="{ 'filter-type-item-active': item.active }"
        @click="chooseType(index)"
      >
        {{ item.name }}
      </div>
    </div>
    <div
      v-for="(list, num) in showList"
      :id="'b' + (num + 1)"
      :key="num"
      class="listBox"
    >
      <div class="bigTitle" style="padding: 10px">
        {{ list.typeName }}
        <i
          :class="{
            'el-icon-caret-top': list.show,
            'el-icon-caret-bottom': !list.show,
          }"
          @click="changeShow(num, list.show)"
        />
      </div>
      <div v-show="list.show" style="background: #ffffff; padding: 10px">
        <div v-for="(item, index) in list.resultList" :key="index">
          <div class="title">
            <div>
              <b class="f14">{{ item.typeName }}</b>
              <el-tooltip class="item" effect="light" placement="right-start">
                <div
                  slot="content"
                  style="max-width: 200px"
                  v-html="item.description"
                />
                <i class="el-icon-question f14 color99" />
              </el-tooltip>
              <span
                v-if="list.statNo == '012'"
                style="
                  font-size: 12px;
                  cursor: pointer;
                  border-bottom: 1px solid #6d7278;
                  color: #6d7278;
                "
                @click="openTagDialog(num)"
              >词云过滤</span>
            </div>
            <div>
              <i
                class="el-icon-close color99"
                @click="del(num, index, item.type)"
              />
            </div>
          </div>
          <el-row>
            <el-col
              v-for="(col, ol) in item.dataResultVoList"
              :key="col.profileNo"
              :span="8"
            >
              <div
                class="grid-content bg-purple"
                :class="{
                  color1: ol == 0,
                  color2: ol == 1,
                  color3: ol == 2,
                }"
              >
                <p style="text-align: right">
                  <span
                    v-if="item.type == '102'"
                    class="f12"
                  ><em
                    :class="'active1' + num + index + ol"
                    @click="drawAgeChart(col.resultVo, num, index, ol, 1)"
                  >分性别</em>
                    |
                    <em
                      :class="'active2' + num + index + ol"
                      @click="drawAgeChart(col.resultVo, num, index, ol, 2)"
                    >合计</em></span>
                  <span
                    v-if="item.type == '401'"
                    class="f12"
                  ><em
                    :class="'active1' + num + index + ol"
                    @click="drawtagChart(col.resultVo, num, index, ol, 1)"
                  >柱状图</em>
                    |
                    <em
                      :class="'active2' + num + index + ol"
                      @click="drawtagChart(col.resultVo, num, index, ol, 2)"
                    >词云图</em></span>
                </p>
                <h3 class="f12">{{ col.resultVo.titleDesc }}</h3>
                <div
                  v-if="
                    item.type == '300' ||
                      item.type == '301' ||
                      item.type == '306' ||
                      item.type == '500' ||
                      item.type == '501' ||
                      item.type == '506'
                  "
                  class="f12 color99 pl10"
                  style="text-align: center"
                >
                  总订单数：<span
                    class="f14 color33"
                    style="font-weight: bolder; margin-right: 5px"
                  >{{ col.resultVo.total | currency }}</span>
                  {{ col.resultVo.statName }}：<span
                    class="f14 color33"
                    style="font-weight: bolder"
                  >{{ col.resultVo.avg }}</span>
                </div>
                <div
                  v-if="item.type == '302' || item.type == '502'"
                  class="f12 color99 pl10"
                  style="text-align: center"
                >
                  总件数：<span
                    class="f14 color33"
                    style="font-weight: bolder; margin-right: 5px"
                  >{{ col.resultVo.total | currency }}</span>
                  {{ col.resultVo.statName }}：<span
                    class="f14 color33"
                    style="font-weight: bolder"
                  >{{ col.resultVo.avg }}</span>
                </div>
                <div
                  v-if="
                    item.type == '303' ||
                      item.type == '304' ||
                      item.type == '305' ||
                      item.type == '307' ||
                      item.type == '503' ||
                      item.type == '504' ||
                      item.type == '505' ||
                      item.type == '507'
                  "
                  class="f12 color99 pl10"
                  style="text-align: center"
                >
                  总人数：<span
                    class="f14 color33"
                    style="font-weight: bolder; margin-right: 5px"
                  >{{ col.resultVo.total | currency }}</span>
                  {{ item.typeName }}：<span
                    class="f14 color33"
                    style="font-weight: bolder"
                  >{{ col.resultVo.avg }}</span>
                </div>
                <div
                  v-show="col.resultVo.statStruct"
                  :id="'c' + num + index + ol"
                  class="chartBox"
                />
                <div v-if="!col.resultVo.statStruct" class="message">
                  {{ col.resultVo.resultDescription }}
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
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
        >全选</el-checkbox>
        <el-checkbox
          v-model="checkDefault"
          @change="defaultChange"
        >默认模块</el-checkbox>
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

    <el-dialog title="词云过滤" :visible.sync="tagChartVisible">
      <el-checkbox-group v-model="checkedTag">
        <el-checkbox
          v-for="city in tagDialogInfo.statStruct"
          :key="city.item"
          :label="city.item"
        >{{ city.item }}</el-checkbox>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button @click="tagChartVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeTagDialog">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { configList, userImgDetailMutiple, setDefaultNos } from '@api/userImg'
import echarts from 'echarts'
require('echarts-wordcloud')
import 'echarts/theme/macarons.js'
import 'echarts-wordcloud/dist/echarts-wordcloud'

export default {
  filters: {
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
  data() {
    return {
      ids: '',
      checkDefault: true,
      ageChartType: 1,
      tagChartType: 1,
      isIndeterminate: true,
      checkAll: false,
      titleList: [],
      initiaTitle: [], // 初始要选中的默认
      checkedTitle: [], // 默认选中的
      initialList: [], // 初始所有结果
      showList: [], // 要展示的结果
      allList: [],
      dialogFormVisible: false,
      checkedTag: [], // 过滤词云选中的标签
      tagChartVisible: false, // 过滤词云
      tagChartInfo: [], // 标签词语图 过滤后要展示的数据
      tagDialogInfo: '', // 过滤词云弹框要展示的标签
      activeName: '',
      filterTypeOptions: [
        {
          id: '0',
          name: '全部',
          active: true
        },
        {
          id: '1',
          name: '用户属性',
          active: false
        },
        {
          id: '2',
          name: '用户行为分析',
          active: false
        },
        {
          id: '3',
          name: '交易分析',
          active: false
        },
        {
          id: '4',
          name: '其他',
          active: false
        },
        {
          id: '5',
          name: '品类画像-咖啡',
          active: false
        }
      ]
    }
  },
  methods: {
    handleClick() {},
    getUserImgDetail(id, statNo) {
      userImgDetailMutiple({
        profileNo: this.ids,
        statNo: statNo.toString()
      }).then((res) => {
        if (res.code === 200) {
          this.showList = res.data.dataList
          this.allList = res.data.dataList
          for (const i in this.showList) {
            this.showList[i].show = true
            this.$set(this.showList[i], 'show', true)
            for (const o in this.showList[i].resultList) {
              this.$nextTick(function() {
                this.drawChart(this.showList[i].resultList[o], i, o)
              })
            }
          }
        }
      })
    },
    changeShow(num, show) {
      if (show) {
        this.$set(this.showList[num], 'show', false)
      } else {
        this.$set(this.showList[num], 'show', true)
      }
      this.$forceUpdate()
    },
    async setDefault(list) {
      console.log(this.titleList)
      await setDefaultNos({
        statNo: list
      })
    },
    getTitleList(ids) {
      configList().then((res) => {
        this.ids = ids
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
          this.allcheckedIds = list
          this.$nextTick(function() {
            this.getUserImgDetail(ids, this.allcheckedIds)
          })
        }
      })
    },
    // 要显示的图表List
    getShowList() {
      this.checkedTitle = this.checkedTitle.sort()
      const list = this.initialList.filter((item) =>
        this.checkedTitle.some((e) => e === item.statNo)
      )
      return list
    },
    openTagDialog(index) {
      this.tagChartVisible = true
      this.tagIndex = index
    },
    // 过滤词云
    changeTagDialog() {
      this.tagChartVisible = false
      const list = this.tagDialogInfo.statStruct.filter((item) =>
        this.checkedTag.some((e) => e === item.item)
      )
      this.tagChartInfo.forEach((item, index) => {
        item.statStruct = JSON.parse(JSON.stringify(list))
        this.drawtagChart(item, this.tagIndex, index, 1)
      })
      //
    },
    clearChart() {
      for (const x in this.showList) {
        for (const y in this.showList[x].resultList) {
          for (const z in this.showList[x].resultList[y].dataResultVoList) {
            const dom = document.getElementById('c' + x + y + z)
            if (dom) {
              dom.innerHTML = ''
              dom.removeAttribute('_echarts_instance_')
            }
          }
        }
      }
    },
    drawChart(row, num, index) {
      const vars = {}
      for (let j = 0; j < row.dataResultVoList.length; j++) {
        // if (row[j].type === "012") {
        //   this.$set(this, "tagChartInfo", row[j].list);
        //   this.$set(
        //     this,
        //     "tagDialogInfo",
        //     JSON.parse(JSON.stringify(row[j].list[0]))
        //   );
        //   const tagList = [];
        //   for (const o in row[j].list[0].statStruct) {
        //     tagList.push(row[j].list[0].statStruct[o].item);
        //   }
        //   this.checkedTag = tagList;
        // }

        const statNo = row.type
        const list = row.dataResultVoList[j].resultVo
        if (statNo === '102') {
          this.drawAgeChart(list, num, index, j, 2)
        } else if (statNo === '107') {
          this.drawMemberAgeChart(list, num, index, j)
        } else if (statNo === '401') {
          this.drawtagChart(list, num, index, j, 1)
        } else {
          const xData = []
          const yData = []
          const varName = 'chart' + j
          // 会员等级分布数据特殊处理
          if (statNo === '103') {
            list.statStruct.forEach((list) => {
              if (list.sub[0]) {
                list.mes =
                  '其中' +
                  (list.sub[0].subPercent * 100).toFixed(2) +
                  '%也为' +
                  list.sub[0].subItem
              }
            })
          }
          if (statNo === '105') {
            list.statStruct.forEach((item) => {
              // console.log(item)
              if (item) {
                item.br = true
              }
            })
          }
          if (!list.statStruct) {
            continue
          }
          list.statStruct.forEach((list) => {
            xData.push(list.item)
            yData.push({
              value: list.percent * 100,
              percent: list.percent,
              item: list
            })
          })
          let option = {}
          vars[varName] = echarts.init(
            document.getElementById('c' + num + index + j)
          )
          const yInterval = Number(list.maxPercent / 5)
          // console.log(yInterval)
          // 饼图  使用echart组件
          if (
            statNo === '101' ||
            statNo === '103' ||
            statNo === '104' ||
            statNo === '105' ||
            statNo === '108' ||
            statNo === '109' ||
            statNo === '111' ||
            statNo === '112' ||
            statNo === '400'
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
                  if (list.statNo === '001') {
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
                  hoverAnimation: false,
                  type: 'pie',
                  radius: ['30%', '50%'],
                  center: ['50%', '50%'],
                  avoidLabelOverlap: true,
                  label: {
                    show: true,
                    color: '#333333',
                    fontSize: 12,
                    position: 'outside',
                    formatter: (params) => {
                      // 格式化数据的函数
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
                        fontSize: 10,
                        fontWeight: 'bolder',
                        lineHeight: 16
                      }
                    }
                  },
                  emphasis: {
                    label: {
                      show: true,
                      fontSize: '12'
                    }
                  },
                  labelLine: {
                    show: true
                  },
                  data: list.statStruct
                }
              ]
            }
          }
          // 折线图
          if (
            statNo === '200' ||
            statNo === '202' ||
            statNo === '208' ||
            statNo === '209' ||
            statNo === '508' ||
            statNo === '509'
          ) {
            option = {
              xAxis: {
                type: 'category',
                name: '时间段',
                axisLine: {
                  lineStyle: {
                    color: '#B6B6B6'
                  }
                },
                axisTick: {
                  show: false,
                  alignWithLabel: true,
                  interval: 0
                },
                axisLabel: {
                  interval: 0,
                  formatter: function(value) {
                    if (value.indexOf('(') !== -1) {
                      value = value.slice(0, value.indexOf('('))
                    }
                    let result = '' // 拼接加\n返回的类目项
                    const maxLength = 4 // 每项显示文字个数
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
                name: '人数占比',
                nameLocation: 'end',
                nameGap: 20,
                minInterval: 1,
                min: 0,
                max: list.maxPercent,
                interval: yInterval,
                axisLine: {
                  lineStyle: {
                    color: '#B6B6B6'
                  }
                },
                axisTick: {
                  show: false
                },
                axisLabel: {
                  show: true,
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
                  symbolSize: 6,
                  type: 'line',
                  lineStyle: {
                    // 线条的配置
                    color: '#866CED'
                  },
                  itemStyle: {
                    // 折现拐点的配置
                    color: '#866CED'
                  }
                }
              ]
            }
          }
          // 柱状图
          if (
            statNo === '106' ||
            statNo === '110' ||
            statNo === '201' ||
            statNo === '203' ||
            statNo === '204' ||
            statNo === '205' ||
            statNo === '206' ||
            statNo === '207' ||
            statNo === '300' ||
            statNo === '301' ||
            statNo === '302' ||
            statNo === '303' ||
            statNo === '304' ||
            statNo === '305' ||
            statNo === '306' ||
            statNo === '307' ||
            statNo === '500' ||
            statNo === '501' ||
            statNo === '502' ||
            statNo === '503' ||
            statNo === '504' ||
            statNo === '505' ||
            statNo === '506' ||
            statNo === '507'
          ) {
            let titleName = ''
            if (statNo === '106') {
              titleName = '年份'
            } else if (
              statNo === '204' ||
              statNo === '205' ||
              statNo === '302' ||
              statNo === '303' ||
              statNo === '304' ||
              statNo === '306' ||
              statNo === '307' ||
              statNo === '502' ||
              statNo === '503' ||
              statNo === '504' ||
              statNo === '506' ||
              statNo === '507'
            ) {
              titleName = '元'
            } else if (statNo === '206' || statNo === '207') {
              titleName = '商圈'
            } else if (statNo === '305' || statNo === '505') {
              titleName = '次数'
            } else if (
              statNo === '300' ||
              statNo === '301' ||
              statNo === '500' ||
              statNo === '501'
            ) {
              titleName = '件'
            }
            option = this.getOption(list, titleName)
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
        xData.push(list.item)
        yData.push({
          value: list.percent * 100,
          percent: list.percent,
          item: list
        })
      })
      const yInterval = Number(info.maxPercent / 5)
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
      const option = {
        xAxis: {
          type: 'category',
          name: titleName,
          axisLine: {
            lineStyle: {
              color: '#B6B6B6'
            }
          },
          axisTick: {
            show: false,
            alignWithLabel: true,
            interval: 0
          },
          axisLabel: {
            interval: 0,
            formatter: function(value) {
              if (value.indexOf('(') !== -1) {
                value = value.slice(0, value.indexOf('('))
              }

              let result = '' // 拼接加\n返回的类目项
              let maxLength = 3 // 每项显示文字个数
              if (
                info.statNo === '105' ||
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
        yAxis: {
          type: 'value',
          name: yAxisName,
          nameLocation: 'end',
          nameGap: 20,
          min: 0,
          max: info.maxPercent,
          interval: yInterval,
          axisLine: {
            lineStyle: {
              color: '#B6B6B6'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: true,
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
            barWidth: 15,
            label: {
              show: true,
              position: 'top',
              formatter: (params) => {
                // 格式化数据的函数
                return (params.data.percent * 100).toFixed(2) + '%'
              },
              color: '#333333'
            },
            data: yData,
            type: 'bar'
          }
        ]
      }
      return option
    },
    // 标签词云
    drawtagChart(item, row, index, ol, type) {
      this.tagChartType = type
      const dom = document.getElementById('c' + row + index + ol)
      if (dom) {
        dom.innerHTML = ''
        dom.removeAttribute('_echarts_instance_')
      }
      if (!item.statStruct) {
        return
      }
      const myChart = echarts.init(
        document.getElementById('c' + row + index + ol)
      )
      let option = ''
      if (this.tagChartType === 2) {
        // 绘制字符云
        document.getElementsByClassName(
          'active1' + row + index + ol
        )[0].style.color = '#333333'
        document.getElementsByClassName(
          'active2' + row + index + ol
        )[0].style.color = '#930CEA'
        const data = []

        for (const i in item.statStruct) {
          data.push({
            name: item.statStruct[i].item,
            value: item.statStruct[i].value
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
              color: '#333333',
              fontSize: 12,
              fontWeight: 'bolder'
            },
            formatter: (params) => {
              // 格式化数据的函数
              // const num = this.$options.filters['capitalize'](params.data.value)
              return (
                '<span style="float:left;">' +
                params.data.name +
                '</span></br>' +
                '\n' +
                '人数：' +
                params.data.value
              )
            }
            // formatter:
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
        document.getElementsByClassName(
          'active1' + row + index + ol
        )[0].style.color = '#930CEA'
        document.getElementsByClassName(
          'active2' + row + index + ol
        )[0].style.color = '#333333'
        const obj = JSON.parse(JSON.stringify(item))
        if (obj.statStruct) {
          obj.statStruct = obj.statStruct.slice(0, 5)
        }
        option = this.getOption(obj, '标签')
      }
      myChart.setOption(option)
    },
    // 会员年龄
    drawMemberAgeChart(item, row, index, ol, type) {
      const labelY = []
      const totalList = []
      if (item && item.statStruct) {
        for (const item of item.statStruct) {
          labelY.push(item.item)
          totalList.push(item)
        }
      }
      const dom = document.getElementById('c' + row + index + ol)
      if (dom) {
        dom.innerHTML = ''
        dom.removeAttribute('_echarts_instance_')
      }

      const myChart = echarts.init(
        document.getElementById('c' + row + index + ol)
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
    drawAgeChart(item, row, index, ol, type) {
      this.ageChartType = type
      // console.log(item)
      if (!item.statStruct) {
        return
      }
      const dom = document.getElementById('c' + row + index + ol)
      if (dom) {
        dom.innerHTML = ''
        dom.removeAttribute('_echarts_instance_')
      }

      const myChart = echarts.init(
        document.getElementById('c' + row + index + ol)
      )
      let option = ''
      // const data = []
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
        document.getElementsByClassName(
          'active1' + row + index + ol
        )[0].style.color = '#930CEA'
        document.getElementsByClassName(
          'active2' + row + index + ol
        )[0].style.color = '#333333'
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
        document.getElementsByClassName(
          'active2' + row + index + ol
        )[0].style.color = '#930CEA'
        document.getElementsByClassName(
          'active1' + row + index + ol
        )[0].style.color = '#333333'
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
            left: '10%',
            right: '10%',
            bottom: 10,
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
      // vars[varName].render();
      myChart.setOption(option)
    },
    changeDialog() {
      this.clearChart()
      const list = []
      for (const i in this.titleList) {
        for (const o in this.titleList[i].checkedTitle) {
          list.push(this.titleList[i].checkedTitle[o])
        }
      }
      this.dialogFormVisible = false
      if (this.checkDefault) {
        this.setDefault(list)
      }
      this.getUserImgDetail(this.ids, list)
    },
    getArrDifference(arr1, arr2) {
      return arr1.concat(arr2).filter(function(v, i, arr) {
        return arr.indexOf(v) === arr.lastIndexOf(v)
      })
    },
    // 选择默认模块
    defaultChange() {
      if (this.checkDefault) {
        this.checkedTitle = this.initiaTitle
      } else {
        // const arr = this.checkedTitle.concat(this.initiaTitle)
        const list = this.getArrDifference(this.checkedTitle, this.initiaTitle)
        this.checkedTitle = list
      }
      this.isIndeterminate = true
    },
    handleCheckAllChange(val) {
      for (const i in this.titleList) {
        this.titleList[i].checkedTitle = this.titleList[i].allTitle
        this.allcheckedIds = this.allcheckedIds.concat(
          this.titleList[i].checkedTitle
        )
      }
      console.log(this.allcheckedIds)
    },
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.titleList.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.titleList.length
    },
    handleCheckedCitiesChange2(value) {
      console.log(value)
      this.$forceUpdate()
      // this.titleList[index].checkedTitle = value
    },
    chooseType(index) {
      let type = ''
      for (const item of this.filterTypeOptions) {
        this.$set(item, 'active', false)
        if (this.filterTypeOptions[index].name === item.name) {
          this.$set(item, 'active', true)
          type = this.filterTypeOptions[index].id
        }
      }
      this.clearChart()
      console.log(type)
      if (type === '0') {
        this.showList = this.allList
      } else {
        this.showList = this.allList.filter((item) => item.type === type)
      }

      console.log(this.showList)

      for (const i in this.showList) {
        this.showList[i].show = true
        this.$set(this.showList[i], 'show', true)
        for (const o in this.showList[i].resultList) {
          this.$nextTick(function() {
            this.drawChart(this.showList[i].resultList[o], i, o)
          })
        }
      }
    },
    del(num, index, statNo) {
      console.log(this.showList[num].resultList[index])
      this.showList[num].resultList.splice(index, 1)
      for (
        let i = 0;
        i < this.showList[num].resultList[index].dataResultVoList.length;
        i++
      ) {
        const dom = document.getElementById('c' + num + index + i)
        if (dom) {
          dom.innerHTML = ''
          dom.removeAttribute('_echarts_instance_')
        }
      }
      this.$nextTick(function() {
        // this.drawChart(this.showList);
        for (const i in this.showList) {
          for (const o in this.showList[i].resultList) {
            this.drawChart(this.showList[i].resultList[o], i, o)
          }
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.filter-type-box {
  display: flex;
  height: 35px;
  line-height: 35px;
  margin-top: 15px;
  border-bottom: 1px solid #e0e6ed;
  padding-left: 20px;
  font-size: 13px;
  font-weight: 400;
  color: #a3a3a3;
  background: #ffffff;
  .filter-type-item {
    padding: 0 8px;
    margin-right: 20px;
    position: relative;
    font-weight: 600;
    cursor: pointer;
  }

  .filter-type-item-active {
    color: #9e0aed;

    &:before {
      width: 100%;
      height: 2px;
      background-color: #9e0aed;
      content: "";
      position: absolute;
      bottom: -1px;
      left: 0;
    }
  }
}
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
  span {
    font-size: 16px;
    color: #333333ff;
    margin-left: 5px;
    font-weight: bolder;
  }
}
.listBox {
  border-radius: 3px;
  margin-top: 10px;
  .bigTitle {
    font-size: 14px;
    font-weight: 600;
    color: #686161;
    line-height: 20px;
    i {
      background-color: #930cea;
      color: #ffffff;
      border-radius: 2px;
    }
  }
  .grid-content {
    margin-right: 5px;
    margin-top: 5px;
    border: 1px solid #dddee1ff;
    border-radius: 3px;
    padding: 10px;
    height: 280px;
    display: flex;
    flex-direction: column;
    .active {
      color: #930cea;
    }
    h3 {
      text-align: center;
    }
    &.color1 {
      border-color: #6dd400;
    }
    &.color2 {
      border-color: #f7b500;
    }
    &.color3 {
      border-color: #32c5ff;
    }
    .message {
      text-align: center;
      font-size: 20px;
      line-height: 150px;
    }
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
.chartBox {
  flex: 1;
}
.el-icon-close {
  cursor: pointer;
}
</style>
