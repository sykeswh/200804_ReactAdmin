const { override, fixBabelImports, addLessLoader } = require('customize-cra');
const theme = require('./antd-theme.json')
module.exports = override(
    addLessLoader({
      javascriptEnabled: true,
      modifyVars:theme,
    }),
    //针对antd实现按需打包，根据import来打包
    fixBabelImports('import', {
      libraryName: 'antd',//名称和之前的不一样
      libraryDirectory: 'es',
      style: true, //自动打包相关的样式
    })
)