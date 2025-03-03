* 使用旧版OpenSSL提供程序  
在package.json中修改服务脚本，以包含OpenSSL遗留提供程序 
```
  "scripts": {
    "serve": "set NODE_OPTIONS=--openssl-legacy-provider && vue-cli-service serve",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint"
  },
```
* 在vue.config.js中添加下列代码，使得只有本机可以访问服务器  
```
  devServer: {
    host: '127.0.0.1', // 仅监听本地回环地址
    port: 8080, // 可以自定义端口号
    public: 'localhost:8080' // 对外公开的完整服务器地址
  }
```
