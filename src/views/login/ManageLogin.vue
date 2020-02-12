<template>
  <div class="manage_login">
    <div class="login_box">
      <div class="platform_title">直播管理平台</div>
      <el-form ref="loginForm" :model="loginForm" :rules="rules" label-width="0" label-position="left">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" placeholder="请输入密码" type="password"></el-input>
        </el-form-item>
        <el-form-item class="operate_area" style="margin-bottom: 0;">
          <el-button class="login_btn" type="primary" @click="toLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { login } from '@/api/index'
export default {
  components: {},
  props: {},
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    ...mapActions([ 'ACTION_SIGN_IN' ]),
    toLogin () {
      let that = this
      that.$refs['loginForm'].validate(async value => {
        if (!value) return false
        let res = {}
        res = await login({ ...that.loginForm })
        if (res.code && res.code === '00000') {
          this.ACTION_SIGN_IN()
          that.$router.push({ name: 'liveManage' }).catch(err => {
            console.log(err)
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.manage_login {
  .login_box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    padding: 50px;
    box-shadow: 0px 0px 30px #dcdcde;
    border-radius: 8px;
    .platform_title {
      font-size: 24px;
      margin-bottom: 30px;
    }
    .operate_area {
      .login_btn {
        width: 100%;
      }
    }
  }
}
</style>
