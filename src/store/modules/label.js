
const getDefaultState = () => {
  return {
    operateLabel: '',
    editTime: new Date().getTime(),
    updateLabelTree: new Date().getTime()
  }
}

const state = getDefaultState()

const mutations = {
  // 重置状态
  RESET_STATE: state => {
    Object.assign(state, getDefaultState())
  },
  // 设置 label
  SET_LABEL: (state, operateLabel) => {
    state.operateLabel = operateLabel
  },
  // 设置编辑时间
  SET_EDIT_TIME: (state, data) => {
    state.editTime = data
  },
  // 设置 标签 树 同步
  SET_UPDATE_LABEL_TREE: (state, data) => {
    state.updateLabelTree = data
  }
}

const actions = {
  set_label: ({ commit }, data) => {
    commit('SET_LABEL', data)
  },
  set_edit_time: ({ commit }, data) => {
    commit('SET_EDIT_TIME', data)
  },
  set_update_label_tree: ({ commit }, data) => {
    commit('SET_UPDATE_LABEL_TREE', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

