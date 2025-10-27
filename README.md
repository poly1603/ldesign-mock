# @ldesign/mock

> 🎭 强大的 Mock 数据管理工具，让前后端并行开发成为可能

## ✨ 特性

- 🖥️ **Mock Server** - 本地 Mock 服务器，支持 RESTful/GraphQL
- 🎲 **数据生成器** - 基于 @faker-js/faker 的智能数据生成
- 🎭 **场景管理** - 多场景 Mock 数据切换
- ⏱️ **延迟模拟** - 模拟网络延迟和错误状态
- 💾 **数据持久化** - Mock 数据本地存储和版本管理
- 🔄 **热重载** - 修改 Mock 配置后自动重启
- 📊 **可视化管理** - Web 界面管理 Mock 数据
- 🌐 **WebSocket 实时通信** - 实时日志和状态更新

## 📦 安装

```bash
# 使用 npm
npm install @ldesign/mock --save-dev

# 使用 pnpm
pnpm add @ldesign/mock -D
```

## 🚀 快速开始

### 1. 初始化配置

```bash
npx ldesign-mock init
```

这将创建默认的 `mock.config.js` 和示例 Mock 文件。

### 2. 启动 Mock 服务器

```bash
npx ldesign-mock start

# 或使用别名
npx lmock start

# 指定端口
npx lmock start --port 3002

# 开启热重载
npx lmock start --watch

# 调试模式
npx lmock start --debug
```

### 3. 访问 Web 界面

服务启动后，访问：
- Mock Server: http://localhost:3001
- Web 管理界面: http://localhost:5173 (开发模式)

### 4. 创建 Mock 接口

```javascript
// mock/user.js
export default {
  // 简单响应
  'GET /api/user/:id': {
    response: {
      success: true,
      data: {
        id: '@uuid',
        name: '@name',
        email: '@email',
        avatar: '@avatar',
      },
    },
  },
  
  // 函数响应
  'POST /api/login': (req, res) => {
    res.json({
      success: true,
      token: '@uuid',
      user: {
        id: '@uuid',
        name: req.body.username,
        email: '@email',
      },
    })
  },
  
  // 带延迟的响应
  'PUT /api/user/:id': {
    delay: 1000,
    response: {
      success: true,
      message: '更新成功',
    },
  },
}
```

## ⚙️ 配置

### mock.config.js

```javascript
export default {
  // 服务器配置
  server: {
    port: 3001,
    host: 'localhost',
    delay: 0,           // 全局延迟（毫秒）
    websocket: true,    // 启用 WebSocket
  },
  
  // Mock 文件路径（支持 glob 模式）
  files: ['mock/**/*.js', 'mock/**/*.ts'],
  
  // 代理配置
  proxy: {
    '/api/real': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
  },
  
  // 场景配置
  scenarios: {
    success: 'mock/scenarios/success',
    error: 'mock/scenarios/error',
    loading: 'mock/scenarios/loading',
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
  
  // GraphQL 配置
  graphql: {
    enabled: true,
    endpoint: '/graphql',
    playground: true,
  },
}
```

## 🎭 场景管理

### 查看场景列表

```bash
npx lmock scenario list
```

### 切换场景

```bash
npx lmock scenario switch error

# 或交互式选择
npx lmock scenario switch
```

### 查看当前场景

```bash
npx lmock scenario current
```

## 📝 数据生成语法

支持 `@placeholder` 语法：

```javascript
{
  // 基础类型
  id: '@uuid',
  guid: '@guid',
  name: '@name',
  email: '@email',
  
  // 数字
  age: '@int(18, 60)',
  price: '@float(10, 1000, 2)',
  count: '@number(1, 100)',
  
  // 文本
  title: '@title',
  content: '@paragraph',
  description: '@sentence',
  
  // 日期
  createdAt: '@date',
  birthday: '@past',
  deadline: '@future',
  
  // 图片
  avatar: '@avatar',
  cover: '@image',
  
  // 地址
  address: '@address',
  city: '@city',
  country: '@country',
  
  // 互联网
  url: '@url',
  domain: '@domain',
  ip: '@ip',
  
  // 公司
  company: '@company',
  jobTitle: '@jobTitle',
}
```

## 🌐 GraphQL 支持

启用 GraphQL 后，访问 `/graphql` 端点：

```javascript
// 查询
query {
  user(id: "1") {
    id
    name
    email
  }
  
  users(limit: 10) {
    id
    name
    email
  }
}

// 变更
mutation {
  createUser(input: {
    name: "张三"
    email: "zhangsan@example.com"
  }) {
    id
    name
    email
  }
}
```

## 📊 API 接口

Mock Server 提供以下管理接口：

- `GET /api/health` - 健康检查
- `GET /api/stats` - 统计信息
- `GET /api/logs` - 请求日志
- `DELETE /api/logs` - 清空日志
- `GET /api/scenarios` - 场景列表
- `POST /api/scenarios/:name` - 切换场景
- `GET /api/config` - 获取配置
- `PATCH /api/config` - 更新配置
- `GET /api/mocks` - Mock 路由列表
- `POST /api/mocks` - 添加 Mock 路由
- `DELETE /api/mocks` - 删除 Mock 路由

## 🏗️ 项目结构

```
tools/mock/
├── packages/
│   ├── core/          # 核心功能（配置、数据生成、场景管理）
│   ├── server/        # Mock 服务器（RESTful + GraphQL）
│   ├── cli/           # CLI 工具
│   └── web-ui/        # Web 管理界面（Vue 3）
├── templates/         # 模板文件
└── package.json
```

## 🔧 开发

```bash
# 安装依赖
pnpm install

# 构建所有包
pnpm build

# 开发模式
pnpm dev

# 测试
pnpm test
```

## 📝 CLI 命令

```bash
# 初始化
lmock init [options]
  -f, --force           强制覆盖已存在的配置文件

# 启动服务
lmock start [options]
  -p, --port <port>     服务器端口 (默认: 3001)
  -h, --host <host>     服务器主机 (默认: localhost)
  -c, --config <path>   配置文件路径
  -w, --watch           监听文件变化并热重载
  -d, --debug           调试模式
  --no-websocket        禁用 WebSocket
  --delay <ms>          全局延迟（毫秒）

# 场景管理
lmock scenario list              # 列出所有场景
lmock scenario switch [name]     # 切换场景
lmock scenario current           # 查看当前场景
```

## 🤝 贡献

欢迎贡献！请查看 [CONTRIBUTING.md](./CONTRIBUTING.md)。

## 📄 许可证

MIT © LDesign Team
