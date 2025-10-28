# @ldesign/mock 文档

这是 @ldesign/mock 的完整 VitePress 文档站点。

## 📁 文档结构

```
docs/
├── .vitepress/
│   └── config.ts              # VitePress 配置
├── guide/                     # 使用指南
│   ├── introduction.md        # 简介
│   ├── getting-started.md     # 快速开始
│   ├── installation.md        # 安装
│   ├── mock-server.md         # Mock Server
│   ├── data-generator.md      # 数据生成器
│   ├── scenario-management.md # 场景管理
│   ├── recording.md           # 请求录制
│   ├── import-export.md       # 数据导入导出
│   ├── templates.md           # 模板库
│   ├── graphql.md             # GraphQL 支持
│   ├── websocket.md           # WebSocket
│   ├── hot-reload.md          # 热重载
│   ├── proxy.md               # 代理配置
│   ├── cli-overview.md        # CLI 概览
│   └── cli-commands.md        # CLI 命令
├── api/                       # API 参考
│   ├── types.md               # 类型定义
│   ├── config.md              # 配置选项
│   ├── mock-route.md          # Mock Route
│   ├── data-generator.md      # Data Generator API
│   ├── request-recorder.md    # Request Recorder API
│   ├── import-export.md       # Import/Export API
│   ├── mock-server.md         # Mock Server API
│   ├── rest-api.md            # REST API
│   └── graphql-api.md         # GraphQL API
├── best-practices/            # 最佳实践
│   ├── overview.md            # 概览
│   ├── project-structure.md   # 项目结构
│   ├── team-collaboration.md  # 团队协作
│   ├── performance.md         # 性能优化
│   └── security.md            # 安全建议
├── examples/                  # 示例
│   ├── ecommerce.md           # 电商系统
│   ├── cms.md                 # CMS 系统
│   ├── user-management.md     # 用户管理
│   ├── restful.md             # RESTful API
│   └── graphql.md             # GraphQL API
├── changelog.md               # 更新日志
├── index.md                   # 首页
├── package.json               # 文档项目配置
└── README.md                  # 本文件
```

## 🚀 本地开发

### 安装依赖

```bash
cd docs
pnpm install
```

### 启动开发服务器

```bash
pnpm docs:dev
```

访问 http://localhost:5173

### 构建文档

```bash
pnpm docs:build
```

构建产物会输出到 `.vitepress/dist` 目录。

### 预览构建结果

```bash
pnpm docs:preview
```

## 📝 编写文档指南

### Markdown 增强

VitePress 支持多种 Markdown 增强语法：

#### 代码组

```markdown
::: code-group

\`\`\`bash [pnpm]
pnpm add @ldesign/mock -D
\`\`\`

\`\`\`bash [npm]
npm install @ldesign/mock --save-dev
\`\`\`

:::
```

#### 自定义容器

```markdown
::: tip 提示
这是一条提示信息
:::

::: warning 警告
这是一条警告信息
:::

::: danger 危险
这是一条危险信息
:::

::: info 信息
这是一条普通信息
:::
```

#### 代码高亮

使用 `// [!code highlight]` 高亮特定行：

```javascript
export default {
  'GET /api/users': { // [!code highlight]
    response: { data: [] }
  }
}
```

使用 `// [!code ++]` 和 `// [!code --]` 标记添加和删除：

```javascript
export default {
  'GET /api/users': { // [!code --]
  'GET /api/user/list': { // [!code ++]
    response: { data: [] }
  }
}
```

### 内部链接

使用相对路径：

```markdown
查看 [快速开始指南](/guide/getting-started)
查看 [API 参考](/api/types)
```

### 图片

```markdown
![图片描述](/images/example.png)
```

图片放在 `docs/public/` 目录下。

## 🎨 样式指南

### 标题层级

- H1 (`#`) - 页面标题，每页只有一个
- H2 (`##`) - 主要章节
- H3 (`###`) - 子章节
- H4 (`####`) - 更小的章节

### 代码块

始终指定语言：

```markdown
\`\`\`javascript
// 代码
\`\`\`

\`\`\`typescript
// 代码
\`\`\`

\`\`\`bash
# 命令
\`\`\`
```

### 表格

```markdown
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 值1 | 值2 | 值3 |
```

## 🔍 搜索

文档使用 VitePress 内置的本地搜索功能，无需额外配置。

## 📦 部署

文档可以部署到以下平台：

- Vercel
- Netlify
- GitHub Pages
- CloudFlare Pages

### GitHub Pages 部署

在 `.github/workflows/deploy.yml`:

```yaml
name: Deploy Docs

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      
      - run: cd docs && pnpm install
      - run: cd docs && pnpm docs:build
      
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: docs/.vitepress/dist
```

## 🤝 贡献文档

欢迎贡献文档！请遵循以下步骤：

1. Fork 项目
2. 创建文档分支
3. 编写或修改文档
4. 提交 Pull Request

### 文档规范

- 使用清晰、简洁的语言
- 提供完整的代码示例
- 添加必要的截图或图表
- 保持代码风格一致
- 检查拼写和语法错误

## 📄 许可证

文档采用 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) 许可证。

代码示例采用 MIT 许可证。
