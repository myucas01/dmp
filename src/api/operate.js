import request from '@/utils/request'
const urlPrefix = 'userImg'
/**
 * 筛选条件
 */
export function filterInfo(params) {
  return request({
    url: `/userImg/dashboard/filter`,
    method: 'get',
    params
  })
}

/**
 * 全量数据
 */
export function alltotal(params) {
  return request({
    url: `/userImg/dashboard/total`,
    method: 'get',
    params
  })
}
/**
 * 人数趋势：活
 */
export function population(params) {
  return request({
    url: `/userImg/dashboard/population`,
    method: 'get',
    params
  })
}

/**
 * 生命周期：活
 */
export function lifecycle(params) {
  return request({
    url: `/userImg/dashboard/lifecycle`,
    method: 'get',
    params
  })
}

/**
 * 生命周期：活
 */
export function OtherGraph(params) {
  return request({
    url: `/userImg/dashboard/graph`,
    method: 'get',
    params
  })
}
/**
 *  详情 - 会员转化趋势
 */
export function transformationTrend(params) {
  return request({
    url: `/${urlPrefix}//dashboard/transform`,
    method: 'get',
    params
  })
}
/**
 *  详情 - 留存率
 */
export function retentionCharts(params) {
  return request({
    url: `/${urlPrefix}/dashboard/retention`,
    method: 'get',
    params
  })
}
/**
 *  详情 - 到店人均频次-粘分析
 */
export function frequenceCharts(params) {
  return request({
    url: `/${urlPrefix}/dashboard/graph/frequence`,
    method: 'get',
    params
  })
}
/**
 *  详情 - ARPU-值分析
 */
export function arpuCharts(params) {
  return request({
    url: `/${urlPrefix}/dashboard/graph/arpu`,
    method: 'get',
    params
  })
}
/**
 *  详情 - 下载
 */
export function downEchartsData(params) {
  let url = `/${urlPrefix}/dashboard/download?`
  if (params) {
    for (const key in params) {
      url += `${key}=${params[key]}&`
    }
  }
  return url
}
