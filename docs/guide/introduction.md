# 简介

@ldesign/mock 是一个强大的 Mock 数据管理工具，旨在让前后端并行开发成为可能。

## 什么是 Mock？

在软件开发中，Mock 是指模拟真实接口的行为，返回预定义的数据，而不需要实际的后端服务。这种技术可以：

- ✅ 让前端开发不依赖后端进度
- ✅ 快速验证前端功能和交互
- ✅ 提供稳定的测试数据
- ✅ 模拟各种边界情况和错误场景

## 为什么选择 @ldesign/mock？

### 🚀 开箱即用

只需 3 个命令即可启动完整的 Mock 服务器：

```bash
pnpm add @ldesign/mock -D
npx lmock init
npx lmock start
```

### 🎯 功能全面

从基础的 RESTful API 到高级的 GraphQL 支持，从简单的数据生成到复杂的场景管理，@ldesign/mock 提供了完整的解决方案。

### 💡 智能高效

- **请求录制** - 从真实 API 自动生成 Mock 配置，减少 80% 配置时间
- **数据生成器** - 基于 @faker-js/faker，支持 `@placeholder` 语法
- **模板库** - 内置电商、CMS 等常用业务模板

### 🤝 团队友好

- **数据导入导出** - 标准化的数据格式，便于团队共享
- **场景管理** - 轻松切换不同的测试场景
- **版本控制** - Mock 数据可以像代码一样管理

## 核心特性

### 1. Mock Server

本地 Mock 服务器，支持：
- RESTful API
- GraphQL API
- WebSocket 实时通信
- 静态文件服务

### 2. 数据生成器

智能数据生成，支持：
- 内置 100+ 数据类型
- 自定义生成器
- 数组和分页数据
- 关联数据生成

### 3. 场景管理

灵活的场景管理：
- 多场景定义
- 一键切换
- 场景继承
- 动态场景

### 4. 请求录制 <Badge type="tip" text="新功能" />

革命性的功能：
- 录制真实 API 请求
- 自动生成 Mock 配置
- 支持过滤和转换
- 多种输出格式

### 5. 数据导入导出 <Badge type="tip" text="新功能" />

标准化的数据交换：
- JSON/YAML/TypeScript/JavaScript
- 版本兼容性检查
- 数据合并和覆盖
- 批量导入导出

### 6. 模板库 <Badge type="tip" text="新功能" />

开箱即用的模板：
- 电商系统（20+ 接口）
- CMS 系统（25+ 接口）
- 用户管理
- 更多模板持续添加

## 使用场景

### 前后端分离开发

前端团队可以基于 API 文档先行开发，无需等待后端接口完成。

```javascript
// 前端开发时使用 Mock
const API_BASE = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3001'  // Mock Server
  : 'https://api.production.com'  // 生产环境
```

### 接口联调测试

在集成测试阶段，使用 Mock 模拟各种场景：

```bash
# 测试成功场景
npx lmock scenario switch success

# 测试错误场景
npx lmock scenario switch error

# 测试超时场景
npx lmock scenario switch timeout
```

### 演示和 Demo

为产品演示准备稳定的数据：

```javascript
// 固定的演示数据
export default {
  'GET /api/dashboard': {
    response: {
      sales: 1234567,
      orders: 8900,
      users: 45000,
      // 精心准备的演示数据
    },
  },
}
```

### 自动化测试

为 E2E 测试提供可预测的数据：

```javascript
// Cypress/Playwright 测试
describe('User Management', () => {
  beforeEach(() => {
    // 使用 Mock 数据
    cy.intercept('GET', '/api/users', { fixture: 'users.json' })
  })

  it('should display user list', () => {
    // 测试逻辑
  })
})
```

## 工作原理

@ldesign/mock 基于 Express 构建，提供了完整的 HTTP 服务器功能：

```
┌─────────────┐
│   Browser   │
│  /Frontend  │
└──────┬──────┘
       │ HTTP Request
       ▼
┌─────────────────────────┐
│   @ldesign/mock Server  │
├─────────────────────────┤
│  ┌─────────────────┐    │
│  │  Route Handler  │    │
│  └────────┬────────┘    │
│           │             │
│  ┌────────▼────────┐    │
│  │ Data Generator  │    │
│  └────────┬────────┘    │
│           │             │
│  ┌────────▼────────┐    │
│  │    Response     │    │
│  └─────────────────┘    │
└─────────────────────────┘
       │ HTTP Response
       ▼
┌─────────────┐
│   Browser   │
│  /Frontend  │
└─────────────┘
```

## 性能特点

- **启动快速** - 通常在 1 秒内启动完成
- **响应迅速** - 平均响应时间 < 10ms（不含延迟配置）
- **内存占用小** - 基础运行约 50MB
- **支持大量路由** - 可管理 1000+ Mock 路由
- **热重载** - 修改配置后自动重载，无需重启

## 架构设计

@ldesign/mock 采用模块化设计，由多个独立的包组成：

```
@ldesign/mock (CLI)
    │
    ├── @ldesign/mock-core
    │   ├── ConfigManager      # 配置管理
    │   ├── DataGenerator      # 数据生成
    │   ├── ScenarioManager    # 场景管理
    │   ├── MockDatabase       # 数据持久化
    │   ├── RequestRecorder    # 请求录制
    │   └── DataImportExport   # 导入导出
    │
    ├── @ldesign/mock-server
    │   ├── MockServer         # HTTP 服务器
    │   ├── RESTfulHandler     # RESTful 处理
    │   ├── GraphQLHandler     # GraphQL 处理
    │   └── WebSocketManager   # WebSocket 管理
    │
    └── @ldesign/mock-web
        └── Web UI             # 管理界面
```

## 技术栈

- **核心** - TypeScript, Node.js
- **服务器** - Express, WebSocket
- **GraphQL** - graphql-yoga, @graphql-tools
- **数据生成** - @faker-js/faker
- **数据库** - better-sqlite3
- **CLI** - commander, inquirer, ora
- **Web UI** - Vue 3, Naive UI, Pinia

## 兼容性

### Node.js

- ✅ Node.js 16.x
- ✅ Node.js 18.x (推荐)
- ✅ Node.js 20.x

### 包管理器

- ✅ pnpm 8.x (推荐)
- ✅ npm 8.x+
- ✅ yarn 3.x+

### 操作系统

- ✅ macOS
- ✅ Linux
- ✅ Windows

## 对比其他工具

| 特性 | @ldesign/mock | json-server | mockoon | msw |
|------|---------------|-------------|---------|-----|
| RESTful API | ✅ | ✅ | ✅ | ✅ |
| GraphQL | ✅ | ❌ | ❌ | ✅ |
| 数据生成器 | ✅ 智能 | ❌ | ⚠️ 基础 | ❌ |
| 场景管理 | ✅ | ❌ | ✅ | ⚠️ |
| 请求录制 | ✅ | ❌ | ✅ | ❌ |
| 导入导出 | ✅ | ⚠️ | ✅ | ❌ |
| 模板库 | ✅ | ❌ | ⚠️ | ❌ |
| Web UI | ✅ | ❌ | ✅ | ❌ |
| CLI 工具 | ✅ | ✅ | ❌ | ❌ |
| 热重载 | ✅ | ⚠️ | ✅ | N/A |
| TypeScript | ✅ | ⚠️ | ✅ | ✅ |

## 许可证

@ldesign/mock 采用 [MIT](https://opensource.org/licenses/MIT) 许可证。

这意味着你可以：
- ✅ 商业使用
- ✅ 修改代码
- ✅ 分发
- ✅ 私有使用

## 下一步

- 📖 [快速开始](/guide/getting-started) - 5分钟上手教程
- 🎯 [核心概念](/guide/mock-server) - 了解核心功能
- 📚 [API 参考](/api/config) - 查看完整 API 文档
- 💡 [最佳实践](/best-practices/overview) - 学习使用技巧
- 🎬 [视频教程](https://www.youtube.com/watch?v=xxx) - 观看视频讲解

## 获取帮助

遇到问题？我们随时为你提供帮助：

- 📘 [文档](/guide/getting-started)
- 💬 [GitHub Discussions](https://github.com/ldesign/mock/discussions)
- 🐛 [报告问题](https://github.com/ldesign/mock/issues)
- 💡 [功能建议](https://github.com/ldesign/mock/issues/new?template=feature_request.md)
- 📧 Email: support@ldesign.com

## 贡献

@ldesign/mock 是一个开源项目，我们欢迎所有形式的贡献：

- 🐛 报告 Bug
- 💡 提出新功能
- 📝 改进文档
- 🔧 提交代码

查看 [贡献指南](https://github.com/ldesign/mock/blob/main/CONTRIBUTING.md) 了解更多。
