const getDefaultState = () => {
  return {
    editUserImg: '' // 编辑的用户画像
  }
}
const state = getDefaultState()
const mutations = {
  SET_EDIT_USER_IMG: (state, data) => {
    state.editUserImg = data
  }
}

const actions = {
  set_edit_user_img: ({ commit }, data) => {
    commit('SET_EDIT_USER_IMG', data)
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
