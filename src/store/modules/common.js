import { labelTree } from '@api/userImg'
const getDefaultState = () => {
  return {
    labelTree: '', // 基本字典数据
    messageUnRead: '', // 未读消息数量
    currentMessage: '' // 当前消息
  }
}

const state = getDefaultState()

const mutations = {
  // 重置 状态
  RESET_STATE: state => {
    Object.assign(state, getDefaultState())
  },
  /**
   * 设置消息   websocket 推送过来的
   * @param state
   * @param data
   * @constructor
   */
  WEB_SOCKET_MSG: (state, data) => {
    state.messageUnRead = data ? JSON.parse(data).noReadTotal : 0
    state.currentMessage = data
  },
  // 设置未读消息数量
  SET_MESSAGE_UNREAD: (state, data) => {
    state.messageUnRead = data
  }
}

const actions = {
  getLabelTreeData() {
    return new Promise((resolve, reject) => {
      labelTree()
        .then(res => {
          if (res.code === 200) {
            console.info(res.data)
            localStorage.setItem('labelTree', JSON.stringify(res.data))
            resolve({ code: 200 })
          }
        })
    })
  },
  web_socket_msg: ({ commit }, msg) => {
    commit('WEB_SOCKET_MSG', msg)
  },
  set_message_unread: ({ commit }, msg) => {
    commit('SET_MESSAGE_UNREAD', msg)
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
