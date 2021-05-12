import request from '@/utils/request'
const urlPrefix = 'userImg'
/**
 * 标签概览 - 标签数量
 */
export function getLabelTree() {
  return request({
    url: `/${urlPrefix}/label/all/tree`,
    method: 'get'
  })
}

/**
 * 标签概览 - 标签数量
 */
export function getLabelNums() {
  return request({
    url: `/${urlPrefix}/label/overview`,
    method: 'get'
  })
}

/**
 * 标签概览 - 标签历史数量
 */
export function getLabelHistoryNums() {
  return request({
    url: `/${urlPrefix}/label/history`,
    method: 'get'
  })
}

/**
 * 获取标签详情
 */
export function getLabelDetail(labelNo) {
  return request({
    url: `/${urlPrefix}/label/tree/${labelNo}`,
    method: 'get'
  })
}
/**
 * 编辑标签 详情
 */
export function editLabelInfo(labelNo) {
  return request({
    url: `/${urlPrefix}/label/tree/info/${labelNo}`,
    method: 'get'
  })
}

/**
 * 标签编辑
 */
export function editLabel(labelNo, data) {
  return request({
    url: `/${urlPrefix}/label/tree/${labelNo}`,
    method: 'put',
    data
  })
}
/**
 * 删除标签
 */
export function deleteLabel(labelNo) {
  return request({
    url: `/${urlPrefix}/label/tree/${labelNo}`,
    method: 'delete'
  })
}
/**
 * 删除标签
 */
export function labelOptions(labelNo) {
  return request({
    url: `/${urlPrefix}/label/info/list/${labelNo}`,
    method: 'get'
  })
}
