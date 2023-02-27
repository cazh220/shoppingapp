// 控制台输入 vue inspect > output.js 可打印当前webpack配置
const path = require("path")
module.exports = {
  publicPath: "/",
  productionSourceMap: false,
  runtimeCompiler: true,

  chainWebpack: config => {
    // 配置路径别名
    config.resolve.alias.set("@", path.join(__dirname, "src"))
    config.module
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader")
      .tap(options => {
        // 修改它的选项...
        return options
      })
  }
}
