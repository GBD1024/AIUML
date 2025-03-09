module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/demo/dist/mvp/' : '/',
  devServer: {
    host: '0.0.0.0', // 允许监听所有
    port: 8080, // 可以自定义端口号
    public: 'localhost:8080' // 对外公开的完整服务器地址
  }
}

