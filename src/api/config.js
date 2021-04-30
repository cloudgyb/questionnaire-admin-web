import Vue from 'vue'
import axios from 'axios'
import router from '@/router'
import { Message } from 'element-ui'

const msgNotify = function(t = 'info', m = '') {
  Message({
    type: t,
    message: m,
    duration: 2000
  })
}

const http = axios.create({
  timeout: 3000,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})

http.interceptors.request.use(
  config => {
    config.headers['token'] = Vue.$cookies.get('token') // 请求头带上token
    return config
  },
  error => {
    msgNotify('请求失败，请稍后重试！')
    Promise.reject(error)
  }
)

http.interceptors.response.use(
  response => {
    if (response.data && response.data.code === 401) {
      console.log(response)
      let token = Vue.$cookies.isKey('token')
      let msg = ''
      if (token) {
        msg = '会话过期，请重新登录！'
        Vue.$cookies.remove('token')
      } else {
        msg = '请登录！'
      }
      msgNotify('error', msg)
      router.push({ name: 'Login' })
      return Promise.reject(response)
    }
    return response
  },
  error => {
    msgNotify('请求失败，请稍后重试！')
    return Promise.reject(error)
  }
)

export default http
