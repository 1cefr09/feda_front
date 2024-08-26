const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8081,
    proxy: {
      '/api': {
        target: 'http://192.144.219.102:8080', // 后端服务器地址
        changeOrigin: true
      }
    }
  }
})
