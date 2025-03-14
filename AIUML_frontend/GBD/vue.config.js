const path = require("path");

module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/demo/dist/mvp/" : "/",
  
  devServer: {
    host: "0.0.0.0", // 允许监听所有 IP
    port: 5173, // 本地开发端口
    public: "localhost:5173", // 指定对外暴露的完整地址
    proxy: {
      "/api": {
        target: "http://192.168.214.196:8080", // **确保后端 API 端口正确**
        changeOrigin: true, // **允许跨域**
        pathRewrite: { "^/api": "" }, // **去掉 "/api" 前缀**
        secure: false, // **如果后端是 HTTPS，必须设为 false**
      },
    },
  },

  configureWebpack: {
    resolve: {
      alias: {
        "~": path.resolve(__dirname, "src"),
      },
    },
  },
};
