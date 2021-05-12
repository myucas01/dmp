import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import permission from './modules/permission'
import userImg from './modules/userImg'
import label from '@/store/modules/label'
import common from '@/store/modules/common'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    permission,
    userImg,
    label,
    common
  },
  getters
})

export default store
