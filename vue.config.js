module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: true,
  productionSourceMap: false,
  devServer: {
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      '/API': {
        //target: `http://localhost:3001`,
        target: `http://114.116.230.11:8082/api/it1`,
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          '^/API': ''
        },
      }
    },
    port: 3002
  },
  configureWebpack: {
    devtool: 'source-map'
  }
}

