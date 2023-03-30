const path = require('path')

module.exports = {
  configureWebpack: config => {
    config.output.filename = 'js/[name].js'
    config.output.chunkFilename = 'js/[name].js'
  },
  outputDir: path.resolve(__dirname, '../data'),
  productionSourceMap: false,
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "@/assets/themes/dark.scss";
        `
      }
    }
  },
  pluginOptions: {
    i18n: {
      locale: 'uk',
      fallbackLocale: 'en',
      localeDir: '@/locales'
    }
  }
}
