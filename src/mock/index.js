import Mock from 'mockjs'
import homeApi from './home'

Mock.setup({
  timeout: '100-2000'
})

Mock.mock(/\/home\/getData/, 'get', homeApi.getData)
