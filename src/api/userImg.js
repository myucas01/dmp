/* jshint esversion: 6 */
import request from '@/utils/request'
const urlPrefix = 'userImg'
/**
 * 画像详情 (单个)
 */
export function userImgDetail(id, params) {
  return request({
    url: `/${urlPrefix}/profile/result/${id}`,
    method: 'get',
    params
  })
}
/**
 * 设置默认画像
 */
export function setDefaultNos(data) {
  return request({
    url: `/${urlPrefix}/profile/config/default`,
    method: 'post',
    data
  })
}
/**
 * 画像详情 (多个)
 */
export function userImgDetailMutiple(params) {
  return request({
    url: `/${urlPrefix}/profile/result/multi`,
    method: 'get',
    params
  })
}
/**
 * 固定配置列表
 */
export function configList(params) {
  return request({
    url: `/${urlPrefix}/profile/config/list`,
    method: 'get',
    params
  })
}
/**
 * 画像列表
 */
export function userImgList(params) {
  return request({
    url: `/${urlPrefix}/v1/profile/info/list`,
    method: 'get',
    params
  })
}
/**
 * 画像下载
 */
export function downUserImg(params) {
  return request({
    url: `/${urlPrefix}/download/info/excel`,
    method: 'get',
    params
  })
}

/**
 * 画像创建
 */
export function createUserImg(data) {
  return request({
    url: `/${urlPrefix}/v1/profile/info/create`,
    method: 'post',
    data
  })
}

/**
 * 画像 - 创建 - 同人对比
 */
export function createSelfCompare(data) {
  return request({
    url: `/${urlPrefix}/v1/profile/info/fellow/compare`,
    method: 'post',
    data
  })
}
/**
 * 画像 - 同人对比列表
 */
export function createSelfCompareList(profileNo, params) {
  return request({
    url: `/${urlPrefix}/v1/profile/info/${profileNo}`,
    method: 'get',
    params
  })
}

/**
 * 画像 - 标签树
 */
export function labelTree(params) {
  return request({
    url: `/${urlPrefix}/label/tree`,
    method: 'get',
    params
  })
}

/**
 * 画像 - 下载画像
 */
export function downImg(params) {
  return `/${urlPrefix}/download/info/excel`
}

/**
 * 画像 - 删除
 */
export function deleteImg(data) {
  return request({
    url: `/${urlPrefix}/v1/profile/info/delete`,
    method: 'post',
    data
  })
}

/**
 * 画像 - 修改画像标题
 */
export function editUserImgName(data) {
  return request({
    url: `/${urlPrefix}/profile/config/update`,
    method: 'post',
    data
  })
}

/**
 * 画像 - 查询某一画像配置下的字典数据
 */
export function userImgConfig(profileConfigId) {
  return request({
    url: `/${urlPrefix}//profile/dictionary/list/${profileConfigId}`,
    method: 'get'
  })
}

/**
 * 画像 - 新增字典数据 配置
 */
export function addUserImgConfig(data) {
  return request({
    url: `/${urlPrefix}/profile/dictionary/save`,
    method: 'post',
    data
  })
}

/**
 * 画像 - 修改字典数据 配置
 */
export function editUserImgConfig(data) {
  return request({
    url: `/${urlPrefix}/profile/dictionary/update`,
    method: 'post',
    data
  })
}

/**
 * 画像 - 删除字典数据 配置
 */
export function deleteUserImgConfig(data) {
  return request({
    url: `/${urlPrefix}/profile/dictionary/delete`,
    method: 'post',
    data
  })
}
/**
 * 画像 - 重新计算
 */
export function againCompute(data) {
  return request({
    url: `/${urlPrefix}/v1/profile/info/repeat/send`,
    method: 'post',
    data
  })
}

/**
 * 画像 - 画像类型
 */
export function userImgType(data) {
  return request({
    url: `/${urlPrefix}/profile/category/type`,
    method: 'get',
    data
  })
}
/**
 * 画像 - 画像类型 新增
 */
export function userImgTypeAdd(data) {
  return request({
    url: `/${urlPrefix}/profile/category/save`,
    method: 'post',
    data
  })
}
/**
 * 画像 - 画像类型 更新
 */
export function userImgTypeUpdate(data) {
  return request({
    url: `/${urlPrefix}/profile/category/type`,
    method: 'put',
    data
  })
}
/**
 * 画像 - 画像类型 删除
 */
export function userImgTypeDelete(categoryId) {
  return request({
    url: `/${urlPrefix}/profile/category/${categoryId}`,
    method: 'delete'
  })
}
/**
 * 画像 - 画像状态
 */
export function userImgStatus(data) {
  return request({
    url: `/${urlPrefix}/v1/profile/info/status`,
    method: 'get',
    data
  })
}

/**
 * 画像 - 画像来源
 */
export function userImgSource(data) {
  return request({
    url: `/${urlPrefix}/v1/profile/info/source`,
    method: 'get',
    data
  })
}
/**
 * 画像 - 画像品类
 */
export function userImgCategory(data) {
  return request({
    url: `/${urlPrefix}/v1/profile/info/category`,
    method: 'get',
    data
  })
}
/**
 * 画像 - 画像排序
 */
export function userImgSort(data) {
  return request({
    url: `/${urlPrefix}/v1/profile/info/sort`,
    method: 'post',
    data
  })
}
/**
 * 画像 - 画像分享
 */
export function userImgShare(data) {
  return request({
    url: `/${urlPrefix}/v1/profile/info/share`,
    method: 'post',
    data
  })
}
/**
 * 画像 - 画像待计算 队列
 */
export function awaitComputedList() {
  return request({
    url: `/${urlPrefix}/v1/profile/info/init`,
    method: 'get'
  })
}
/**
 * 画像 - 画像待计算 调整
 */
export function changeAwaitComputed(data) {
  return request({
    url: `/${urlPrefix}/v1/profile/info/init`,
    method: 'post',
    data
  })
}
/**
 * 画像 - 修改画像类型
 */
export function alterClass(data) {
  return request({
    url: `/${urlPrefix}/v1/profile/info/category`,
    method: 'post',
    data
  })
}
