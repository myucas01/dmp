<template>
  <div class="login-container">
    <div class="login-box">
      <div class="logo-box">
        <div class="gaiya-img" />
      </div>
      <div class="popup_screen_box_con">
        <div class="logo">
          <img src="@assets/img/logo_back.png" alt="">
        </div>
        <el-form ref="ruleForm" :model="loginForm" :rules="loginRules" class="loginForm">
          <el-form-item prop="username">
            <img src="../../assets/img/login/user@2x.png" alt="">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名"
            />
          </el-form-item>
          <el-form-item prop="password">
            <img src="../../assets/img/login/pwd@2x.png" alt="">
            <el-input
              v-model="loginForm.password"
              style="margin-top:10px;"
              type="password"
              placeholder="请输入密码"
              @keyup.enter.native="login"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              style="width: 100%;margin-top:10px;"
              type="primary"
              @click="subData"
            >登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('*请输入用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('*请输入密码'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
        systemId: '68a2a88a7a5b4db8a8c95053f093a15b'
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  computed: {
    ...mapGetters([])
  },
  methods: {
    // 提交数据
    subData() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.login()
        } else {
          this.$message({
            message: '请验证提交参数',
            type: 'warning'
          })
          return false
        }
      })
    },
    /**
     * 登录
     * 注意此处接口返回不规范，无code标示码
     */
    async login() {
      const _this = this
      _this.$store.dispatch('user/login', _this.loginForm)
        .then(() => {
          _this.loading = false
          _this.getLabelTree()
          _this.$router.push({ path: '/userImg/index' })
        })
        .catch(() => {
          _this.loading = false
        })
    },
    /**
     * 发起异步请求 预请求标签树数据
     */
    getLabelTree() {
      this.$store.dispatch('common/getLabelTreeData')
    }
  }
}
</script>
<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background: url("../../assets/img/login/login_backgroud.png");
  overflow: hidden;
  .login-box {
    position: absolute;
    top: 50%;
    left: 50%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    padding: 22px 32px 32px 32px ;
    width: 773px;
    height: 401px;
    background: #fff;
    box-shadow: 0px 5px 10px 5px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    transform: translate(-50%, -50%);
  }
  .logo-box {
    width: 50%;
    height: 361px;
    position: relative;
    &:after{
      content: '';
      width: 1px;
      height: 341px;
      background-color: #E9EAEC;
      position: absolute;
      top: 0;
      right: 0;
    }
    /*border-right: 1px solid rgba(0, 0, 0, 0.16);*/
  }
  .gaiya-img {
    margin: 31px 0 0 5px;
    width: 315px;
    height: 295px;
    background: url("../../assets/img/login/loginLeft.png") no-repeat;
    background-size: 315px;
  }
  .popup_screen_box_con {
    padding: 0 0 0 46px;
    width: 50%;
    height: 361px;
  }
  .logo {
    margin: 24px 0;
    height: 95px;
    text-align: center;
    .logo_img{
      display: inline-block;
      width: 100%;
      height: 95px;
    }
    img{
      display: inline-block;
      width: 100%;
      height: 95px;
    }
  }
  .el-button--primary {
    color: #fff;
    background-color: #930cea;
    border-color: #930cea;
  }
}
</style>
<style scoped lang="less">
  .loginForm{
    /deep/ .el-input__inner{
      width: 250px;
    }
    /deep/ .el-form-item__content{
      width: 290px !important;
    }
    /deep/ .el-input{
      width: 250px;
      margin-top: 0 !important;
      float: right;
    }
    /deep/ .el-button--primary{
      width: 290px !important;
    }
    /deep/ .el-form-item__error{
      left: 38px;
    }
    img{
      display: inline-block;
      width: 24px;
      height: 24px;
    }
  }
</style>
