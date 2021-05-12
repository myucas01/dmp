import request from '@/utils/request'
const urlPrefix = 'userImg'
/**
 * 消息 - 当前未读消息条数
 */
export function noReadMsg(userId) {
  return request({
    url: `/${urlPrefix}/route/websocket/noread/${userId}`,
    method: 'get'
  })
}
/**
 * 消息 - 更新消息状态
 */
export function upDateMsg(data) {
  return request({
    url: `/${urlPrefix}/route/websocket/update/msg`,
    method: 'post',
    data
  })
}
/**
 * 消息 - 消息列表
 */
export function MsgList(params) {
  return request({
    url: `/${urlPrefix}/route/websocket/msg`,
    method: 'get',
    params
  })
}
