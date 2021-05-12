const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  userInfo: state => state.user.userInfo,
  permission_routes: state => state.permission.routes,
  editUserImg: state => state.userImg.editUserImg,
  operateLabel: state => state.label.operateLabel,
  editTime: state => state.label.editTime,
  updateLabelTree: state => state.label.updateLabelTree,
  messageUnRead: (state) => state.common.messageUnRead,
  currentMessage: (state) => state.common.currentMessage
}
export default getters
