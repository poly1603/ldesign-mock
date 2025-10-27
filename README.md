# @ldesign/mock

> 🎭 强大的 Mock 数据管理工具，让前后端并行开发成为可能

## ✨ 特性

- 🖥️ **Mock Server** - 本地 Mock 服务器，支持 RESTful/GraphQL
- 🎲 **数据生成器** - 基于 faker.js 的智能数据生成
- 🎭 **场景管理** - 多场景 Mock 数据切换
- ⏱️ **延迟模拟** - 模拟网络延迟和错误状态
- 💾 **数据持久化** - Mock 数据本地存储和版本管理
- 🔄 **热重载** - 修改 Mock 配置后自动重启
- 📊 **可视化管理** - Web 界面管理 Mock 数据

## 📦 安装

```bash
npm install @ldesign/mock --save-dev
```

## 🚀 快速开始

### 启动 Mock 服务

```bash
npx ldesign-mock start
```

### 创建 Mock 接口

```javascript
// mock/user.js
module.exports = {
  'GET /api/user/:id': (req, res) => {
    res.json({
      id: req.params.id,
      name: '@name',
      email: '@email',
      avatar: '@image(200x200)',
    });
  },
  
  'POST /api/login': {
    success: true,
    token: '@guid',
    user: {
      id: '@id',
      name: '@name',
    },
  },
};
```

## ⚙️ 配置

创建 `mock.config.js`：

```javascript
module.exports = {
  // 服务器配置
  server: {
    port: 3001,
    host: 'localhost',
    delay: 300, // 模拟延迟
  },
  
  // Mock 文件
  files: ['mock/**/*.js'],
  
  // 代理配置
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
  },
  
  // 场景切换
  scenarios: {
    success: 'mock/scenarios/success',
    error: 'mock/scenarios/error',
  },
};
```

## 🤝 贡献

欢迎贡献！请查看 [CONTRIBUTING.md](./CONTRIBUTING.md)。

## 📄 许可证

MIT © LDesign Team
@ldesign/mock - Mock data management
