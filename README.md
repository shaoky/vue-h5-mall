## vue商城h5 [线上访问地址](http://h5.mall.shaoky.com)

> 项目采用vue-cli构建

### 技术栈

```
vue2 vue-router vuex es6 less vux
```
### 安装

通过`npm`安装本地服务第三方依赖模块(需要已安装[Node.js](https://nodejs.org/))

```
npm install
```

启动服务(http://localhost:8020)

```
npm run dev
```

发布代码
```
npm run build
```

### 目录结构

<pre>
├── README.md           
├── build              // 构建服务和webpack配置
├── config             // 项目不同环境的配置
├── dist               // 项目build目录
├── index.html         // 项目入口文件
├── package.json       // 项目配置文件
├── src                // 生产目录
│   ├── api            // api接口
│   ├── assets         // css js 和图片资源
│   ├── components     // 各种组件
│   ├── config         // 配置
│   ├── router         // 配置路由
│   ├── store          // vuex状态管理
│   ├── views          // 各种页面
|   ├── mixins         // 混合通用方法
|   ├── store          // 状态管理
|   ├── utils          // 工具库
│   └── main.js        // Webpack 预编译入口
</pre>
