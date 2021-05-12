<template>
  <div class="label-warp">
    <div class="label-nums">
      <div class="label-nums-header">
        <h5><i class="icon-line" />标签数量</h5>
        <span>最新计算时间 2020-10-12 11:29:28</span>
      </div>
      <div class="label-nums-content">
        <div id="content-left" class="content-left" />
        <div id="content-right" class="content-right" />
      </div>
    </div>
    <div class="label-history">
      <div class="label-history-header">
        <h5><i class="icon-line" />标签历史数量概括</h5>
      </div>
      <div id="history-content" class="label-history-content" />
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { getLabelNums, getLabelHistoryNums } from '@api/label'

export default {
  name: 'Index',
  data() {
    return {
      color: ['#866CED', '#FFEA6C', '#74C1F6', '#F4901A', '#5AD8A6', '#FAB8FF', '#FF6491', '#0091FF', '#6DD400', '#FA6400'],
      barItemOption: {
        type: 'bar',
        stack: '总量',
        label: {
          show: true,
          color: '#000',
          position: 'insideLeft',
          textShadowColor: '#fff',
          textShadowOffsetX: 1,
          textShadowOffsetY: 1
        }
      },
      pieOption: {
        // tooltip: {
        //   trigger: 'item',
        //   formatter: '{a} <br/>{b}: {c} ({d}%)'
        // },
        title: {
          text: '80%',
          left: 'center',
          top: '40%',
          textStyle: {
            color: 'rgba(255, 100, 145, 1)',
            fontSize: 22,
            align: 'center'
          }
        },
        grid: {
          left: '30%'
        },
        graphic: {
          type: 'text',
          left: 'center',
          top: '53%',
          style: {
            text: '总标签数量（个）',
            textAlign: 'center',
            fill: 'rgba(73, 80, 96, 1)',
            fontSize: 12,
            fontWeight: 400
          }
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['40%', '60%'],
            minAngle: 40,
            avoidLabelOverlap: true,
            label: {
              show: true,
              lineHeight: 40,
              color: '#495060',
              fontSize: 12,
              position: 'outer',
              alignTo: 'edge',
              margin: 10,
              formatter: (params) => {
                return `{a|${params.name}标签组}\n{b|${params.data.progress}}`
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
            labelLine: {
              show: true,
              length: 30,
              length2: 10
            },
            data: []
          }
        ]
      },
      barOption: {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          grid: {
            left: '30%'
          },
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderColor: 'blue',
          borderWidth: 1,
          padding: 0,
          textStyle: {
            color: '#000'
          },
          formatter: (param) => {
            let text = ''
            let total = 0
            let marks = ''
            for (const item of param) {
              total += item.value
              marks += `<div style="padding: 2px;font-weight: 400;color: #333;font-size: 12px;">${item.marker}${item.seriesName}  <span style="margin-left: 10px;">${item.value}个</span></div>`
            }
            text += `<div style="border-bottom: 1px solid rgba(147, 12, 234, 1); line-height: 30px; font-size: 12px;color: #333;font-weight: 600; text-align: center; padding: 0 5px;">${param[0].name} (总标签数量${total}个)</div>`

            text += marks
            return text
          }
        },
        legend: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          axisLine: {
            show: false,
            lineStyle: {
              color: '#B8B8B8'
            }
          },
          axisTick: {
            show: false,
            lineStyle: {
              color: '#B8B8B8'
            }
          },
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          }
        },
        yAxis: {
          type: 'category',
          data: ['人', '场', '时', '活动'],
          axisLine: {
            show: false
          },
          axisTick: {
            show: false,
            lineStyle: {
              color: '#B8B8B8'
            }
          }
        },
        series: []
      },
      historyOption: {
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderColor: 'blue',
          borderWidth: 1,
          padding: 0,
          textStyle: {
            color: '#000'
          },
          formatter: (param) => {
            let text = ''
            let total = 0
            let marks = ''
            for (const item of param) {
              total += item.value
              marks += `<div style="padding: 2px;font-weight: 400;color: #333;font-size: 12px;">${item.marker}${item.seriesName}  <span style="margin-left: 10px;">${item.value}个</span></div>`
            }
            text += `<div style="border-bottom: 1px solid rgba(147, 12, 234, 1); line-height: 30px; font-size: 12px;color: #333;font-weight: 600; text-align: center; padding: 0 5px;">${param[0].name} (总标签数量${total}个)</div>`

            text += marks
            return text
          }
        },
        legend: {
          data: [],
          bottom: 0
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '8%',
          containLabel: true
        },
        xAxis: [],
        yAxis: [
          {
            type: 'value',
            show: true,
            axisLine: {
              show: false
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed',
                color: '#00000026'
              }
            }
          }
        ],
        series: []
      },
      rawDataLabelNums: '', // 原始数据 标签数量
      rawDataHistoryLabelNums: '' // 原始数据 历史标签数量
    }
  },
  mounted() {
    this.getBasicData()
  },
  methods: {
    // 获取标签信息数据
    async getBasicData() {
      const labelNumResult = await getLabelNums()
      const labelHistoryNumResult = await getLabelHistoryNums()
      if (labelNumResult.code === 200) {
        this.rawDataLabelNums = labelNumResult.data // 原始数据 标签数量
      }
      if (labelHistoryNumResult.code === 200) {
        this.rawDataHistoryLabelNums = labelHistoryNumResult.data
      }
      this.handleData()
    },
    // 处理数据
    handleData() {
      const pieData = []
      const barData = []
      const yData = []
      const barMap = new Map()
      // 饼图数据/柱方图数据 梳理
      for (const item of this.rawDataLabelNums.nodes) {
        pieData.push({
          value: item.total,
          name: item.labelName,
          progress: `${item.total}个，${item.percentage} `
        })
        yData.push(item.labelName)
        for (const childItem of item.series) {
          if (barMap.has(childItem.type)) {
            barMap.set(childItem.type, [...barMap.get(childItem.type), {
              value: childItem.count,
              label: {
                formatter: function(params) {
                  if (params.value > 0) {
                    return params.value
                  } else {
                    return ' '
                  }
                }
              }
            }])
          } else {
            barMap.set(childItem.type, [
              {
                value: childItem.count,
                label: {
                  formatter: function(params) {
                    if (params.value > 0) {
                      return params.value
                    } else {
                      return ' '
                    }
                  }
                }
              }])
          }
        }
      }
      for (const [key, value] of barMap.entries()) {
        const barItem = { name: key, data: value, ...this.barItemOption }
        barData.push(barItem)
      }
      this.pieOption.title.text = this.rawDataLabelNums.total
      this.pieOption.series[0]['data'] = pieData
      this.barOption = {
        ...this.barOption,
        series: barData,
        legend: {
          left: '10%',
          data: this.rawDataLabelNums.series
        },
        yAxis: {
          type: 'category',
          data: yData,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false,
            lineStyle: {
              color: '#B8B8B8'
            }
          }
        }
      }
      this.drawChartPie()
      this.drawChartBar()
      // 历史 叠层柱方图
      const historyMap = new Map()
      const xData = []
      const historySeries = []
      const legendData = []
      for (const item of this.rawDataHistoryLabelNums) {
        for (const childItem of item.nodes) {
          if (historyMap.has(childItem.labelName)) {
            historyMap.set(childItem.labelName, [...historyMap.get(childItem.labelName), childItem.total])
          } else {
            historyMap.set(childItem.labelName, [childItem.total])
          }
        }
        xData.push(item.endTime)
      }
      for (const [key, value] of historyMap.entries()) {
        const items = {
          name: key,
          type: 'bar',
          stack: '总量',
          barWidth: 60,
          barMinHeight: 10, // 最小柱高
          data: value
        }
        historySeries.push(items)
        legendData.push(key)
      }
      this.historyOption = {
        ...this.historyOption,
        legend: {
          data: legendData,
          bottom: 0
        },
        xAxis: [
          {
            type: 'category',
            data: xData,
            axisLine: {
              show: false
            }
          }
        ],
        series: historySeries
      }
      this.drawChartHistory()
    },
    // 绘制 图表 饼图
    drawChartPie() {
      const dom = document.getElementById('content-left')
      const charts = echarts.init(dom)
      charts.setOption({ ...this.pieOption, color: this.color })
    },
    // 绘制 图表 柱状图
    drawChartBar() {
      const dom = document.getElementById('content-right')
      const charts = echarts.init(dom)
      charts.setOption({ ...this.barOption, color: this.color })
    },
    // 绘制 图表 标签历史数量概括
    drawChartHistory() {
      const dom = document.getElementById('history-content')
      const charts = echarts.init(dom)
      charts.setOption({ ...this.historyOption, color: this.color })
    }
  }
}
</script>

<style scoped lang="less">
  .icon-line {
    display: inline-block;
    width: 3px;
    height: 16px;
    background: #930CEA;
    position: relative;
  }

  .label-warp {
    width: 100%;
    height: 100%;
    background-color: #F5F5F5;
  }

  .label-nums {
    height: 360px;
    background-color: #fff;

    &-header {
      display: flex;
      height: 20px;
      line-height: 20px;
      padding-left: 15px;
      padding-top: 20px;

      h5 {
        font-size: 16px;
        font-weight: 600;
        color: #333;
      }

      .icon-line {
        top: 3px;
        margin-right: 5px;
      }

      span {
        font-size: 12px;
        font-weight: 400;
        color: #9B9B9B;
        margin-left: 30px;
        position: relative;
        text-indent: 5px;

        &:before {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 6px;
          background: #F7B500;
          content: '';
          position: absolute;
          top: 6px;
          left: -6px;
        }
      }
    }

    &-content {
      height: 300px;
      margin-top: 20px;
      display: flex;

      .content-left {
        height: 300px;
        width: 40%;
        margin-left: 3%;
      }

      .content-right {
        height: 300px;
        width: 40%;
      }
    }
  }

  .label-history {
    height: 400px;
    background: #FFFFFF;
    box-shadow: 0px 1px 0px 0px #E3E4E6;
    margin-top: 10px;

    &-header {
      display: flex;
      height: 20px;
      line-height: 20px;
      padding-left: 15px;
      padding-top: 20px;

      h5 {
        font-size: 16px;
        font-weight: 600;
        color: #333;
      }

      .icon-line {
        top: 3px;
        margin-right: 5px;
      }

      span {
        font-size: 12px;
        font-weight: 400;
        color: #9B9B9B;
        margin-left: 30px;
        position: relative;
        text-indent: 5px;

        &:before {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 6px;
          background: #F7B500;
          content: '';
          position: absolute;
          top: 6px;
          left: -6px;
        }
      }
    }

    &-content {
      width: 100%;
      height: 330px;
    }
  }
</style>
