import request from '@/utils/request'
/**
 * 登录
 */
export function login(data) {
  return request({
    url: '/login/auth/login',
    method: 'post',
    transformRequest: [
      function(data) {
        // Do whatever you want to transform the data
        let ret = ''
        for (const it in data) {
          ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret
      }
    ],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data
  })
}

/**
 * 获取用户信息
 * @returns {AxiosPromise}
 */

export function getUserInfo() {
  return request({
    url: '/login/get/me',
    method: 'get'
  })
}
/**
 * 画像 - 查询用户列表
 */
export function userList(params) {
  return request({
    url: `/login/sys/user/info/share`,
    method: 'get',
    params
  })
}

/**
 * 退出登录
 * @returns {AxiosPromise}
 */
export function logout() {
  return request({
    url: '/login/auth/logout',
    method: 'post'
  })
}
/**
 * 修改用户密码
 * @returns {AxiosPromise}
 */

export function editPassword(data) {
  return request({
    url: '/login/sys/user/info/password ',
    transformRequest: [
      function(data) {
        // Do whatever you want to transform the data
        let ret = ''
        for (const it in data) {
          ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret
      }
    ],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'post',
    data
  })
}
