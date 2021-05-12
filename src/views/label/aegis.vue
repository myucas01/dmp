<template>
  <div class="aegis-wrap">
    <div class="label-box">
      <label-tree />
    </div>
    <div style="margin-left: 20px;width: 100%;">
      <label-detail v-show="show" />
      <label-edit v-show="!show" />
    </div>
  </div>
</template>

<script>
import labelTree from '@/views/label/LabelTree'
import labelDetail from '@/views/label/LabelDetail'
import labelEdit from '@/views/label/LabelEdit'
export default {
  name: 'Detail',
  components: {
    labelTree,
    labelDetail,
    labelEdit
  },
  data() {
    return {
      show: true
    }
  },
  beforeRouteLeave(to, from, next) {
    // 清空选中值
    this.$store.commit('label/SET_LABEL', '')
    next()
  }
}
</script>

<style scoped lang="less">
  .aegis-wrap{
    height: 100%;
    display: flex;
    .label-box{
      height: 100%;
    }
  }
</style>
