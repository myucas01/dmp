<template>
  <div>
    <div class="topTitle">
      <div class="left">
        <em />
        <span>泛会员进活粘值</span>
      </div>
      <div class="right">
        <el-button type="primary" size="small" @click="download('')">下载统计结果</el-button>
      </div>
    </div>
    <div class="fromBox">
      <div class="top">
        <div class="top-left">
          <span class="lableName">分类方式：</span>
          <!-- <el-radio
            v-for="(list, index) in radioList"
            :key="index"
            v-model="radio"
            :label="list.typeCode"
            size="mini"
            @change="radioChange"
            >{{ list.typeName }}</el-radio
          > -->
          <el-select v-model="radio" placeholder="请选择" size="small" @change="radioChange" clearable >
              <el-option
                v-for="item in radioList"
                :key="item.typeCode"
                :label="item.typeName"
                :value="item.typeCode"
              >
              </el-option>
            </el-select>
          <div style="margin-top: 20px">
            <span class="lableName">细分客群：</span>
            <el-select v-model="groupsValue" placeholder="请选择" size="small" @change="change" clearable > 
              <el-option
                v-for="item in groups"
                :key="item.typeCode"
                :label="item.typeName"
                :value="item.typeCode"
              />
            </el-select>
            <span class="lableName">选择来源：</span>
            <el-select v-model="fromValue" placeholder="请选择" size="small" @change="change" clearable >
              <el-option
                v-for="item in sourceList"
                :key="item.typeCode"
                :label="item.typeName"
                :value="item.typeCode"
              />
            </el-select>
            <span class="lableName">交叉筛选：</span>
            <el-select
              v-model="repurchase"
              placeholder="请选择"
              size="small"
              :disabled="radio == 'repurchase'"
              @change="change"
              clearable 
            >
              <el-option
                v-for="item in fifterSelectOption"
                :key="item.typeCode"
                :label="item.typeName"
                :value="item.typeCode"
              />
            </el-select>
          </div>
        </div>
        <div class="top-right">
          <i class="el-icon-date" />
          <span>{{ startDate }}至{{ endDate }}</span>
        </div>
      </div>
      <div class="bottom">
        <div class="item">
          <div class="left">
            <h3>全量客户：进</h3>
            <a @click="redirect('transform_info')">会员转化趋势</a>
          </div>
          <div class="right">
            <h1>
              {{ allCustomer.value | currency({ fractionCount: '', symbolSpacing: false })
              }}<span>人</span>
            </h1>
          </div>
        </div>
        <div class="item right">
          <div class="left">
            <h3>到店全体：活</h3>
            <a @click="redirect('retention')">会员留存率</a>
          </div>
          <div class="right">
            <h1>
              {{ toShop.value | currency({ fractionCount: '', symbolSpacing: false })
              }}<span>人</span>
            </h1>
          </div>
        </div>
      </div>
    </div>
    <div class="chartBox">
      <div class="title">
        <div class="title-left">
          <h5>人数趋势：活</h5>
          <el-tooltip class="item" effect="light" placement="right">
            <div slot="content" style="width: 200px">
              {{ populationInfo.tips }}
            </div>
            <i class="el-icon-question" />
          </el-tooltip>
        </div>
        <div class="title-right">
          <span
            class="icon"
            @click="download('poplution')"
          ><svg-icon
            icon-class="download"
          /></span>
        </div>
      </div>
      <div id="chart-people" class="chart" style="height: 400px" />
    </div>
    <!-- <div class="chartBox">
      <div class="title">
        <div class="title-left">
          <h5>生命周期：活</h5>
          <el-tooltip class="item" effect="light" placement="right">
            <div slot="content" style="width: 200px">{{ lifecycleInfo.tips }}</div>
            <i class="el-icon-question" />
          </el-tooltip>
          <span class="lableName">选择生命周期：</span>
          <el-select
            v-model="lifeCycleValue"
            placeholder="请选择"
            size="small"
            @change="lifeCycleChange"
          >
            <el-option
              v-for="item in lifeCycleList"
              :key="item.typeCode"
              :label="item.typeName"
              :value="item.typeCode"
            />
          </el-select>
        </div>
        <div class="title-right">
          <span
            class="icon"
            @click="download('life_cycle')"
          ><svg-icon
            icon-class="download"
          /></span>
        </div>
      </div>
      <div id="chart-cycle" class="chart" />
    </div> -->
    <div class="fillLineBox">
      <div class="item left">
        <div class="item-title">
          <div class="title-left">
            <h3>到店频次分布：粘</h3>
            <el-tooltip class="item" effect="light" placement="right">
              <div slot="content" style="width: 200px">{{ frequencyInfo.tips }}</div>
              <i class="el-icon-question" />
            </el-tooltip>
          </div>
          <div class="title-right">
            <a @click="redirect('frequency_analysis')">粘分析</a>
            <svg-icon icon-class="download" @click="download('frequency')" />
          </div>
        </div>
        <div class="num">
          <span>{{ frequencyAverage }}</span>笔
        </div>
        <div id="chart-arrival" class="chart" />
      </div>
      <div class="item">
        <div class="item-title">
          <div class="title-left">
            <h3>ARPU：值</h3>
            <el-tooltip class="item" effect="light" placement="right">
              <div slot="content" style="width: 200px">{{ arpuInfo.tips }}</div>
              <i class="el-icon-question" />
            </el-tooltip>
          </div>
          <div class="title-right">
            <a @click="redirect('arpu_analysis')">值分析</a>
            <svg-icon icon-class="download" @click="download('arpu')" />
          </div>
        </div>
        <div class="num">
          <span>{{ arpuAverage }}</span>元
        </div>
        <div id="chart-arpu" class="chart" />
      </div>
    </div>
    <div class="chartBox">
      <div class="title">
        <div class="title-left">
          <h5>日商走势</h5>
          <el-tooltip class="item" effect="light" placement="right">
            <div slot="content" style="width: 200px">{{ trendInfo.tips }}</div>
            <i class="el-icon-question" />
          </el-tooltip>
        </div>
        <div class="title-right">
          <!-- <a>客群运营分析</a> -->
          <div class="dateBox">
            <i class="el-icon-date" />
            <span class="date">{{ trendStartDate }}至{{ trendEndDate }}</span>
          </div>
          <span class="icon" @click="download('trend')"><svg-icon icon-class="download" /></span>
        </div>
      </div>
      <div id="chart-trend" class="chart" />
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import {
  filterInfo,
  alltotal,
  population,
  lifecycle,
  OtherGraph,
  downEchartsData
} from '@/api/operate'
export default {
  data() {
    return {
      radio: '',
      radioList: [],
      groups: [],
      sourceList: [],
      groupsValue: '',
      value: '',
      options: [],
      fromValue: '',
      startDate: '',
      endDate: '',
      totalEndDate:'',
      allCustomer: {
        value: 0
      },
      toShop: {
        value: 0
      },
      lifeCycleList: [],
      lifeCycleValue: '',
      xdata: [],
      populationInfo: '',
      lifecycleInfo: '',
      frequencyInfo: '',
      frequencyAverage: '',
      arpuInfo: '',
      arpuAverage: '',
      trendInfo: '',
      trendStartDate: '',
      trendEndDate: '',
      lineOptions: {
        title: {
          show: false,
          text: ''
        },
        tooltip: {
          trigger: 'axis',
          padding: 10,
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        toolbox: {
          show: false,
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          top: 40,
          left: '3%',
          right: '60',
          bottom: '30',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLabel: {
              color: '#999999',
              fontSize: 20
            },
            data: ''
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '人数',
            align: 'center',
            nameTextStyle: {
              color: '#999999'
            },
            axisLine: {
              show: false
            },
            splitLine: {
              lineStyle: {
                type: 'dashed'
              }
            },
            axisTick: {
              show: false
            },
            minorSplitLine: {
              show: false
            },
            axisLabel: {
              color: '#999999'
            }
          }
        ],
        series: []
      },
      color: ['#669AFA', '#60D5A6', '#FF9D4D', '#866CED', '#F6BD16', '#6DC8EC'],
      charts1: '',
      charts2: '',
      charts3: '',
      charts4: '',
      charts5: '',
      lineOptions1: '',
      lineOptions2: '',
      lineOptions3: '',
      lineOptions4: '',
      lineOptions5: '',
      fifterSelectOption: [],
      repurchase: ''
    }
  },
  mounted() {
    this.getFilter()
  },
  methods: {
    radioChange(val) {
      console.log(val)
      const list = this.radioList.filter((item) => {
        return item.typeCode === val
      })
      console.log(list)
      this.groups = list[0].childList
      this.groupsValue = this.groups[0].typeCode
      if (val === 'repurchase') {
        this.repurchase = ''
      }
      this.change()
    },
    change() {
      const dom1 = document.getElementById('chart-people')
      if (dom1) {
        dom1.innerHTML = ''
        dom1.removeAttribute('_echarts_instance_')
      }
      const dom2 = document.getElementById('chart-cycle')
      if (dom2) {
        dom2.innerHTML = ''
        dom2.removeAttribute('_echarts_instance_')
      }
      const dom3 = document.getElementById('chart-arrival')
      if (dom3) {
        dom3.innerHTML = ''
        dom3.removeAttribute('_echarts_instance_')
      }
      const dom4 = document.getElementById('chart-arpu')
      if (dom4) {
        dom4.innerHTML = ''
        dom4.removeAttribute('_echarts_instance_')
      }
      const dom5 = document.getElementById('chart-trend')
      if (dom5) {
        dom5.innerHTML = ''
        dom5.removeAttribute('_echarts_instance_')
      }
      this.getTotal()
      this.getPopulation()
    },
    async getFilter() {
      const result = await filterInfo({})
      if (result.code === 200) {
        this.radioList = result.data.classifyList
        let list = result.data.classifyList.filter((item)=>item.typeCode=='repurchase')
        console.log(list)
        this.fifterSelectOption = list[0].childList.slice(
          1,
         list[0].childList.length
        ),
        this.totalEndDate = result.data.endDate
        this.radio = this.radioList[0].typeCode
        this.groups = this.radioList[0].childList
        this.groupsValue = this.groups[0].typeCode
        this.sourceList = result.data.sourceList
        this.fromValue = this.sourceList[0].typeCode
        this.lifeCycleList = result.data.lifeCycleList
        this.lifeCycleValue = this.lifeCycleList[0].typeCode
        // console.log(this.list)
        this.getTotal()
        this.getPopulation()
      }
    },
    async getTotal() {
      const result = await alltotal({
        classify: this.radio,
        classifyType: this.groupsValue,
        repurchase: this.repurchase,
        source: this.fromValue,
        endtime: this.totalEndDate
      })
      if (result.code === 200) {
        this.allCustomer = result.data.allCustomer
          ? result.data.allCustomer
          : {
            value: 0
          }
        this.toShop = result.data.toShop
          ? result.data.toShop
          : {
            value: 0
          }
        // console.log(this.list)
      }
    },
    async getPopulation() {
      const result = await population({
        classify: this.radio,
        classifyType: this.groupsValue,
        repurchase: this.repurchase,
        source: this.fromValue
      })
      if (result.code === 200) {
        this.populationInfo = result.data
        this.xdata = result.data.dateList
        this.startDate = result.data.dateList[0]
        this.endDate = result.data.dateList[result.data.dateList.length - 1]
        console.log(this.startDate)
        console.log(this.endDate)
        const series = result.data.targetList
        for (const i in series) {
          series[i].data = series[i].values
          series[i].type = 'line'
          series[i].stack = '总量'
          series[i].smooth = true
          series[i].itemStyle = {
            color: this.color[i],
            opacity: 1
          }
        }
        this.lineOptions1 = {
          ...this.lineOptions,
          legend: {
            bottom: 5,
            selected: {
              // 选中'系列1'
              '集享+尊享会员': false
            }
          },
          grid: {
            top: 40,
            left: '3%',
            right: '80',
            bottom: '80',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            name: '月',
            boundaryGap: false,
            axisTick: {
              show: false
            },
            axisLabel: {
              color: '#999999',
              fontSize: 12,
              margin: 20
            },
            axisLine: {
              lineStyle: {
                color: '#8493AB',
                width: 2
              }
            },
            data: this.xdata
          },
          dataZoom: [
            {
              type: 'slider',
              show: true,
              bottom: 40,
              backgroundColor: '#ffffff',
              startValue: this.startDate,
              endValue: this.endDate,
              dataBackground: {
                lineStyle: {
                  opacity: 0
                },
                areaStyle: {
                  color: '#8493AB'
                }
              },
              selectedDataBackground: {
                areaStyle: {
                  color: '#8493AB'
                }
              },
              fillerColor: '#930CEA50',
              handleStyle: {
                color: '#ffffff',
                borderColor: '#930CEA'
              },
              minValueSpan: 1
              // handleIcon:'image://@assets/img/log.png',
            } // handleIcon:'image://data:image/png;base64,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'},
          ],
          tooltip: {
            trigger: 'axis',
            borderColor: '#930CEA',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderWidth: 1,
            textStyle: {
              color: '#000'
            },
            axisPointer: {
              shadowStyle: {
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                shadowBlur: 10
              }
            }
          },
          series: series
        }
        this.charts1 = echarts.init(document.getElementById('chart-people')) // 人数趋势：活
        this.charts1.setOption(this.lineOptions1)
        this.charts1.on('datazoom', (params) => {
          // 获得图表数据数组下标
          var startValue = this.charts1.getModel().option.dataZoom[0].startValue
          var endValue = this.charts1.getModel().option.dataZoom[0].endValue
          const values3 = this.frequencyInfo.targetList[0].values
          const values4 = this.arpuInfo.targetList[0].values
          this.frequencyAverage = this.average(values3.slice(startValue, endValue + 1))
          this.arpuAverage = this.average(values4.slice(startValue, endValue + 1))
          this.startDate = this.xdata[startValue]
          this.endDate = this.xdata[endValue]
          console.log(this.startDate)
          console.log(this.endDate)
          this.trendStartDate = this.trendInfo.dateList[startValue]
          this.trendEndDate = this.trendInfo.dateList[endValue + 3]
          // this.lineOptions2.dataZoom[0].startValue = startValue
          // this.lineOptions2.dataZoom[0].endValue = endValue
          // this.charts2.setOption(this.lineOptions2)
          this.lineOptions3.dataZoom[0].startValue = startValue
          this.lineOptions3.dataZoom[0].endValue = endValue
          this.charts3.setOption(this.lineOptions3)
          this.lineOptions4.dataZoom[0].startValue = startValue
          this.lineOptions4.dataZoom[0].endValue = endValue
          this.charts4.setOption(this.lineOptions4)
          this.lineOptions5.dataZoom[0].startValue = startValue
          this.lineOptions5.dataZoom[0].endValue = endValue + 3
          this.charts5.setOption(this.lineOptions5)
        })
        // this.getLifecycle()
        this.getOtherGraph()
      }
    },
    // 平均值
    average(arr) {
      console.log(arr)
      let sum = 0
      for (var i = 0, j = arr.length; i < j; i++) {
        sum += Number(arr[i])
      }
      console.log(sum)
      console.log((sum / arr.length).toFixed(2))
      return (sum / arr.length).toFixed(2)
    },
    async getLifecycle() {
      const result = await lifecycle({
        classify: this.radio,
        classifyType: this.groupsValue,
        source: this.fromValue,
        repurchase: this.repurchase,
        lifeCycle: this.lifeCycleValue
      })
      if (result.code === 200) {
        this.lifecycleInfo = result.data
        const series = result.data.targetList
        for (const i in series) {
          series[i].data = series[i].values
          series[i].type = 'line'
          series[i].stack = '总量'
          series[i].smooth = true
          series[i].itemStyle = {
            color: this.color[i],
            opacity: 1
          }
        }
        this.lineOptions2 = {
          ...this.lineOptions,
          legend: {
            bottom: 5
          },
          grid: {
            top: 40,
            left: '3%',
            right: '80',
            bottom: '30',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            name: '月',
            boundaryGap: false,
            axisTick: {
              show: false
            },
            axisLabel: {
              color: '#999999',
              fontSize: 12,
              margin: 20
            },
            axisLine: {
              lineStyle: {
                color: '#8493AB',
                width: 2
              }
            },
            data: this.xdata
          },
          dataZoom: [
            {
              type: 'slider',
              show: false,
              startValue: this.startDate,
              endValue: this.endDate,
              zoomOnMouseWheel: false
            }
          ],
          tooltip: {
            trigger: 'axis',
            borderColor: '#930CEA',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderWidth: 1,
            textStyle: {
              color: '#000'
            },
            axisPointer: {
              shadowStyle: {
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                shadowBlur: 10
              }
            }
          },
          series: series
        }
        this.charts2 = echarts.init(document.getElementById('chart-cycle')) // 生命周期：活
        this.charts2.setOption(this.lineOptions2)
      }
    },
    async getOtherGraph() {
      const result = await OtherGraph({
        classify: this.radio,
        classifyType: this.groupsValue,
        source: this.fromValue,
        lifeCycle: this.lifeCycleValue,
        repurchase: this.repurchase
      })
      if (result.code === 200) {
        this.frequencyInfo = result.data.frequencyVo
        this.arpuInfo = result.data.arpuVo
        this.trendInfo = result.data.trendVo
        this.trendStartDate = this.trendInfo.dateList[0]
        this.trendEndDate = this.trendInfo.dateList[this.trendInfo.dateList.length - 1]
        const values3 = this.frequencyInfo.targetList[0].values
        const values4 = this.arpuInfo.targetList[0].values
        this.frequencyAverage = this.average(values3.slice(0, values3.length))
        this.arpuAverage = this.average(values4.slice(0, values4.length))
        const series3 = result.data.frequencyVo.targetList
        const series4 = result.data.arpuVo.targetList
        const series5 = result.data.trendVo.targetList
        console.log(this.trendStartDate)
        console.log(this.trendEndDate)
        for (const i in series3) {
          series3[i].data = series3[i].values
          series3[i].type = 'line'
          series3[i].stack = '总量'
          series3[i].smooth = true
          series3[i].itemStyle = {
            color: '#866CED',
            opacity: 1
          }
          ;(series3[i].lineStyle = {
            color: '#866CED'
            // eslint-disable-next-line no-sequences
          }),
          (series3[i].areaStyle = {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#866CED'
              },
              {
                offset: 1,
                color: '#ffe'
              }
            ])
          })
        }
        for (const i in series4) {
          series4[i].data = series4[i].values
          series4[i].type = 'line'
          series4[i].stack = '总量'
          series4[i].smooth = true
          series4[i].itemStyle = {
            color: '#866CED',
            opacity: 1
          }
          ;(series4[i].lineStyle = {
            color: '#866CED'
            // eslint-disable-next-line no-sequences
          }),
          (series4[i].areaStyle = {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#866CED'
              },
              {
                offset: 1,
                color: '#ffe'
              }
            ])
          })
        }
        for (const i in series5) {
          series5[i].data = series5[i].values
          series5[i].type = 'line'
          series5[i].stack = '总量'
          series5[i].smooth = true
          series5[i].itemStyle = {
            color: this.color[i],
            opacity: 1
          }
          if (i === 1) {
            series5[i].lineStyle = {
              type: 'dashed'
            }
          }
        }
        this.lineOptions3 = {
          ...this.lineOptions,
          xAxis: {
            type: 'category',
            name: '月',
            boundaryGap: false,
            axisTick: {
              show: false
            },
            axisLabel: {
              color: '#999999',
              fontSize: 12,
              margin: 20
            },
            axisLine: {
              lineStyle: {
                color: '#8493AB',
                width: 2
              }
            },
            data: this.xdata
          },
          yAxis: [
            {
              type: 'value',
              name: '笔',
              align: 'center',
              nameTextStyle: {
                color: '#999999'
              },
              axisLine: {
                show: false
              },
              splitLine: {
                lineStyle: {
                  type: 'dashed'
                }
              },
              axisTick: {
                show: false
              },
              minorSplitLine: {
                show: false
              },
              axisLabel: {
                color: '#999999'
              }
            }
          ],
          dataZoom: [
            {
              type: 'slider',
              show: false,
              startValue: this.startDate,
              endValue: this.endDate,
              zoomOnMouseWheel: false
            }
          ],
          tooltip: {
            trigger: 'axis',
            borderColor: '#930CEA',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderWidth: 1,
            textStyle: {
              color: '#000'
            },
            axisPointer: {
              shadowStyle: {
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                shadowBlur: 10
              }
            }
          },
          series: series3
        }
        this.lineOptions4 = {
          ...this.lineOptions,
          xAxis: {
            type: 'category',
            name: '月',
            boundaryGap: false,
            axisTick: {
              show: false
            },
            axisLabel: {
              color: '#999999',
              fontSize: 12,
              margin: 20
            },
            axisLine: {
              lineStyle: {
                color: '#8493AB',
                width: 2
              }
            },
            data: this.xdata
          },
          yAxis: [
            {
              type: 'value',
              name: '元',
              align: 'center',
              nameTextStyle: {
                color: '#999999'
              },
              axisLine: {
                show: false
              },
              splitLine: {
                lineStyle: {
                  type: 'dashed'
                }
              },
              axisTick: {
                show: false
              },
              minorSplitLine: {
                show: false
              },
              axisLabel: {
                color: '#999999'
              }
            }
          ],
          dataZoom: [
            {
              type: 'slider',
              show: false,
              startValue: this.startDate,
              endValue: this.endDate,
              zoomOnMouseWheel: false
            }
          ],
          tooltip: {
            trigger: 'axis',
            borderColor: '#930CEA',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderWidth: 1,
            textStyle: {
              color: '#000'
            },
            axisPointer: {
              shadowStyle: {
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                shadowBlur: 10
              }
            }
          },
          series: series4
        }
        this.lineOptions5 = {
          ...this.lineOptions,
          xAxis: {
            type: 'category',
            name: '月',
            boundaryGap: false,
            axisTick: {
              show: false
            },
            axisLabel: {
              color: '#999999',
              fontSize: 12,
              margin: 20
            },
            axisLine: {
              lineStyle: {
                color: '#8493AB',
                width: 2
              }
            },
            data: this.trendInfo.dateList
          },
          yAxis: [
            {
              type: 'value',
              name: '金额',
              align: 'center',
              nameTextStyle: {
                color: '#999999'
              },
              axisLine: {
                show: false
              },
              splitLine: {
                lineStyle: {
                  type: 'dashed'
                }
              },
              axisTick: {
                show: false
              },
              minorSplitLine: {
                show: false
              },
              axisLabel: {
                color: '#999999'
              }
            }
          ],
          dataZoom: [
            {
              type: 'slider',
              show: false,
              startValue: this.trendStartDate,
              endValue: this.trendEndDate,
              zoomOnMouseWheel: false
            }
          ],
          legend: {
            bottom: 5
          },
          tooltip: {
            trigger: 'axis',
            borderColor: '#930CEA',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderWidth: 1,
            textStyle: {
              color: '#000'
            },
            axisPointer: {
              shadowStyle: {
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                shadowBlur: 10
              }
            }
          },
          series: series5
        }
        this.charts3 = echarts.init(document.getElementById('chart-arrival')) // 到店频次分布：粘
        this.charts4 = echarts.init(document.getElementById('chart-arpu')) // ARPU：值
        this.charts5 = echarts.init(document.getElementById('chart-trend')) // 日商走势
        this.charts3.setOption(this.lineOptions3)
        this.charts4.setOption(this.lineOptions4)
        this.charts5.setOption(this.lineOptions5)
      }
    },
    lifeCycleChange() {
      const dom2 = document.getElementById('chart-cycle')
      if (dom2) {
        dom2.innerHTML = ''
        dom2.removeAttribute('_echarts_instance_')
      }
      const dom3 = document.getElementById('chart-arrival')
      if (dom3) {
        dom3.innerHTML = ''
        dom3.removeAttribute('_echarts_instance_')
      }
      const dom4 = document.getElementById('chart-arpu')
      if (dom4) {
        dom4.innerHTML = ''
        dom4.removeAttribute('_echarts_instance_')
      }
      const dom5 = document.getElementById('chart-trend')
      if (dom5) {
        dom5.innerHTML = ''
        dom5.removeAttribute('_echarts_instance_')
      }
      // this.getLifecycle()
      this.getOtherGraph()
    },
    async download(type) {
      console.log(type)
      const url = downEchartsData({
        classify: this.radio,
        classifyType: this.groupsValue,
        repurchase: this.repurchase,
        source: this.fromValue,
        lifeCycle: this.lifeCycleValue,
        code: type,
        startDate: this.startDate,
        endDate: this.endDate
      })
      const iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      iframe.style.height = 0
      iframe.src = url
      document.body.appendChild(iframe)
    },
    redirect(type) {
      this.$router.push({
        path: `/operate/detail/${type}`,
        query: {
          classify: this.radio,
          classifyType: this.groupsValue,
          source: this.fromValue,
          startDate: this.startDate,
          endDate: this.endDate,
          lifeCycleValue: this.lifeCycleValue,
          repurchase: this.repurchase
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.topTitle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px 10px;
  .left {
    display: flex;
    align-items: center;
  }
  em {
    display: inline-block;
    width: 3px;
    height: 16px;
    background-color: #930ceaff;
    margin-right: 5px;
  }
  span {
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #333333;
    line-height: 22px;
  }
}
.fromBox {
  background: #ffffff;
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e0e6ed;
    padding: 20px 20px 20px 0;
    .top-left {
      .lableName {
        margin-left: 20px;
        font-weight: 600;
        font-size: 12px;
        color: #333333;
      }
      /deep/ .el-radio__label {
        font-size: 12px;
      }
      /deep/ .el-radio__input .el-radio__inner:hover {
        border-color: #930ceaff;
      }
      /deep/ .el-radio__input.is-checked + .el-radio__label {
        color: #930ceaff;
      }
      /deep/ .el-radio__input.is-checked .el-radio__inner {
        border-color: #930ceaff;
        background: #930ceaff;
      }
    }
    .top-right {
      color: #000000;
      font-size: 12px;
      i {
        margin-right: 5px;
      }
    }
  }
  .bottom {
    display: flex;
    align-items: center;
    padding: 20px 10px;
    .item {
      width: 566px;
      height: 115px;
      background: linear-gradient(90deg, #af68f9 0%, #7a39f5 100%);
      border-radius: 6px;
      display: flex;
      align-items: center;
      padding-left: 30px;
      .left {
        border-right: 1px solid #ffffff;
        padding: 20px;
        padding-right: 40px;
        h3 {
          font-size: 19px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #ffffff;
          line-height: 26px;
          font-weight: 400;
        }
        a {
          color: #ffffff;
          border-bottom: 1px solid #ffffff;
        }
      }
      .right {
        padding-left: 40px;
        h1 {
          font-size: 34px;
          font-family: AvenirNext-Bold, AvenirNext;
          font-weight: bold;
          color: #ffffff;
          line-height: 46px;
          margin-bottom: 0;
          span {
            font-size: 12px;
          }
        }
      }
      &.right {
        background: linear-gradient(90deg, #7db1f7 0%, #3356f9 100%);
        margin-left: 20px;
      }
    }
  }
}
.chartBox {
  background: #ffffff;
  margin-top: 10px;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  .title {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #e0e0e0;
    padding: 10px;
    .title-left {
      display: flex;
      align-items: center;
      h5 {
        margin-bottom: 0;
        margin-right: 5px;
        font-size: 18px;
      }
      i {
        color: #b8b8b8;
        font-size: 16px;
      }
      .lableName {
        margin-left: 20px;
        font-weight: 600;
        font-size: 12px;
        color: #333333;
      }
    }
    .title-right {
      display: flex;
      align-items: center;
      color: #000000;
      font-size: 12px;
      a {
        color: #930cea;
        border-bottom: 1px solid #930cea;
        margin-right: 10px;
      }
      .icon {
        color: #e0e0e0;
        font-size: 14px;
        cursor: pointer;
      }
      .dateBox {
        display: flex;
        align-items: center;
        color: #000000;
        font-size: 12px;
      }
      .el-icon-date {
        color: #000000;
        margin-right: 10px;
        font-size: 12px;
      }
      .date {
        color: #000000;
        font-size: 12px;
        margin-right: 15px;
      }
    }
  }
  .chart {
    height: 350px;
  }
  .legendbox {
    font-size: 12px;
    color: #000000;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 10px;
    .item {
      display: flex;
      align-items: center;
      margin-right: 20px;
      .add {
        width: 15px;
        height: 15px;
        border: 1px solid #930cea;
        border-radius: 4px;
        line-height: 12px;
        color: #930cea;
        text-align: center;
        margin-right: 20px;
      }
    }
    em {
      display: inline-block;
      width: 20px;
      height: 2px;
      margin-right: 5px;
    }
  }
}
.fillLineBox {
  display: flex;
  margin-top: 10px;
  .item {
    width: 49%;
    background-color: #ffffff;
    &.left {
      margin-right: 2%;
    }
    .item-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 52px;
      padding: 0 10px;
      border-bottom: 1px solid #e0e6ed;
      .title-left {
        display: flex;
        align-items: center;
        flex: 1;
        font-size: 18px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #333333;
        line-height: 25px;
        h3 {
          margin-bottom: 0;
          margin-right: 5px;
        }
        i {
          font-size: 16px;
          color: #b8b8b8;
        }
      }
      .title-right {
        color: #e0e0e0;
        font-size: 16px;
        cursor: pointer;
        display: flex;
        align-items: center;
        a {
          font-size: 12px;
          font-weight: 400;
          color: #930cea;
          border-bottom: 1px solid #930cea;
          margin-right: 10px;
        }
        .icon {
          color: #e0e0e0;
          font-size: 14px;
          cursor: pointer;
        }
      }
    }
    .num {
      color: #333333;
      font-weight: bold;
      padding-left: 10px;
      padding: 5px 10px;
      border-bottom: 1px solid #e0e0e0;
      span {
        font-size: 28px;
        line-height: 38px;
        margin-right: 5px;
      }
    }
    .chart {
      height: 350px;
    }
  }
}
</style>
