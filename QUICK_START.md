# Mock 工具快速开始

## 📦 安装依赖

```bash
cd tools/mock
pnpm install
```

## 🔨 构建

```bash
# 构建所有包
pnpm build

# 或单独构建
cd packages/core && pnpm build
cd packages/server && pnpm build
cd packages/cli && pnpm build
```

## 🚀 运行示例

### 1. 创建测试项目

```bash
mkdir mock-test
cd mock-test
```

### 2. 初始化配置

```bash
# 使用本地构建的 CLI（从 tools/mock 目录）
node ../tools/mock/packages/cli/bin/cli.js init
```

这将创建：
- `mock.config.js` - 配置文件
- `mock/user.js` - 示例 Mock 文件

### 3. 启动服务器

```bash
node ../tools/mock/packages/cli/bin/cli.js start --watch --debug
```

服务器将在 `http://localhost:3001` 启动。

### 4. 测试 Mock 接口

```bash
# 获取用户列表
curl http://localhost:3001/api/users

# 获取用户详情
curl http://localhost:3001/api/user/123

# 创建用户
curl -X POST http://localhost:3001/api/user \
  -H "Content-Type: application/json" \
  -d '{"name":"张三","email":"zhangsan@example.com"}'
```

### 5. 查看 Web 界面（可选）

```bash
# 在另一个终端中
cd tools/mock/packages/web-ui
pnpm dev
```

访问 `http://localhost:5173`

## 📝 创建自定义 Mock

### 基础示例

```javascript
// mock/product.js
export default {
  'GET /api/products': {
    response: {
      success: true,
      data: [
        {
          id: '@uuid',
          name: '@word',
          price: '@float(10, 1000, 2)',
          image: '@image',
        },
      ],
    },
  },
}
```

### 高级示例

```javascript
// mock/order.js
export default {
  // 使用函数处理动态逻辑
  'GET /api/order/:id': (req, res) => {
    const { id } = req.params
    const status = req.query.status || 'pending'
    
    res.json({
      success: true,
      data: {
        id,
        orderNo: '@uuid',
        status,
        amount: '@float(100, 10000, 2)',
        items: [
          {
            productId: '@uuid',
            productName: '@word',
            quantity: '@int(1, 5)',
            price: '@float(10, 1000, 2)',
          },
        ],
        createdAt: '@date',
      },
    })
  },

  // 带延迟的响应
  'POST /api/order': {
    delay: 1000,
    response: {
      success: true,
      data: {
        id: '@uuid',
        orderNo: '@uuid',
        status: 'created',
        createdAt: '@date',
      },
      message: '订单创建成功',
    },
  },
}
```

## 🎭 场景切换

### 创建场景文件

```bash
mkdir -p mock/scenarios/success
mkdir -p mock/scenarios/error
```

```javascript
// mock/scenarios/success/user.js
export default {
  'POST /api/login': {
    response: {
      success: true,
      token: '@uuid',
      user: { id: '@uuid', name: '@name' },
    },
  },
}

// mock/scenarios/error/user.js
export default {
  'POST /api/login': {
    status: 401,
    response: {
      success: false,
      message: '用户名或密码错误',
    },
  },
}
```

### 切换场景

```bash
# 查看场景列表
node ../tools/mock/packages/cli/bin/cli.js scenario list

# 切换到错误场景
node ../tools/mock/packages/cli/bin/cli.js scenario switch error

# 切换回成功场景
node ../tools/mock/packages/cli/bin/cli.js scenario switch success
```

## 🔧 配置说明

### mock.config.js

```javascript
export default {
  server: {
    port: 3001,        // 服务器端口
    host: 'localhost', // 服务器主机
    delay: 0,          // 全局延迟（毫秒）
    websocket: true,   // 启用 WebSocket
  },
  
  // Mock 文件匹配模式
  files: ['mock/**/*.js', 'mock/**/*.ts'],
  
  // 场景配置
  scenarios: {
    success: 'mock/scenarios/success',
    error: 'mock/scenarios/error',
  },
  
  // 当前场景
  currentScenario: 'success',
  
  // GraphQL 配置
  graphql: {
    enabled: true,
    endpoint: '/graphql',
    playground: true,
  },
}
```

## 📊 API 管理

### 查看统计

```bash
curl http://localhost:3001/api/stats
```

### 查看日志

```bash
curl http://localhost:3001/api/logs
```

### 清空日志

```bash
curl -X DELETE http://localhost:3001/api/logs
```

## 🌐 GraphQL

启用 GraphQL 后，访问 `http://localhost:3001/graphql`

```graphql
# 查询用户
query {
  user(id: "1") {
    id
    name
    email
  }
}

# 查询用户列表
query {
  users(limit: 10) {
    id
    name
    email
  }
}

# 创建用户
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

## 🐛 调试技巧

### 1. 启用调试模式

```bash
node ../tools/mock/packages/cli/bin/cli.js start --debug
```

### 2. 查看请求日志

服务器会自动记录所有请求到数据库（`.mock/data.db`）

### 3. 检查 Mock 文件

确保：
- 文件使用 `export default` 导出
- 路由格式正确：`'METHOD /path'`
- 响应数据格式正确

### 4. 热重载

使用 `--watch` 参数，文件修改后自动重新加载：

```bash
node ../tools/mock/packages/cli/bin/cli.js start --watch
```

## 💡 提示

1. **数据生成器**：支持 `@placeholder` 语法，如 `@name`、`@email`、`@uuid` 等
2. **动态路由**：支持 `:id` 等参数，通过 `req.params` 访问
3. **场景管理**：适合测试不同的业务场景（成功、失败、加载等）
4. **热重载**：开发时使用 `--watch`，提高效率
5. **Web 界面**：实时查看统计和日志，管理更方便

## 🆘 常见问题

### Q: 端口被占用？
A: 使用 `--port` 参数指定其他端口：
```bash
node cli.js start --port 3002
```

### Q: Mock 文件没有生效？
A: 检查：
1. 文件路径是否匹配 `files` 配置
2. 路由格式是否正确
3. 是否使用了 `--watch` 参数

### Q: 数据没有随机？
A: 确保：
1. 使用 `@placeholder` 语法
2. 响应是对象而不是字符串
3. 数据生成器正确调用

## 📚 更多资源

- [完整文档](./README.md)
- [实现报告](./IMPLEMENTATION_COMPLETE.md)
- [示例模板](./templates/)

