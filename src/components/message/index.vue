<template>
  <div class="message-box">
    <div class="message-content" @click="openLayer">
      <svg-icon icon-class="icon_message" />
      <span class="no-read">{{ noReadMsgNum }}</span>
    </div>
    <div
      v-show="messageLayer"
      v-clickoutside="handleClose"
      class="message-layer"
    >
      <div class="message-layer-header">
        <ul class="message-layer-header-uls">
          <!--<li :class="{'activeLi': messageType === 'business'}" @click="messageType = 'business'">业务信息</li>-->
          <li :class="{'activeLi': messageType === 'system'}">系统信息</li>
        </ul>
        <span class="read-all" @click="updateMsgStatus('')">
          <el-tooltip class="item" effect="dark" content="全部标记为已读" placement="bottom-end">
            <svg-icon icon-class="duihao" />
          </el-tooltip>
        </span>
      </div>
      <div class="message-layer-btn-box">
        <button :class="{'active': messageStatus === 'all'}" @click="getMsgList()">全部</button>
        <button :class="{'active': messageStatus === 'noRead'}" @click="getMsgList(0)">未读</button>
      </div>
      <div class="message-layer-content">
        <div
          v-for="(item, index) in messageList"
          :key="`${item.type}&${index}`"
          class="message-layer-content-item"
          @click="updateMsgStatus(item.id)"
        >
          <span class="message-icon">
            <svg-icon icon-class="icon-enjoyelse" />
          </span>
          <p class="message-txt">{{ item.content }}</p>
          <span class="message-time">{{ moment(item.createTime).format('M月D日') }}</span>
        </div>
        <p v-if="messageList.length === 0" class="no-read-txt">暂无消息</p>
      </div>
    </div>
  </div>
</template>

<script>
import { MsgList, noReadMsg, upDateMsg } from '@api/common'
import { mapGetters } from 'vuex'
import Clickoutside from '@utils/clickoutside'
import moment from 'moment'
export default {
  name: 'Index',
  directives: {
    Clickoutside
  },
  data() {
    return {
      messageList: [
        {
          type: 'enjoyElse1',
          icon: 'icon-enjoyelse',
          msg: 'admin分享了【近30天到店】用户画像给我',
          time: '10月18日'
        }],
      messageLayer: false,
      messageType: 'system',
      messageStatus: 'all',
      noReadMsgNum: 0
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'currentMessage'])
  },
  watch: {
    currentMessage() {
      if (this.currentMessage) {
        const currentMessage = JSON.parse(this.currentMessage)
        this.noReadMsgNum = currentMessage.noReadTotal
      }
    }
  },
  mounted() {
    this.getNoReadMsg()
    this.getMsgList()
  },
  methods: {
    moment,
    handleClose() {
      this.messageLayer = false
    },
    openLayer() {
      this.messageLayer = !this.messageLayer
      this.getMsgList()
    },
    // 获取消息列表
    async getMsgList(status = '') {
      this.messageStatus = status ? 'noRead' : 'all'
      const result = await MsgList({
        userId: this.userInfo.userId,
        status: status,
        pageNum: 1,
        pageSize: 100
      })
      if (result.code === 200) {
        this.messageList = result.data.list
      }
    },
    // 获取未读消息
    async getNoReadMsg() {
      const result = await noReadMsg(this.userInfo.userId)
      if (result.code === 200) {
        this.noReadMsgNum = result.data
      }
    },
    // 更新消息状态
    async updateMsgStatus(messageId) {
      const result = await upDateMsg({
        messageId: messageId
      })
      if (result.code === 200) {
        this.getNoReadMsg()
      }
    }
  }
}
</script>

<style scoped lang="less">
  .font{
    font-size: 12px;
    transform: scale(0.75);
    -webkit-transform: scale(0.75);
  }
  .message-box{
    height: 100%;
    line-height: 60px;
    cursor: pointer;
    .message-content{
      position: relative;
      .no-read{
        display: inline-block;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        line-height: 18px;
        text-align: center;
        background: #ED3F14;
        box-shadow: 0 1px 1px 1px rgba(0, 0, 0, 0.09);
        position: absolute;
        top: 13px;
        right: -7px;
        font-weight: 600;
        color: #FFFFFF;
        .font;
      }
    }
  }
  .message-layer{
    width: 409px;
    height: 491px;
    background: #FFFFFF;
    box-shadow: 0 0 7px 3px rgba(0, 0, 0, 0.06);
    border: 1px solid #E0E6ED;
    position: fixed;
    right: 100px;
    top: 40px;
    z-index: 100;
    &-header{
      height: 43px;
      line-height: 43px;
      border-bottom: 2px solid #E0E6ED;
      position: relative;
      &-uls{
        display: flex;
        margin-left: 10px;
        li{
          width: 100px;
          font-size: 13px;
          font-weight: 600;
          color: #333333;
          text-align: center;
          position: relative;
        }
        .activeLi{
          color: #930CEA;
          &:before{
            width: 100px;
            height: 2px;
            background-color:#930CEA;
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
          }
          //&:after{
          //  width: 8px;
          //  height: 8px;
          //  border-radius: 8px;
          //  content: '';
          //  background-color: #ED3F14;
          //  position: absolute;
          //  top: 50%;
          //  margin-top: -4px;
          //  right: 10px;
          //}
        }
      }
      .read-all{
        display: inline-block;
        width: 20px;
        position: absolute;
        top: 0;
        right: 20px;
        cursor: pointer;
      }
    }
    .message-layer-btn-box{
      display: flex;
      align-items: center;
      justify-items: center;
      padding: 12px 20px;
      button{
        width: 64px;
        height: 24px;
        line-height: 18px;
        border-radius: 13px;
        font-size: 12px;
        font-weight: 400;
        margin-right: 12px;
        border: none;
        outline: none;
        cursor: pointer;
        background: #F1F1F1;
        color: #A9A9A9;
      }
      .active{
        background: #F4E6FC;
        color: #9E0AED;
      }
    }
    &-content{
      height: 383px;
      overflow-y: auto;
      overflow-x: hidden;
      &-item{
        display: flex;
        position: relative;
        margin-bottom: 10px;
        .message-icon{
          display: inline-block;
          width: 16px;
          height: 14px;
          line-height: 14px;
          margin-left: 20px;
          margin-right: 10px;
          position: relative;
          top: 8px;
        }
        .message-txt{
          width: 235px;
          font-size: 13px;
          font-weight: 400;
          color: #333333;
          line-height: 19px;
          margin: 0;
          padding: 0;
          position: relative;
          top: 7px;
          word-break: break-all;
        }
        .message-time{
          font-size: 12px;
          font-weight: 400;
          line-height: 20px;
          color: #B8B8B8;
          position: absolute;
          top: 9px;
          right: 20px;
        }
      }
    }
  }
  .no-read-txt{
    text-align: center;
    margin-top: 100px;
    color: #c0c4cc;
  }
</style>
