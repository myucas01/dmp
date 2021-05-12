<!--数据字典-->
<template>
  <div class="data-dictionary">
    <el-table
      :data="configTableData"
      style="width: 100%"
      :row-key="getRowKeys"
      @expand-change="expandChange"
    >
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-table
            :data="scope.row.config"
            style="width: 100%"
          >
            <el-table-column
              prop="beforeName"
              label="横坐标源值"
              align="center"
              width="280"
            >
              <template slot-scope="scopeRow">
                <el-input v-model="scopeRow.row.beforeName" placeholder="请输入内容" />
              </template>
            </el-table-column>
            <el-table-column
              prop="mapperName"
              label="横坐标显示值"
              align="center"
              width="180"
            >
              <template slot-scope="scopeM">
                <el-input v-model="scopeM.row.mapperName" placeholder="请输入内容" />
              </template>
            </el-table-column>
            <el-table-column
              prop="sort"
              align="center"
              width="120"
              sortable
              label="排序值"
            >
              <template slot-scope="scopeSort">
                <el-input v-model="scopeSort.row.sort" placeholder="请输入内容" />
              </template>
            </el-table-column>
            <el-table-column
              prop="address"
              align="center"
              label="操作"
            >
              <template slot-scope="Rowscope">
                <!--<el-button size="small"  icon="el-move-top">上移</el-button>-->
                <!--<el-button size="small"  icon="el-move-down">下移</el-button>-->
                <el-button size="small" icon="el-move-add" @click="addConfig(scope.$index)">新增</el-button>
                <el-button
                  size="small"
                  icon="el-move-delete"
                  @click="deleteConfig(Rowscope.row.id, Rowscope.$index, scope.$index)"
                >删除
                </el-button>
                <el-button
                  size="small"
                  icon="el-move-save"
                  @click="saveConfig(scope.$index, Rowscope.row, Rowscope.row.id)"
                >保存
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column
        label="画像ID"
        prop="id"
      />
      <el-table-column
        size="medium"
        label="画像名称"
        prop="statName"
      >
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.statName"
            placeholder="请输入内容"
            style="width: 300px;"
            @blur="changeUserImgName(scope.row.id, scope.row.statName, '')"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="200"
        align="center"
      >
        <template slot-scope="scope">
          <div class="tip-box">
            <el-button type="text" @click="openTipsTiny(scope.row)"> tips <i class="el-icon-edit el-icon--right" />
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="修改tips"
      :visible.sync="dialogVisible"
      width="300"
    >
      <div>
        <tinymce ref="tinyChild" v-model="content" :height="300" :toolbar="toolbar" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  configList,
  editUserImgName,
  userImgConfig,
  addUserImgConfig,
  editUserImgConfig,
  deleteUserImgConfig
} from '@api/userImg'
import Tinymce from '@/components/Tinymce'

export default {
  name: 'Index',
  components: { Tinymce },
  data() {
    return {
      configTableData: [],
      getRowKeys(row) {
        return row.id
      },
      content: '',
      toolbar: ['bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat code preview', 'hr bullist numlist  charmap table  forecolor backcolor'],
      menubar: 'view format table',
      dialogVisible: false,
      editTipsID: ''
    }
  },
  mounted() {
    this.getConfigList()
  },
  methods: {
    // 获取画像配置列表
    async getConfigList() {
      const result = await configList()
      if (result.code === 200 && result.data) {
        const data = []
        for (const item of result.data) {
          for (const child of item.configVo) {
            this.$set(child, 'config', [])
            data.push(child)
          }
        }
        this.configTableData = data
      }
    },
    // 展开行
    expandChange(expandedRows, expanded) {
      if (expanded.length > 0) {
        // 展开
        this.getConfigDetail(expandedRows.id)
      } else {
        // 关闭
      }
      console.log(expandedRows, expanded)
    },
    // 获取配置详情
    async getConfigDetail(id) {
      const result = await userImgConfig(id)
      if (result.code === 200) {
        for (const item of this.configTableData) {
          if (item.id === id) {
            this.$set(item, 'config', result.data && result.data.length > 0 ? result.data : [
              {
                beforeName: '',
                configId: item.id,
                createTime: '',
                id: '',
                mapperName: '',
                sort: 1,
                status: '',
                updateTime: ''
              }
            ])
          }
        }
      }
    },
    // 更改画像名称
    changeUserImgName(id, name, description) {
      editUserImgName({
        id: id,
        statName: name,
        description: description
      })
        .then(res => {
          if (res.code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
          }
        })
    },
    // 删除配置
    deleteConfig(id, index, parenIndex) {
      this.configTableData[parenIndex].config.splice(index, 1)
      if (id) {
        deleteUserImgConfig([id])
          .then(res => {
            if (res.code === 200) {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
            }
          })
          .catch(err => console.log(err))
      }
    },
    // 添加配置
    addConfig(parenIndex) {
      this.configTableData[parenIndex].config.push({
        beforeName: '',
        configId: this.configTableData[parenIndex].id,
        createTime: '',
        id: '',
        mapperName: '',
        sort: 1,
        status: '',
        updateTime: ''
      })
    },
    // 保存配置
    async saveConfig(parenIndex, row, id) {
      // const data = this.configTableData[parenIndex].config[index]
      const data = row
      let result
      if (id) {
        // 编辑
        result = await editUserImgConfig(data)
      } else {
        // 新增
        result = await addUserImgConfig(data)
      }
      if (result.code === 200) {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.getConfigDetail(this.configTableData[parenIndex].id)
      }
    },
    // open dialog layer
    openTipsTiny(scopeRow) {
      const _this = this
      _this.dialogVisible = true
      _this.editTipsID = scopeRow.id
      _this.$nextTick(function() {
        setTimeout(function() {
          _this.$refs.tinyChild.setContent(scopeRow.description)
        }, 300)
      })
    },
    // 保存修改
    saveEdit() {
      this.dialogVisible = false
      this.changeUserImgName(this.editTipsID, '', this.content)
    }
  }
}
</script>

<style scoped lang="less">
  .data-dictionary {
    /deep/ .el-button {
      &:hover {
        color: #930CEA !important;
        background-color: transparent;
        border-color: #930CEA !important;
      }
    }

    .tip-box {
      margin-top: 10px;

      /deep/ .el-button {
        width: 200px;
        background-color: transparent;
        color: #930CEA !important;
        border: none;

        &:hover {
          color: #fff !important;
          background-color: #930ceaa1;
        }
      }
    }
  }
</style>
