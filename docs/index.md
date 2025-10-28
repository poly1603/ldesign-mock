---
layout: home

hero:
  name: "@ldesign/mock"
  text: "强大的 Mock 数据管理工具"
  tagline: 让前后端并行开发成为可能
  image:
    src: /logo.svg
    alt: LDesign Mock
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: 查看 GitHub
      link: https://github.com/ldesign/mock

features:
  - icon: 🖥️
    title: Mock Server
    details: 本地 Mock 服务器，支持 RESTful 和 GraphQL API，快速搭建开发环境

  - icon: 🎲
    title: 智能数据生成
    details: 基于 @faker-js/faker 的智能数据生成器，支持 @placeholder 语法

  - icon: 🎭
    title: 场景管理
    details: 多场景 Mock 数据切换，轻松测试不同的业务场景

  - icon: 🎬
    title: 请求录制
    details: 录制真实 API 请求并自动生成 Mock 配置，减少 80% 配置时间

  - icon: 📥
    title: 导入导出
    details: 支持 JSON/YAML/TypeScript/JavaScript 多种格式，便于团队协作

  - icon: 📦
    title: 模板库
    details: 内置电商、CMS 等常用业务模板，开箱即用

  - icon: ⏱️
    title: 延迟模拟
    details: 模拟网络延迟和错误状态，真实还原各种网络环境

  - icon: 🔄
    title: 热重载
    details: 修改 Mock 配置后自动重启，提升开发效率

  - icon: 📊
    title: 可视化管理
    details: Web 界面管理 Mock 数据，实时查看统计和日志

  - icon: 🌐
    title: WebSocket 支持
    details: 实时日志和状态更新，让调试更加便捷

  - icon: 💾
    title: 数据持久化
    details: Mock 数据本地存储和版本管理，保护你的数据

  - icon: 🚀
    title: 轻量高效
    details: 轻量级设计，启动快速，占用资源少
---

## 快速开始

### 安装

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

### 初始化

```bash
npx ldesign-mock init
```

### 启动服务

```bash
npx ldesign-mock start
```

### 创建 Mock 接口

```javascript
// mock/user.js
export default {
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
}
```

## 为什么选择 @ldesign/mock？

<div class="vp-doc">

### 🚀 极速上手

只需 3 个命令即可启动完整的 Mock 服务器，无需复杂配置。

### 🎯 功能强大

从基础的 RESTful API 到高级的 GraphQL 支持，从简单的数据生成到复杂的场景管理，满足各种开发需求。

### 🤝 团队协作

标准化的数据导入导出，多场景管理，让团队协作更加高效。

### 📚 完善的文档

详细的使用文档、API 参考、最佳实践和丰富的示例，帮助你快速上手。

</div>

## 使用案例

@ldesign/mock 已被众多团队和项目采用，包括：

- 🛒 **电商平台** - 完整的商品、订单、支付流程 Mock
- 📝 **内容管理系统** - 文章、评论、媒体库管理
- 👥 **用户管理系统** - 用户认证、权限管理
- 📊 **数据可视化平台** - 图表数据生成和展示

## 开源协议

[MIT License](https://opensource.org/licenses/MIT)

Copyright © 2024-present LDesign Team
