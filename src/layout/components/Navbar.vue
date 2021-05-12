<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <message-module class="right-menu-item" />
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <p>{{ name }}</p>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" classright-menu-item="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
            <el-dropdown-item divided @click.native="dialogVisible=true">
              <span style="display:block;">修改密码</span>
            </el-dropdown-item>
            <el-dropdown-item divided @click.native="logout">
              <span style="display:block;">退出登录</span>
            </el-dropdown-item>
          </router-link></el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog
      title="修改密码"
      :visible.sync="dialogVisible"
      width="500px"
      class="dialog-class"
      :before-close="handleClose"
    >
      <div class="dialog-content" :key="dialogVisible">
        <el-form ref="ruleForm" label-position="right" label-width="120px" :model="formLabelAlign" :rules="rules">
          <el-form-item label="原密码" prop="oldPassword">
            <el-input v-model="formLabelAlign.oldPassword" placeholder="请输入原密码"/>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="formLabelAlign.newPassword" placeholder="请输入新密码"/>
          </el-form-item>
          <el-form-item label="重复新密码" prop="confirmPassword">
            <el-input v-model="formLabelAlign.confirmPassword" placeholder="请再次输入新密码"/>
          </el-form-item>
          <el-form-item class="footers">
            <el-button class="cancel-btn" @click="handleClose">取 消</el-button>
            <el-button class="sure-btn" @click="submitForm('ruleForm')">确 定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import MessageModule from '@/components/message'
import {editPassword} from '@/api/user'
export default {
  components: {
    Breadcrumb,
    Hamburger,
    MessageModule
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name'
    ])
  },
  data() {
    const checkIsSame = (rule, value, callback) => {
      if (value) {
        if (this['_data']['formLabelAlign']['newPassword'] !== value) {
          callback(new Error('确认密码和新密码不一致'))
        } else {
          callback()
        }
      } else {
        callback(new Error('请输入确认密码'))
      }
    }
    return {
      dialogVisible: false,
      formLabelAlign: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        oldPassword: [
          {required: true, message: '请输入原密码', trigger: 'blur'}
        ],
        newPassword: [
          {required: true, message: '请输入新密码', trigger: 'blur'},
          {min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}
        ],
        confirmPassword: [
          {required: true, message: '请输入确认密码', trigger: 'blur'},
          {validator: checkIsSame, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    handleClose() {
      this.formLabelAlign.oldPassword = ''
      this.formLabelAlign.newPassword = ''
      this.formLabelAlign.confirmPassword = ''
      this.dialogVisible = false
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.subData()
        } else {
          return false
        }
      })
    },
    subData() {
      const _this = this
      editPassword({
        password: this.formLabelAlign.oldPassword,
        newPassword: this.formLabelAlign.newPassword,
        confirmPassword: this.formLabelAlign.confirmPassword
      })
        .then(res => {
          if (res.code === 200) {
            _this.$message({
              message: '密码修改成功，请重新登陆！',
              type: 'success'
            })
            setTimeout(function () {
              _this.logout()
            }, 100)
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 60px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 56px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 60px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        position: relative;
        p{
          font-weight: bold;
          font-size:14px;
        }

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
.sure-btn{
  background: #930CEA;
  width: 80px;
  height: 32px;
  padding: 0;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  color: #FFFFFF;
}
.cancel-btn{
  width: 80px;
  height: 32px;
  background: #FFFFFF;
  border-radius: 4px;
  color: #495060;
  border: 1px solid #CED3DD;
  padding: 0;
  &:hover{
    color: #495060 !important;
  }
}
.footers{
  display: flex;
  height: 60px;
  justify-content: flex-end;
  align-items: center;
  border-top: 1px solid #CED3DD;
  ::v-deep .el-form-item__content{
    margin-right: 30px;
  }
}
</style>
<style lang="less">
.dialog-class{
  .el-dialog__body{
    padding: 0;
  }
  .el-input__inner{
    width: 250px;
  }
  .dialog-content{
    color:#495060;
    .el-form-item__label{
      color:#495060 !important;
    }
  }
}
</style>
