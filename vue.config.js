module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  devServer: {
    proxy: 'http://open.ev.or.kr:8080'
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/ev-charging/'
    : '/'
}