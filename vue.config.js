module.exports = {
  lintOnSave: false,
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        appId: "com.example.app",
        productName: "aDemo", //项目名，也是生成的安装文件名，即aDemo.exe
        copyright: "Copyright © 2020", //版权信息
        directories: {
          output: "./dist", //输出文件路径
        }
      },
    },
  },
};
