module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/demo/dist/mvp/' : '/',
  devServer: {
    host: '127.0.0.1', // 仅监听本地回环地址
    port: 8080, // 可以自定义端口号
    public: 'localhost:8080' // 对外公开的完整服务器地址
  }
}

