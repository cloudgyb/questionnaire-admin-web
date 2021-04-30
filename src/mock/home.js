import Mock from 'mockjs'

export default {
  getData: () => {
    return {
      code: 2000,
      data: [
        {
          name: Mock.Random.first(),
          email: Mock.Random.email()
        },
        {
          name: Mock.Random.first(),
          email: Mock.Random.email()
        }
      ]
    }
  }
}
