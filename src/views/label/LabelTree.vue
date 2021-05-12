<!--标签树-->
<template>
  <div class="label-tree-warp">
    <div class="tree-box">
      <a-tree
        :key="treeKey"
        :tree-data="treeData"
        show-icon
        :default-expanded-keys="['U002', 'U002001', 'U002001001']"
        :default-checked-keys="['U002', 'U002001', 'U002001001']"
        :default-selected-keys="['U002001001001']"
        :replace-fields="props"
        @select="onSelect"
      >
        <template v-slot:parent="{selected}">
          <svg-icon v-if="selected" icon-class="parent-active" />
          <svg-icon v-else icon-class="parent" />
        </template>
        <template v-slot:child="{selected}">
          <svg-icon v-if="selected" icon-class="child-active" />
          <svg-icon v-else icon-class="child" />
        </template>
      </a-tree>
    </div>
    <el-button type="primary" class="diy-btn" @click="editLabel">标签维护</el-button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getLabelTree } from '@api/label'
export default {
  name: 'LabelTree',
  data() {
    return {
      treeData: [],
      props: {
        title: 'labelAlias',
        key: 'labelNo'
      },
      treeKey: ''
    }
  },
  computed: {
    ...mapGetters([
      'updateLabelTree'
    ])
  },
  watch: {
    updateLabelTree() {
      this.initAssignment()
    }
  },
  mounted() {
    this.initAssignment()
  },
  methods: {
    async initAssignment() {
      const result = await getLabelTree()
      if (result.code === 200) {
        const treeData = result.data.labelTree
        this.handleData(treeData)
        this.treeData = treeData
        this.treeKey = new Date().getTime()
      }
    },
    // 处理数据
    handleData(val) {
      if (!val || val.length === 0) {
        return
      }
      for (const item of val) {
        if (item.isLabel === '1') {
          this.$set(item, 'scopedSlots', { icon: 'child' })
        } else {
          this.$set(item, 'scopedSlots', { icon: 'parent' })
        }
        if (item.children && item.children.length !== 0) {
          this.handleData(item.children)
        }
      }
    },
    onSelect(selectedKeys, info) {
      if (info.selectedNodes[0].data.props.isLabel === '1') {
        this.$store.commit('label/SET_LABEL', selectedKeys[0])
        this.$parent.show = true
      } else {
        this.$store.commit('label/SET_LABEL', '')
      }
    },
    editLabel() {
      this.$parent.show = false
      this.$store.commit('label/SET_EDIT_TIME', new Date().getTime())
    }
  }
}
</script>

<style scoped lang="less">
  .label-tree-warp{
    width: 235px;
    height: calc(100vh - 60px);
    /*height: 100vh;*/
    background-color: #fff;
    position: relative;
  }
  .diy-btn{
    position: absolute;
    bottom: 20px;
    left: 70px;
  }
  .tree-box{
    height: calc(100vh - 150px);
    overflow-y: auto;
  }
</style>
<style>
  .ant-tree li .ant-tree-node-content-wrapper.ant-tree-node-selected{
    background-color: rgba(244, 230, 252, 1);
    font-size: 12px;
    font-weight: 600;
    color: #930CEA;
  }
</style>
