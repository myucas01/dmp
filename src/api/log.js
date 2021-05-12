import request from '@/utils/request'

const urlPrefix = 'userImg'

/**
 * 日志列表
 */
export function logList(params) {
  return request({
    url: `/${urlPrefix}//log/list`,
    method: 'get',
    params
  })
}

/**
 * 导出 日志
 */
export function exportLog() {
  return `/${urlPrefix}/log/export`
}
