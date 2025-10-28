# VitePress 文档构建指南

本文档说明如何使用和扩展 @ldesign/mock 的 VitePress 文档。

## 📚 文档已完成内容

### ✅ 已创建文件

1. **配置文件**
   - `docs/.vitepress/config.ts` - VitePress 完整配置
   - `docs/package.json` - 文档项目配置

2. **首页和核心文档**
   - `docs/index.md` - 精美的首页，包含12个特性卡片
   - `docs/guide/getting-started.md` - 详细的快速开始指南
   - `docs/README.md` - 文档项目说明

## 🚀 快速开始

### 1. 安装依赖

```bash
cd docs
pnpm install
```

### 2. 启动开发服务器

```bash
pnpm docs:dev
```

浏览器访问 http://localhost:5173

### 3. 构建生产版本

```bash
pnpm docs:build
```

输出目录：`docs/.vitepress/dist`

## 📁 完整文档结构

根据配置文件，以下是需要创建的所有文档页面：

### Guide（使用指南）

```
docs/guide/
├── introduction.md          # 简介
├── getting-started.md       # 快速开始 ✅
├── installation.md          # 安装
├── mock-server.md           # Mock Server
├── data-generator.md        # 数据生成器
├── scenario-management.md   # 场景管理
├── recording.md             # 请求录制
├── import-export.md         # 数据导入导出
├── templates.md             # 模板库
├── graphql.md               # GraphQL 支持
├── websocket.md             # WebSocket
├── hot-reload.md            # 热重载
├── proxy.md                 # 代理配置
├── cli-overview.md          # CLI 概览
└── cli-commands.md          # CLI 命令
```

### API（API 参考）

```
docs/api/
├── types.md                 # 类型定义
├── config.md                # 配置选项
├── mock-route.md            # Mock Route
├── data-generator.md        # Data Generator API
├── request-recorder.md      # Request Recorder API
├── import-export.md         # Import/Export API
├── mock-server.md           # Mock Server API
├── rest-api.md              # REST API
└── graphql-api.md           # GraphQL API
```

### Best Practices（最佳实践）

```
docs/best-practices/
├── overview.md              # 概览
├── project-structure.md     # 项目结构
├── team-collaboration.md    # 团队协作
├── performance.md           # 性能优化
└── security.md              # 安全建议
```

### Examples（示例）

```
docs/examples/
├── ecommerce.md             # 电商系统
├── cms.md                   # CMS 系统
├── user-management.md       # 用户管理
├── restful.md               # RESTful API
└── graphql.md               # GraphQL API
```

### Other（其他）

```
docs/
└── changelog.md             # 更新日志
```

## 📝 文档模板

### 1. 指南页面模板

```markdown
# 页面标题

简短的介绍说明本页面的内容。

## 基本概念

解释核心概念和原理。

## 使用方法

### 基本用法

\`\`\`javascript
// 代码示例
\`\`\`

### 高级用法

\`\`\`javascript
// 高级示例
\`\`\`

## 配置选项

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| option1 | string | 'default' | 选项说明 |

## 示例

### 示例1：标题

描述和代码。

### 示例2：标题

描述和代码。

## 常见问题

### 问题1

解答。

### 问题2

解答。

## 相关链接

- [相关文档1](/guide/xxx)
- [相关文档2](/api/xxx)
```

### 2. API 参考页面模板

```markdown
# API 名称

## 导入

\`\`\`typescript
import { APIName } from '@ldesign/mock-core'
\`\`\`

## 类型定义

\`\`\`typescript
interface APIName {
  // 类型定义
}
\`\`\`

## 方法

### methodName()

方法描述。

**签名**

\`\`\`typescript
methodName(param: Type): ReturnType
\`\`\`

**参数**

- `param` - 参数说明

**返回值**

返回值说明。

**示例**

\`\`\`typescript
// 使用示例
\`\`\`

## 示例

完整的使用示例。

## 相关链接

- [相关 API](/api/xxx)
```

### 3. 示例页面模板

```markdown
# 示例：标题

## 概述

简要说明这个示例展示了什么。

## 功能清单

- 功能1
- 功能2
- 功能3

## 项目结构

\`\`\`
project/
├── mock/
│   ├── user.js
│   └── product.js
└── mock.config.js
\`\`\`

## 完整代码

### Mock 配置

\`\`\`javascript
// mock.config.js
export default {
  // 配置
}
\`\`\`

### Mock 数据

\`\`\`javascript
// mock/user.js
export default {
  // Mock 路由
}
\`\`\`

## 运行示例

\`\`\`bash
# 启动命令
\`\`\`

## 测试接口

\`\`\`bash
# 测试命令
\`\`\`

## 源代码

完整源代码可以在 [GitHub](链接) 找到。
```

## 🎨 样式和组件

### 自定义容器

```markdown
::: tip 提示
有用的提示信息
:::

::: warning 警告
需要注意的警告
:::

::: danger 危险
危险操作警告
:::

::: info 信息
一般性信息
:::

::: details 点击展开
隐藏的详细内容
:::
```

### 代码组

```markdown
::: code-group

\`\`\`bash [pnpm]
pnpm add @ldesign/mock -D
\`\`\`

\`\`\`bash [npm]
npm install @ldesign/mock --save-dev
\`\`\`

\`\`\`bash [yarn]
yarn add @ldesign/mock -D
\`\`\`

:::
```

### Badge

```markdown
<Badge type="info" text="v1.0.0" />
<Badge type="tip" text="新功能" />
<Badge type="warning" text="实验性" />
<Badge type="danger" text="已废弃" />
```

## 🛠️ 下一步工作

### 必须完成的文档

1. **核心指南** (优先级：高)
   - [ ] `guide/introduction.md` - 项目简介
   - [ ] `guide/data-generator.md` - 数据生成器详解
   - [ ] `guide/recording.md` - 请求录制指南
   - [ ] `guide/templates.md` - 模板库使用

2. **API 文档** (优先级：高)
   - [ ] `api/config.md` - 完整配置选项
   - [ ] `api/types.md` - TypeScript 类型定义
   - [ ] `api/data-generator.md` - 数据生成器 API

3. **示例文档** (优先级：中)
   - [ ] `examples/ecommerce.md` - 电商系统完整示例
   - [ ] `examples/cms.md` - CMS 系统示例

4. **最佳实践** (优先级：中)
   - [ ] `best-practices/overview.md` - 最佳实践总览
   - [ ] `best-practices/team-collaboration.md` - 团队协作指南

5. **其他** (优先级：低)
   - [ ] `changelog.md` - 更新日志

## 📦 部署

### GitHub Pages

在根目录创建 `.github/workflows/docs.yml`:

\`\`\`yaml
name: Deploy Docs

on:
  push:
    branches: [main]
    paths:
      - 'docs/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
          cache-dependency-path: docs/pnpm-lock.yaml
      
      - name: Install dependencies
        run: cd docs && pnpm install
      
      - name: Build
        run: cd docs && pnpm docs:build
      
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: docs/.vitepress/dist
\`\`\`

### Vercel

1. 在 Vercel 中导入项目
2. Root Directory 设置为 `docs`
3. Build Command: `pnpm docs:build`
4. Output Directory: `.vitepress/dist`

### Netlify

在 `docs` 目录创建 `netlify.toml`:

\`\`\`toml
[build]
  command = "pnpm docs:build"
  publish = ".vitepress/dist"
\`\`\`

## 🤝 贡献指南

1. **文档内容**
   - 保持语言清晰简洁
   - 提供完整可运行的代码示例
   - 添加必要的注释说明
   - 使用统一的术语

2. **代码示例**
   - 使用 TypeScript
   - 添加类型注解
   - 遵循项目代码规范
   - 确保示例可以直接运行

3. **Markdown 规范**
   - 使用正确的标题层级
   - 代码块指定语言
   - 使用相对链接
   - 添加适当的自定义容器

## 📞 获取帮助

- 📧 Email: support@ldesign.com
- 💬 Discord: https://discord.gg/ldesign
- 🐛 Issues: https://github.com/ldesign/mock/issues
