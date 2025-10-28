# 快速开始

本指南将帮助你在几分钟内上手 @ldesign/mock。

## 安装

### 使用包管理器安装

::: code-group

```bash [pnpm]
pnpm add @ldesign/mock -D
```

```bash [npm]
npm install @ldesign/mock --save-dev
```

```bash [yarn]
yarn add @ldesign/mock -D
```

:::

### 系统要求

- Node.js 16.0 或更高版本
- pnpm 8.0 或更高版本（推荐）

## 初始化项目

运行初始化命令创建配置文件：

```bash
npx ldesign-mock init
```

这个命令会：

1. 创建 `mock.config.js` 配置文件
2. 创建 `mock/` 目录
3. 生成示例 Mock 文件

初始化过程中会询问几个配置问题：

```
? 服务器端口: 3001
? 服务器主机: localhost
? 全局延迟（毫秒）: 0
? 启用 WebSocket？ Yes
? 启用 GraphQL？ No
? 创建示例 Mock 文件？ Yes
```

## 项目结构

初始化完成后，你的项目结构如下：

```
your-project/
├── mock/
│   └── user.js          # 示例 Mock 文件
├── mock.config.js       # Mock 配置文件
└── package.json
```

## 创建第一个 Mock 接口

编辑 `mock/user.js` 文件：

```javascript
export default {
  // 获取用户列表
  'GET /api/users': {
    response: {
      success: true,
      data: {
        items: [
          {
            id: '@uuid',
            name: '@name',
            email: '@email',
            avatar: '@avatar',
            createdAt: '@date',
          },
        ],
        total: 100,
      },
    },
  },

  // 获取用户详情
  'GET /api/user/:id': {
    response: {
      success: true,
      data: {
        id: '@uuid',
        name: '@name',
        email: '@email',
        avatar: '@avatar',
        phone: '@phone',
        address: '@address',
        createdAt: '@date',
      },
    },
  },

  // 创建用户
  'POST /api/user': {
    delay: 500, // 模拟网络延迟
    response: {
      success: true,
      message: '用户创建成功',
      data: {
        id: '@uuid',
      },
    },
  },

  // 使用函数处理动态逻辑
  'POST /api/login': (req, res) => {
    const { username, password } = req.body
    
    if (username === 'admin' && password === '123456') {
      res.json({
        success: true,
        token: '@uuid',
        user: {
          id: '@uuid',
          name: username,
          role: 'admin',
        },
      })
    } else {
      res.status(401).json({
        success: false,
        message: '用户名或密码错误',
      })
    }
  },
}
```

## 启动 Mock 服务器

### 基本启动

```bash
npx ldesign-mock start
```

或使用别名：

```bash
npx lmock start
```

### 启动选项

```bash
# 指定端口
npx lmock start --port 3002

# 开启热重载
npx lmock start --watch

# 调试模式
npx lmock start --debug

# 禁用 WebSocket
npx lmock start --no-websocket

# 设置全局延迟
npx lmock start --delay 1000
```

启动成功后，你会看到：

```
✓ Mock Server started!

  Server:   http://localhost:3001
  Scenario: success

  Press Ctrl+C to stop
```

## 测试 Mock 接口

现在可以测试你的 Mock 接口了：

### 使用 curl

```bash
# 获取用户列表
curl http://localhost:3001/api/users

# 获取用户详情
curl http://localhost:3001/api/user/123

# 创建用户
curl -X POST http://localhost:3001/api/user \
  -H "Content-Type: application/json" \
  -d '{"name":"张三","email":"zhangsan@example.com"}'

# 登录
curl -X POST http://localhost:3001/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"123456"}'
```

### 使用浏览器

直接在浏览器中访问：

```
http://localhost:3001/api/users
http://localhost:3001/api/user/123
```

### 使用前端项目

在你的前端项目中配置 API 基础地址：

::: code-group

```javascript [axios]
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3001',
})

// 使用
api.get('/api/users').then(res => {
  console.log(res.data)
})
```

```javascript [fetch]
fetch('http://localhost:3001/api/users')
  .then(res => res.json())
  .then(data => {
    console.log(data)
  })
```

```typescript [vite代理]
// vite.config.ts
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
}
```

:::

## 配置文件

`mock.config.js` 是 Mock 服务器的配置文件：

```javascript
export default {
  // 服务器配置
  server: {
    port: 3001,
    host: 'localhost',
    delay: 0,
    websocket: true,
  },

  // Mock 文件路径（支持 glob 模式）
  files: ['mock/**/*.js', 'mock/**/*.ts'],

  // 场景配置
  scenarios: {
    success: 'mock/scenarios/success',
    error: 'mock/scenarios/error',
  },

  // 当前场景
  currentScenario: 'success',

  // 数据库配置
  database: {
    path: '.mock/data.db',
    wal: true,
  },

  // 日志配置
  logging: {
    requests: true,
    level: 'info',
  },

  // CORS 配置
  cors: {
    origin: true,
    credentials: true,
  },
}
```

## 下一步

现在你已经成功运行了第一个 Mock 服务器！接下来你可以：

- 📖 [了解数据生成器](/guide/data-generator) - 学习如何使用 `@placeholder` 语法生成各种数据
- 🎭 [学习场景管理](/guide/scenario-management) - 了解如何管理多个测试场景
- 🎬 [使用请求录制](/guide/recording) - 从真实 API 快速生成 Mock 配置
- 📦 [探索模板库](/guide/templates) - 使用内置模板快速开始
- ⚙️ [查看配置选项](/api/config) - 了解所有可用的配置选项

## 常见问题

### 端口被占用怎么办？

如果默认端口 3001 被占用，可以指定其他端口：

```bash
npx lmock start --port 3002
```

或者修改 `mock.config.js` 中的 `server.port` 配置。

### 如何在生产环境中禁用 Mock？

Mock 服务器应该只在开发环境中使用。在生产构建时，确保：

1. 不要将 `@ldesign/mock` 作为生产依赖
2. 使用环境变量控制 API 地址
3. 在代理配置中区分开发和生产环境

### Mock 文件没有生效？

检查以下几点：

1. Mock 文件路径是否匹配 `files` 配置
2. 文件是否正确导出（使用 `export default`）
3. 路由格式是否正确（如 `'GET /api/users'`）
4. 是否启用了热重载（`--watch`）

### 如何查看请求日志？

1. 启动服务器时添加 `--debug` 参数
2. 访问管理 API：`http://localhost:3001/api/logs`
3. 在配置中启用日志：`logging.requests = true`
