module.exports = {
  devServer: {
    port: 3333,
    open: true,
    proxy: 'http://localhost:8080'
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/assets/scss/_variable.scss";`
      }
    }
  }
}
