<template>
  <div class="main">
    <div class="title-wrapper">
      <span class="title">{{ systemInfo.systemName }}</span>
    </div>
    <div class="login-wrapper">
      <el-form :model="loginForm" :rules="rules" ref="loginForm" @keyup.native.13="submitForm('loginForm')" label-width="100px">
        <el-form-item label-width="0" prop="username" required>
          <el-input v-model="loginForm.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item label-width="0" prop="password" required>
          <el-input type="password" v-model="loginForm.password" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item label-width="0" prop="captcha" required>
          <div style="width:60%;display:inline-block">
            <img :src="captchaPath" style="height:38px;cursor:pointer" @click="getCaptcha" alt="验证码" />
          </div>
          <el-input v-model="loginForm.captcha" placeholder="验证码" style="width:40%;top:-15px"></el-input>
        </el-form-item>
        <el-form-item label-width="0">
          <el-button style="width:100%" type="primary" @click="submitForm('loginForm')">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="footer">
      <span>系统版本:{{ systemInfo.systemVersion }}</span>
      <span v-html="systemInfo.systemCopyright"></span>
    </div>
  </div>
</template>

<script>
import { getUUID } from '../utils'
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        captcha: '',
        uuid: ''
      },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      },
      captchaPath: '',
      systemInfo: {
        systemName: '问卷Online后台管理系统',
        systemVersion: '1.0.0',
        systemCopyright: '&copy cloudgyb.版权所有.'
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http.post('/sys/login', this.loginForm).then(resp => {
            console.log(resp)
            let data = resp.data
            if (data && data.code === 0) {
              let token = data.token
              let user = data.user
              this.$cookies.set('token', token.token)
              localStorage.setItem('user', JSON.stringify(user))
              this.$router.replace({ name: 'Home' })
            } else {
              this.getCaptcha()
              this.$message.error(data.msg)
            }
          })
        } else {
          console.log('form validate failed!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 获取验证码
    getCaptcha() {
      this.loginForm.uuid = getUUID()
      this.captchaPath = `/captcha.jpg?uuid=${this.loginForm.uuid}`
    },
    getSystemInfo() {
      this.$http.get('/system/info').then(resp => {
        let data = resp.data
        if (data && data.code === 0) {
          console.debug(data)
          this.systemInfo = data.data
          localStorage.setItem('systemInfo', JSON.stringify(this.systemInfo))
        } else {
          this.$message.error('获取系统信息出错！')
        }
      })
    }
  },
  mounted() {
    this.getCaptcha()
  },
  created() {
    this.getSystemInfo()
  }
}
</script>

<style scoped>
.main {
  padding-top: 8%;
}
.title-wrapper {
  text-align: center;
  font-size: 40px;
  margin-bottom: 20px;
}
.login-wrapper {
  position: relative;
  top: 10%;
  padding: 20px;
  width: 400px;
  height: 400px;
  margin: 0 auto;
  box-shadow: 0 2px 3px 3px #ccc;
}
.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  color: #c6c6c6;
  height: 30px;
  line-height: 30px;
  box-sizing: border-box;
  text-align: center;
}
@media screen and (max-height: 600px) {
  .footer {
    display: none;
  }
}
.footer span {
  margin-right: 20px;
}
</style>
