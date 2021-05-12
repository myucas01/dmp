<template>
  <div>
    <!-- header-->
    <div class="detail-header">
      <h5>{{ this.$route.params.type | chartName }}</h5>
      <button @click="downData">
        <svg-icon icon-class="operate-down" />
        <span>下载统计结果</span>
      </button>
    </div>
    <!-- filter-->
    <div class="filter-box">
      <div class="filter-item"><span>选择时间:</span>
        <el-date-picker
          v-model="timeRange"
          type="monthrange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始月份"
          end-placeholder="结束月份"
          value-format="yyyy-MM"
          @change="handleChange"
        />
      </div>
    </div>
    <!-- content-->
    <div v-show="!noDataStatus" class="detail-echarts">
      <div v-if="this.$route.params.type === 'transform_info'" class="echarts-item">
        <div class="echarts-item-header">
          <span>会员转化趋势</span>
        </div>
        <div id="echarts-item-trend" class="echarts-item-content" />
      </div>
      <div v-if="this.$route.params.type === 'transform_info'" class="echarts-item">
        <div class="echarts-item-header">
          <span>会员转化趋势累计</span>
        </div>
        <div id="echarts-item-trend-all" class="echarts-item-content" />
      </div>
      <div v-if="this.$route.params.type === 'frequency_analysis'" class="echarts-item">
        <div class="echarts-item-header">
          <span>粘分析-支付顾客</span>
        </div>
        <div id="echarts-item-frequency" class="echarts-item-content" />
      </div>
      <div v-if="this.$route.params.type === 'arpu_analysis'" class="echarts-item">
        <div class="echarts-item-header">
          <span>值分析-支付顾客</span>
        </div>
        <div id="echarts-item-value" class="echarts-item-content" />
      </div>
      <div v-if="this.$route.params.type === 'retention'" class="echarts-item">
        <div id="echarts-item-viscosity" class="echarts-item-content" />
      </div>
      <div id="echarts-footer" class="echarts-footer" />
    </div>
    <div v-show="noDataStatus" class="detail-echarts no-data">
      暂无数据
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { retentionCharts, transformationTrend, frequenceCharts, arpuCharts, downEchartsData } from '@/api/operate'
import { formatAmount } from '@/utils/index'

export default {
  name: 'Detail',
  filters: {
    chartName(val) {
      if (val) {
        const typeMap = {
          transform_info: '会员转化趋势',
          frequency_analysis: '粘分析',
          arpu_analysis: '值分析',
          retention: '进-活留存率分析'
        }
        return typeMap[val]
      } else {
        return '-'
      }
    }
  },
  data() {
    return {
      timeRange: '',
      title: '',
      labelOption: {
        show: true,
        color: '#3F3F3F',
        position: 'top'
      },
      resultData: '',
      code: '',
      noDataStatus: false,
      mockData: [
        [0, 0, 100],
        [0, 1, 90],
        [0, 2, 10],
        [0, 3, 100],
        [0, 4, 100],
        [0, 5, 100]
      ]
    }
  },
  mounted() {
    const { type } = this.$route.params
    const { startDate, endDate } = this.$route.query
    this.timeRange = [startDate, endDate]
    this.getData(type)
  },
  methods: {
    handleChange(val) {
      const { type } = this.$route.params
      this.getData(type, val[0], val[1])
    },
    // 获取详情数据
    async getData(type, startTime, endTime) {
      const { classify, classifyType, source, startDate, endDate, lifeCycleValue, repurchase } = this.$route.query
      const params = {
        classify: classify,
        classifyType: classifyType,
        startDate: startTime || startDate,
        endDate: endTime || endDate,
        source: source,
        lifeCycle: lifeCycleValue,
        repurchase: repurchase
      }
      let result
      // 粘分析
      if (type === 'frequency_analysis') {
        result = await frequenceCharts(params)
        if (result.code === 200 && result.data) {
          this.resultData = result.data
          this.code = result.data.code
          if (result.data.targets && result.data.targets.length > 0) {
            this.noDataStatus = false
          } else {
            this.noDataStatus = true
          }
          this.viscosityChart('echarts-item-frequency')
        }
      }
      // 值分析
      if (type === 'arpu_analysis') {
        result = await arpuCharts(params)
        if (result.code === 200 && result.data) {
          this.resultData = result.data
          this.code = result.data.code
          if (result.data.targets && result.data.targets.length > 0) {
            this.noDataStatus = false
          } else {
            this.noDataStatus = true
          }
          this.viscosityChart('echarts-item-value')
        }
      }
      // 进-活 留存率
      if (type === 'retention') {
        result = await retentionCharts(params)
        if (result.code === 200 && result.data) {
          this.resultData = result.data
          this.code = result.data.code
          if (result.data.targets && result.data.targets.length > 0) {
            this.noDataStatus = false
          } else {
            this.noDataStatus = true
          }
          this.retentionCharts('echarts-item-viscosity')
        }
      }
      // 会员转化趋势
      if (type === 'transform_info') {
        result = await transformationTrend(params)
        if (result.code === 200 && result.data) {
          this.resultData = result.data
          this.code = result.data.code
          if (result.data.infoVo.targetList && result.data.infoVo.targetList.length > 0) {
            this.noDataStatus = false
          } else {
            this.noDataStatus = true
          }
          this.trendChart()
          this.trendCumulativeChart()
        }
      }
    },
    // 会员转化趋势 图
    trendChart() {
      const options = {
        xAxis: {
          data: this.resultData.infoVo.dateList,
          axisLine: {
            onZero: true,
            show: true,
            lineStyle: {
              color: 'rgba(0, 0, 0, 0.15)',
              width: 2
            }
          },
          splitLine: { show: false },
          splitArea: { show: false },
          axisLabel: {
            color: 'rgba(0, 0, 0, 0.45)'
          },
          zlevel: 100
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisLabel: {
            color: 'rgba(0, 0, 0, 0.45)'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
            shadowStyle: {
              color: 'rgb(181,178,178)',
              opacity: 0.1
            }
          },
          borderColor: 'rgba(201, 133, 245, 1)',
          backgroundColor: '#fff',
          borderWidth: 2,
          textStyle: {
            color: '#333333',
            fontSize: 12
          }
        },
        legend: {
          bottom: 80
        },
        grid: {
          bottom: 150
        },
        series: [
          {
            name: '转入的会员ID数',
            type: 'bar',
            stack: 'one',
            itemStyle: {
              normal: {
                color: '#A28AFF'
              }
            },
            data: this.resultData.infoVo.targetList[0].values,
            label: this.labelOption
          },
          {
            name: '转走的会员ID数',
            type: 'bar',
            stack: 'one',
            itemStyle: {
              normal: {
                color: '#C4B5FD'
              }
            },
            data: this.resultData.infoVo.targetList[2].values,
            label: {
              ...this.labelOption,
              position: 'bottom'
            }
          },
          {
            name: '转入的会员人头数',
            type: 'bar',
            stack: 'two',
            itemStyle: {
              normal: {
                color: '#FAB8FF'
              }
            },
            data: this.resultData.infoVo.targetList[1].values,
            label: this.labelOption
          },
          {
            name: '转走的会员人头数',
            type: 'bar',
            stack: 'two',
            itemStyle: {
              normal: {
                color: '#FCDCFF'
              }
            },
            data: this.resultData.infoVo.targetList[3].values,
            label: {
              ...this.labelOption,
              position: 'bottom'
            }
          }
        ]
      }
      const dom = document.getElementById('echarts-item-trend')
      const charts = echarts.init(dom)
      charts.setOption(options)
    },
    // 会员转化趋势累计 图
    trendCumulativeChart() {
      const options = {
        xAxis: {
          data: this.resultData.totalVo.dateList,
          axisLine: {
            onZero: true,
            show: true,
            lineStyle: {
              color: 'rgba(0, 0, 0, 0.15)',
              width: 2
            }
          },
          splitLine: { show: false },
          splitArea: { show: false },
          axisLabel: {
            color: 'rgba(0, 0, 0, 0.45)'
          },
          zlevel: 100
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisLabel: {
            color: 'rgba(0, 0, 0, 0.45)'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            lineStyle: {
              type: 'dashed',
              color: 'rgba(73, 80, 96, 1)',
              width: 1
            }
          },
          borderColor: 'rgba(201, 133, 245, 1)',
          backgroundColor: '#fff',
          borderWidth: 2,
          textStyle: {
            color: '#333333',
            fontSize: 12
          }
        },
        legend: {
          bottom: 80
        },
        grid: {
          bottom: 150
        },
        series: [
          {
            name: '累计总数',
            type: 'line',
            data: this.resultData.totalVo.targetList[0].values,
            symbol: 'emptyCircle',
            symbolSize: 2,
            sampling: 'average',
            itemStyle: {
              normal: {
                color: 'rgba(104, 152, 249, 1)'
              }
            }
          },
          {
            name: '会员小记',
            type: 'line',
            symbol: 'emptyCircle',
            symbolSize: 2,
            sampling: 'average',
            data: this.resultData.totalVo.targetList[1].values,
            itemStyle: {
              normal: {
                color: 'rgba(255, 165, 91, 1)'
              }
            }
          },
          {
            name: '累计转走支付ID数',
            type: 'line',
            symbol: 'emptyCircle',
            symbolSize: 2,
            sampling: 'average',
            data: this.resultData.totalVo.targetList[2].values,
            itemStyle: {
              normal: {
                color: 'rgba(109, 216, 173, 1)'
              }
            }
          },
          {
            name: '累计转走人头数',
            type: 'line',
            symbol: 'emptyCircle',
            symbolSize: 2,
            sampling: 'average',
            data: this.resultData.totalVo.targetList[3].values,
            itemStyle: {
              normal: {
                color: 'rgba(246, 189, 22, 1)'
              }
            }
          }
        ]
      }
      const dom = document.getElementById('echarts-item-trend-all')
      const charts = echarts.init(dom)
      charts.setOption(options)
    },
    // 粘/值分析 - 支付顾客
    viscosityChart(target) {
      const option = {
        title: [
          {
            text: '历史累计至当月活的总人数',
            left: 'left',
            top: 0,
            show: false
          },
          {
            text: '当月所在列的订单均值：订单数/总人数',
            left: '7%',
            top: '73%',
            textStyle: {
              fontSize: 12,
              color: '#333'
            }
          }
        ],
        tooltip: {
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
            shadowStyle: {
              color: 'rgb(181,178,178)',
              opacity: 0.1
            }
          },
          borderColor: 'rgba(201, 133, 245, 1)',
          backgroundColor: '#fff',
          borderWidth: 2,
          textStyle: {
            color: '#333333',
            fontSize: 12
          },
          formatter: (val) => {
            return `<div> <h5>${val.name} ${target === 'echarts-item-frequency' ? '粘' : '值'}-累计笔数均值</h5> <p>本月：${formatAmount(val.data[2])}${target === 'echarts-item-frequency' ? '笔' : '元'}</p><p>初期：${this.resultData.targets[val.dataIndex][3].toFixed(2)}${target === 'echarts-item-frequency' ? '笔' : '元'}</p></div>`
          },
          rich: {
            a: {
              color: '#495060',
              lineHeight: 20,
              fontSize: 12,
              fontWeight: 600
            },
            'b': {
              color: '#495060',
              lineHeight: 10,
              fontSize: 12
            }
          }
        },
        grid: [
          { left: '7%', top: '3%', height: '65%' },
          { left: '7%', top: '76%', height: '6%' }
        ],
        xAxis: [
          {
            type: 'category',
            gridIndex: 0,
            data: this.resultData.xaxis,
            splitArea: {
              show: true
            },
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#333333'
              }
            }
          },
          {
            type: 'category',
            gridIndex: 1,
            data: this.resultData.xaxis,
            splitLine: {
              show: false
            },
            splitArea: {
              show: false
            },
            axisTick: {
              show: false,
              alignWithLabel: false
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#333333'
              }
            },
            axisLabel: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            type: 'category',
            gridIndex: 0,
            data: this.resultData.yaxis,
            splitArea: {
              show: true
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#333333'
              }
            },
            axisTick: {
              alignWithLabel: true
            }
          },
          {
            type: 'category',
            gridIndex: 1,
            data: ['2020-10'],
            splitArea: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisLabel: {
              show: false
            },
            axisTick: {
              show: false,
              alignWithLabel: false
            }
          }
        ],
        visualMap: [
          {
            min: 0,
            max: 2000000,
            seriesIndex: 0,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: '10%',
            itemHeight: 330,
            inRange: {
              color: [
                'rgba(253, 255, 213, 1)',
                'rgba(111, 197, 189, 1)',
                'rgba(46, 101, 175, 1)',
                'rgba(19, 24, 95, 1)'
              ]
            }
          },
          {
            show: false,
            min: 0,
            max: 2000000,
            seriesIndex: 1,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: '18%',
            itemHeight: 330,
            inRange: {
              color: [
                '#E2EDFD'
              ]
            }
          }
        ],
        series: [
          {
            name: 'Punch Card',
            type: 'heatmap',
            xAxisIndex: 0,
            yAxisIndex: 0,
            data: this.resultData.targets.map(item => {
              return [item[1], item[0], item[2] || '-']
            }),
            label: {
              show: true,
              color: '#333',
              formatter: function(val) {
                if (val.data[2] > 500000) {
                  return '{a|' + formatAmount(val.data[2]) + '}'
                } else {
                  return '{b|' + formatAmount(val.data[2]) + '}'
                }
              },
              rich: {
                a: {
                  color: '#fff'
                },
                b: {
                  color: '#333333'
                }
              }
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          },
          {
            name: 'Punch Card',
            type: 'heatmap',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: this.mockData.map(item => {
              return [item[1], item[0], item[2] || '-']
            }),
            label: {
              show: true,
              formatter: function(val) {
                if (val.data[2] > 500000) {
                  return '{a|' + formatAmount(val.data[2]) + '}'
                } else {
                  return '{b|' + formatAmount(val.data[2]) + '}'
                }
              },
              rich: {
                a: {
                  color: '#fff'
                },
                b: {
                  color: '#333333'
                }
              }
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      const dom = document.getElementById(target)
      const charts = echarts.init(dom)
      charts.setOption(option)
    },
    // 留存率
    retentionCharts() {
      const option = {
        title: [
          {
            text: '历史累计至当月活的总人数',
            left: '7%',
            top: '3%',
            textStyle: {
              fontSize: 12,
              color: '#333'
            }
          },
          {
            text: '历史累计至当月活的总人数',
            left: 'left',
            top: 0,
            show: false
          },
          {
            text: '历史累计至当月活的总人数',
            left: '7%',
            bottom: '17%',
            textStyle: {
              fontSize: 12,
              color: '#333'
            }
          }
        ],
        tooltip: {
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
            shadowStyle: {
              color: 'rgb(181,178,178)',
              opacity: 0.1
            }
          },
          borderColor: 'rgba(201, 133, 245, 1)',
          backgroundColor: '#fff',
          borderWidth: 2,
          textStyle: {
            color: '#333333',
            fontSize: 12
          },
          formatter: (val) => {
            return `<div> <h5>${val.name} 进-活 留存率</h5> <p>人数：${formatAmount(val.data[2])}</p><p>占比：${this.resultData.targets[val.dataIndex][3].toFixed(2)}%</p></div>`
          },
          rich: {
            a: {
              color: '#495060',
              lineHeight: 20,
              fontSize: 12,
              fontWeight: 600
            },
            'b': {
              color: '#495060',
              lineHeight: 10,
              fontSize: 12
            }
          }
        },
        grid: [
          { left: '7%', top: '7%', height: '6%' },
          { left: '7%', top: '15%', height: '60%' },
          { left: '7%', top: '84%', height: '6%' }
        ],
        xAxis: [
          {
            type: 'category',
            gridIndex: 0,
            data: this.resultData.xaxis,
            splitLine: {
              show: false
            },
            splitArea: {
              show: false
            },
            axisTick: {
              show: false,
              alignWithLabel: false
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#333333'
              }
            },
            axisLabel: {
              show: false
            }
          },
          {
            type: 'category',
            gridIndex: 1,
            data: this.resultData.xaxis,
            splitArea: {
              show: true
            },
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#333333'
              }
            }
          },
          {
            type: 'category',
            gridIndex: 2,
            data: this.resultData.xaxis,
            splitLine: {
              show: false
            },
            splitArea: {
              show: false
            },
            axisTick: {
              show: false,
              alignWithLabel: false
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#333333'
              }
            },
            axisLabel: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            type: 'category',
            gridIndex: 0,
            data: ['2020-10'],
            splitArea: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisLabel: {
              show: false
            },
            axisTick: {
              show: false,
              alignWithLabel: false
            }
          },
          {
            type: 'category',
            gridIndex: 1,
            data: this.resultData.yaxis,
            splitArea: {
              show: true
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#333333'
              }
            },
            axisTick: {
              alignWithLabel: true
            }
          },
          {
            type: 'category',
            gridIndex: 2,
            data: ['2020-10'],
            splitArea: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisLabel: {
              show: false
            },
            axisTick: {
              show: false,
              alignWithLabel: false
            }
          }
        ],
        visualMap: [
          {
            show: false,
            min: 0,
            max: 2000000,
            seriesIndex: 0,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: '8%',
            itemHeight: 330,
            inRange: {
              color: [
                '#E2EDFD'
              ]
            }
          },
          {
            min: 0,
            max: 2000000,
            seriesIndex: 1,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: '2%',
            itemHeight: 330,
            inRange: {
              color: [
                'rgba(253, 255, 213, 1)',
                'rgba(111, 197, 189, 1)',
                'rgba(46, 101, 175, 1)',
                'rgba(19, 24, 95, 1)'
              ]
            }
          },
          {
            show: false,
            min: 0,
            max: 2000000,
            seriesIndex: 2,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: '8%',
            itemHeight: 330,
            inRange: {
              color: [
                '#E2EDFD'
              ]
            }
          }
        ],
        series: [
          {
            name: 'Punch Card',
            type: 'heatmap',
            xAxisIndex: 0,
            yAxisIndex: 0,
            data: this.mockData.map(item => {
              return [item[1], item[0], item[2] || '-']
            }),
            label: {
              show: true,
              formatter: function(val) {
                if (val.data[2] > 500000) {
                  return '{a|' + formatAmount(val.data[2]) + '}'
                } else {
                  return '{b|' + formatAmount(val.data[2]) + '}'
                }
              },
              rich: {
                a: {
                  color: '#fff'
                },
                b: {
                  color: '#333333'
                }
              }
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          },
          {
            name: 'Punch Card',
            type: 'heatmap',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: this.resultData.targets.map(item => {
              return [item[1], item[0], item[2] || '-']
            }),
            label: {
              show: true,
              formatter: function(val) {
                if (val.data[2] > 500000) {
                  return '{a|' + formatAmount(val.data[2]) + '}'
                } else {
                  return '{b|' + formatAmount(val.data[2]) + '}'
                }
              },
              rich: {
                a: {
                  color: '#fff'
                },
                b: {
                  color: '#333333'
                }
              }
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          },
          {
            name: 'Punch Card',
            type: 'heatmap',
            xAxisIndex: 2,
            yAxisIndex: 2,
            data: this.mockData.map(item => {
              return [item[1], item[0], item[2] || '-']
            }),
            label: {
              show: true,
              formatter: function(val) {
                if (val.data[2] > 500000) {
                  return '{a|' + formatAmount(val.data[2]) + '}'
                } else {
                  return '{b|' + formatAmount(val.data[2]) + '}'
                }
              },
              rich: {
                a: {
                  color: '#fff'
                },
                b: {
                  color: '#333333'
                }
              }
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      const dom = document.getElementById('echarts-item-viscosity')
      const charts = echarts.init(dom)
      charts.setOption(option)
    },
    // 下载数据
    downData() {
      const code = this.code
      const { classify, classifyType, source, startDate, endDate, lifeCycleValue } = this.$route.query
      const params = {
        code: code,
        classify: classify,
        classifyType: classifyType,
        startDate: startDate,
        endDate: endDate,
        source: source,
        lifeCycle: lifeCycleValue
      }
      const url = downEchartsData(params)
      const iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      iframe.style.height = 0
      iframe.src = url
      document.body.appendChild(iframe)
      setTimeout(() => {
        iframe.remove()
      }, 5 * 60 * 1000)
    }
  }
}
</script>

<style scoped lang="less">
.detail-header {
  display: flex;
  align-items: center;
  justify-items: center;
  justify-content: space-between;
  height: 60px;

  h5 {
    font-size: 16px;
    font-weight: 600;
    color: #333333;

    &:before {
      display: inline-block;
      width: 3px;
      height: 16px;
      background-color: #930CEA;
      content: '';
      color: #930CEA;
      margin-right: 5px;
      position: relative;
      top: 2px;
    }
  }

  button {
    width: 108px;
    height: 32px;
    background: #930CEA;
    border-radius: 4px;
    outline: none;
    border: none;

    span {
      font-size: 12px;
      font-weight: 600;
      color: #FFFFFF;
    }
  }
}

.filter-box {
  display: flex;
  align-items: center;
  justify-items: center;
  min-width: 1183px;
  height: 58px;
  background: #FFFFFF;
  box-shadow: 0px 1px 0px 0px #E3E4E6;
  padding-left: 15px;

  .filter-item {
    display: flex;
    align-items: center;
    justify-items: center;
    margin-right: 30px;

    span {
      margin-right: 5px;
      font-size: 12px;
      font-weight: 600;
      color: #333333;
    }
  }

  /deep/ .el-input__inner {
    height: 32px;
  }

  /deep/ .el-date-editor .el-range__icon {
    height: 32px;
  }

  /deep/ .el-date-editor .el-range-separator {
    height: 32px;
  }
}

.detail-echarts {
  margin-top: 20px;
}

.echarts-item {
  min-width: 1183px;
  height: 752px;
  background: #FFFFFF;
  border-radius: 4px;
  border: 1px solid #E0E0E0;
  margin-bottom: 15px;
}

.echarts-item-header {
  display: flex;
  justify-items: center;
  align-items: center;
  min-width: 1183px;
  height: 55px;
  background: #FBFBFB;
  box-shadow: 0px -1px 0px 0px #E0E0E0;
  border-radius: 4px 4px 0 0;

  span {
    font-size: 18px;
    font-weight: 600;
    color: #333333;
    line-height: 25px;
    margin-left: 15px;
  }
}

.echarts-item-content {
  display: flex;
  height: 100%;
}

.echarts-item-content-item {
  height: 100%;
}

//.echarts-item-viscosity-left {
//  width: 200px;
//  margin-left: 65px;
//}

//.echarts-item-viscosity-right {
//  width: 78%;
//}
.no-data {
  display: flex;
  height: 100%;
  background-color: #fff;
  line-height: 200px;
  justify-content: center;
}

.no-result {
  height: 100%;
  text-align: center;

  div {
    width: 100%;
    text-align: center;
    line-height: 40px;
    justify-content: center;
  }
}

.echarts-footer {
  width: 100%;
  height: 50px;
}
</style>
