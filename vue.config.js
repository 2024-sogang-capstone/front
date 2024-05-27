const { defineConfig } = require('@vue/cli-service')
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://ec2-43-200-182-138.ap-northeast-2.compute.amazonaws.com',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
    },
  },
}