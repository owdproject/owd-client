// import version from package.json
process.env.VUE_APP_VERSION = require('./package.json').version;

module.exports = {
  indexPath: 'index.html',
  outputDir: 'dist',

  devServer: {
    disableHostCheck: true,
    host: '0.0.0.0',
    port: 3000
  },

  css: {
    loaderOptions: {
      scss: {
        additionalData:
          `@import "@/assets/themes/${process.env.VUE_APP_THEME}/variables.scss";`,
      }
    }
  },

  pwa: {
    name: process.env.VUE_APP_NAME,
    themeColor: '#161719',
    msTileColor: '#161719',
    manifestOptions: {
      background_color: '#161719'
    },
    iconPaths: {
      favicon32: 'img/icons/favicon-32x32.png',
      favicon16: 'img/icons/favicon-16x16.png',
      appleTouchIcon: 'img/icons/apple-touch-icon-152x152.png',
      maskIcon: 'img/icons/safari-pinned-tab.svg',
      msTileImage: 'img/icons/msapplication-icon-144x144.png'
    },
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      // swSrc is required in InjectManifest mode.
      swSrc: 'service-worker.js',
      exclude: [/\.map$/, /_redirects/, /robots.txt/]
    }
  },

  chainWebpack: (config) => {
    config.resolve.symlinks(false)
  }
};
