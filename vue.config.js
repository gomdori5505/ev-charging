module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  devServer: {
    proxy: 'http://open.ev.or.kr:8080'
  },
  publicPath: '/ev-charging/'
}