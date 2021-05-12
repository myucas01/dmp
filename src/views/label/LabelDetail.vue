<template>
  <div class="label-detail-warp">
    <div v-show="operateLabel" v-loading="loading">
      <div class="header">
        <h3 v-if="labelInfo && labelInfo.labelName">{{ labelInfo.labelName }}</h3>
        <div class="description">{{ labelInfo.description ? labelInfo.description : '暂无简介' }}</div>
      </div>
      <div id="content" class="content">
        <h5 class="title">标签人数分布</h5>
        <div class="info">
          <h5 v-if="labelInfo && labelInfo.total">{{ labelInfo.total }}人</h5>
        </div>
        <div class="chart-box">
          <div id="chartBox" class="chartBox" />
        </div>
      </div>
    </div>
    <div v-show="!operateLabel" class="no-view">
      <img src="@assets/img/bg_state.png">
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { mapGetters } from 'vuex'
import { getLabelDetail } from '@api/label'

export default {
  name: 'LabelDetail',
  data() {
    return {
      color: ['#866CED', '#FFEA6C', '#74C1F6', '#F4901A', '#5AD8A6', '#FAB8FF', '#FF6491', '#0091FF', '#6DD400', '#FA6400'],
      barOption: {
        grid: {
          left: '3%',
          right: '18%',
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
          },
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          data: [],
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
        series: [
          {
            name: '标签数量',
            type: 'bar',
            barWidth: 20,
            data: [],
            label: {
              show: true,
              color: '#000',
              position: 'right',
              textShadowColor: '#fff',
              textShadowOffsetX: 1,
              textShadowOffsetY: 1,
              formatter: (params) => {
                return `${params.data.total}人 ${params.data.value}%`
              }
            }
          }
        ]
      },
      labelInfo: '',
      loading: true
    }
  },
  computed: {
    ...mapGetters([
      'operateLabel'
    ])
  },
  watch: {
    operateLabel() {
      if (this.operateLabel) {
        this.getLabelDetail(this.operateLabel)
      }
    }
  },
  mounted() {
    this.$store.commit('label/SET_LABEL', 'U002001001001')
  },
  methods: {
    // 绘制 图表 柱状图
    drawChartBar() {
      const dom = document.getElementById('chartBox')
      const charts = echarts.init(dom)
      const yData = []
      const seriesData = []
      if (this.labelInfo) {
        for (let i = 0; i < this.labelInfo.nodes.length; i++) {
          const yItem = this.labelInfo.nodes[i]
          yData.push(yItem.labelName)
          seriesData.push({
            value: Number(yItem.percentage.replace(/\%/g, '')),
            total: yItem.total,
            itemStyle: {
              color: this.color[i]
            }
          })
        }
        this.barOption.yAxis['data'] = yData
        this.barOption.series[0]['data'] = seriesData
      }

      // charts.setOption({ ...this.barOption, color: this.color })
      charts.setOption({ ...this.barOption })
    },
    // 获取标签详情
    async getLabelDetail(operateLabel) {
      this.loading = true
      const result = await getLabelDetail(operateLabel)
      if (result.code === 200) {
        this.labelInfo = result.data
        this.$nextTick(function() {
          this.drawChartBar()
        })
      }
      this.loading = false
    }
  }
}
</script>

<style scoped lang="less">
  .label-detail-warp {
    display: flex;
    flex-direction: column;

    .header {
      height: 110px;
      background-color: #fff;
      box-shadow: 0px 1px 0px 0px #E3E4E6;
      border-left: 5px solid #5AD8A6;
      padding-right: 20px;
      padding-bottom: 10px;

      h3 {
        font-size: 20px;
        font-weight: 600;
        color: #333333;
        margin-left: 18px;
        padding-top: 10px;
      }

      .description {
        height: 50px;
        overflow-y: auto;
        background: #F8F6F6;
        font-size: 10px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.85);
        margin-left: 18px;
        padding: 5px;
      }
    }

    .content {
      margin-top: 20px;
      background-color: #fff;

      .title {
        font-size: 14px;
        font-weight: 600;
        color: #333333;
        margin-left: 18px;
        padding-top: 18px;
      }

      .info {
        display: flex;
        line-height: 30px;
        padding-left: 20px;

        h5 {
          font-size: 14px;
          font-weight: 600;
          color: #333333;
        }

        .icon-round {
          display: inline-block;
          width: 6px;
          height: 6px;
          background: #F7B500;
          border-radius: 6px;
        }

        span {
          font-size: 11px;
          font-weight: 400;
          color: #9B9B9B;
          margin-left: 30px;
        }
      }
      .chart-box{
        height: calc(100vh - 236px);
        overflow-y: auto;
        .chartBox {
          width: 100%;
          height: 600px;
        }
      }
    }
    .no-view{
      display: flex;
      text-align: center;
      align-items: center;
      justify-content: center;
      margin-top: 30px;
    }
  }
</style>
