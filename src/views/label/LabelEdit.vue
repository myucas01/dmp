<template>
  <div v-loading="loading" class="label-edit-warp">
    <div class="header">
      <h3>{{ labelInfo.labelName }}</h3>
      <div class="operate">
        <el-button type="primary" class="end-edit" @click="subData">完成编辑</el-button>
        <el-button type="primary" class="end-delete" @click="deleteLabel">删除</el-button>
      </div>
    </div>
    <div class="content">
      <div class="item">
        <div class="item-title">ID:</div>
        <div class="item-value">{{ labelInfo.labelNo }}</div>
      </div>
      <div class="item">
        <div class="item-title">{{ labelInfo.level|levelName(labelInfo.labelNo) }}:</div>
        <div class="item-value">{{ labelInfo.labelName }}</div>
      </div>
      <div v-if="labelInfo.level > 3 && labelInfo.labelNo !== 'U003001001003'" class="item">
        <div class="item-title">标签值:</div>
        <div class="item-value">
          <ul>
            <li v-for="(labelItem, index) of labelInfo.labelValues" v-show="index < 10" :key="labelItem + '_'+ index">{{ labelItem }}</li>
          </ul>
        </div>
      </div>
      <div class="item">
        <div class="item-title">{{ labelInfo.labelAlias | labelAlias(labelInfo.labelNo) }}:</div>
        <div class="item-value">
          <el-input v-model="labelInfo.labelAlias" placeholder="请输入内容" style="width: 360px;" />
        </div>
      </div>
      <template v-for="(item, index) in labelInfo.leveTypes">
        <div :key="index" class="item">
          <div v-if="index > 0" class="item-title">所属{{ index }}级分类:</div>
          <div v-else class="item-title">所属组:</div>
          <div class="item-value">
            <el-select v-model="item.labelNo" placeholder="请选择" style="width: 360px;" @change="changeRelegation($event, item, index)">
              <el-option
                v-for="OptionItem in item.options"
                :key="OptionItem.labelNo"
                :label="OptionItem.labelName"
                :value="OptionItem.labelNo"
              />
            </el-select>
          </div>
        </div>
      </template>
      <div class="item">
        <div class="item-title">描述:</div>
        <div class="item-value">
          <el-input
            v-model="labelInfo.description"
            placeholder="请输入内容"
            type="textarea"
            style="width: 360px;"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { editLabelInfo, labelOptions, editLabel, deleteLabel } from '@api/label'

export default {
  name: 'LabelEdit',
  filters: {
    // 分类名称展示
    levelName(val, labelNo) {
      const value = val - 1
      let levelName
      switch (value) {
        case 0:
          levelName = '组名称'
          break
        case 1:
          levelName = '一级分类名称'
          break
        case 2:
          levelName = '二级分类名称'
          break
        default:
          levelName = '标签名称'
      }
      if (labelNo === 'U003001001003') {
        levelName = '三级分类名称'
      }
      return levelName
    },
    // 别名 名称 展示
    labelAlias(val, labelNo) {
      const value = val - 1
      let levelName
      switch (value) {
        case 0:
          levelName = '组别名'
          break
        case 1:
          levelName = '一级分类别名'
          break
        case 2:
          levelName = '二级分类别名'
          break
        default:
          levelName = '标签别名'
      }
      if (labelNo === 'U003001001003') {
        levelName = '三级分类别名'
      }
      return levelName
    }
  },
  data() {
    return {
      input: '',
      labelInfo: '',
      treeNodes: '',
      loading: true
    }
  },
  computed: {
    ...mapGetters([
      'operateLabel',
      'editTime'
    ])
  },
  watch: {
    editTime() {
      this.getLabelInfo()
      this.getLabelOptions(this.operateLabel)
    }
  },
  methods: {
    /**
       * 获取标签的 编辑 详情
       */
    async getLabelInfo() {
      const result = await editLabelInfo(this.operateLabel)
      if (result.code === 200) {
        this.labelInfo = result.data
        this.labelInfo.leveTypes = this.labelInfo.leveTypes ? this.labelInfo.leveTypes.reverse() : []
      }
    },
    /**
       * 获取当前标签 关联 标签的集联数据
       */
    async getLabelOptions(labelNo) {
      const result = await labelOptions(labelNo)
      if (result.code === 200) {
        const optionList = result.data ? result.data.nodes : []
        this.treeNodes = optionList
        this.handleOptionList(optionList)
      }
    },
    /**
     * 根据其 父级 labelNo 获取到其 子集 list
     */
    getNodeList(optionList, labelNo) {
      let returnVal = null
      const recursion = (optionList, labelNo) => {
        for (const item of optionList) {
          if (item.labelNo === labelNo) {
            returnVal = item.children
          } else {
            if (item.children && item.children.length > 0) {
              recursion(item.children, labelNo)
            } else {
              return returnVal
            }
          }
        }
      }
      recursion(optionList, labelNo)
      return returnVal
    },
    // 数据处理绑定
    handleOptionList(optionList, labelNo) {
      if (optionList && optionList.length > 0) {
        if (this.labelInfo.leveTypes && this.labelInfo.leveTypes.length > 0) {
          for (let i = 0; i < this.labelInfo.leveTypes.length; i++) {
            this.$set(this.labelInfo.leveTypes[i], 'options', [])
            if (i > 0) {
              const parentId = this.labelInfo.leveTypes[i - 1].labelNo
              const nodeList = this.getNodeList(optionList, parentId)
              if (labelNo && labelNo !== this.labelInfo.leveTypes[i].labelNo) {
                this.$set(this.labelInfo.leveTypes[i], 'labelName', nodeList[0].labelName)
                this.$set(this.labelInfo.leveTypes[i], 'labelNo', nodeList[0].labelNo)
              }
              this.$set(this.labelInfo.leveTypes[i], 'options', nodeList)
            } else {
              this.$set(this.labelInfo.leveTypes[i], 'options', optionList)
            }
          }
        }
      }
      this.loading = false
    },
    // 切换 隶属
    changeRelegation(val, item, index) {
      this.handleOptionList(this.treeNodes, item.labelNo)
    },
    /**
       * 删除标签(逻辑删除)
       * 类级别的标签 无法删除
       * 删除后 标签树 中不显示该标签，想要查看需要 配置表中更改数据状态
       */
    deleteLabel() {
      this.loading = true
      deleteLabel(this.labelInfo.labelNo)
        .then(res => {
          if (res.code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            // 更新 数
            // 更新 标签树
            this.$store.dispatch('common/getLabelTreeData')
              .then(res => {
                if (res.code === 200) {
                  this.$store.commit('label/SET_UPDATE_LABEL_TREE', new Date().getTime())
                }
              })
              .catch(err => console.error(err))
            this.loading = false
          } else {
            this.$message.error('操作失败')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    /**
       * 提交 修改后的标签
       */
    subData() {
      const { labelInfo } = this
      // 数据处理
      const subData = {
        'level': labelInfo.level,
        'labelName': labelInfo.labelName,
        'labelAlias': labelInfo.labelAlias,
        'labelNo': labelInfo.labelNo,
        'labelParentNo': labelInfo.leveTypes.length > 0 ? labelInfo.leveTypes[labelInfo.leveTypes.length - 1].labelNo : '',
        'labelParentLeve': labelInfo.leveTypes.length > 0 ? labelInfo.leveTypes[labelInfo.leveTypes.length - 1].level : '',
        'description': labelInfo.description
      }
      this.loading = true
      editLabel(labelInfo.labelNo, subData)
        .then(res => {
          if (res.code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            // 更新 标签树
            this.$store.dispatch('common/getLabelTreeData')
              .then(res => {
                if (res.code === 200) {
                  this.$store.commit('label/SET_UPDATE_LABEL_TREE', new Date().getTime())
                }
              })
              .catch(err => console.error(err))
            this.loading = false
          } else {
            this.$message.error('操作失败')
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style scoped lang="less">
  .label-edit-warp {
    width: 100%;
    height: 100%;
    background-color: #fff;

    .header {
      display: flex;
      height: 65px;
      line-height: 65px;
      border-bottom: 1px solid rgba(224, 230, 237, 1);
      background-color: #fff;
      justify-content: space-between;

      h3 {
        font-size: 20px;
        font-weight: 600;
        color: #333333;
        margin-left: 30px;
      }

      .operate {
        button {
          padding: 0;
        }

        .end-edit {
          width: 80px;
          height: 32px;
          background: #930CEA;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          color: #FFFFFF;
          line-height: 32px;
        }

        .end-delete {
          width: 80px;
          height: 32px;
          background: #FBEBFE;
          border-radius: 4px;
          border: 1px solid #930CEA;
          font-size: 12px;
          font-weight: 600;
          color: #930CEA;
          line-height: 32px;
        }
      }
    }

    .content {
      padding-top: 30px;

      .item {
        line-height: 50px;
        display: flex;
        align-items: center;

        .item-title {
          width: 220px;
          font-size: 14px;
          font-weight: 600;
          color: #495060;
          text-align: right;
        }

        .item-value {
          font-size: 14px;
          font-weight: 600;
          color: #333333;
          margin-left: 10px;

          ul {
            display: flex;
            flex-wrap: wrap;
            margin: 0;
            padding-bottom: 8px;
            padding-top: 15px;

            li {
              display: inline-block;
              height: 22px;
              line-height: 20px;
              text-align: center;
              background: #FBEBFE;
              border-radius: 11px;
              border: 1px solid #930CEA;
              font-size: 12px;
              font-weight: 400;
              color: #930CEA;
              margin-right: 10px;
              padding: 0 10px;
              margin-bottom: 10px;
            }
          }
        }
      }
    }
  }
</style>
