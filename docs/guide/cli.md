# CLI 命令 <Badge type="tip" text="v1.0.0" />

@ldesign/mock 提供了一套简洁而强大的 CLI 工具，帮助你快速初始化、管理和启动 Mock 服务。

## 安装

全局安装（推荐）：

```bash
npm install -g @ldesign/mock
```

或在项目中安装：

```bash
npm install -D @ldesign/mock
```

安装后可使用 `lmock` 或 `ldesign-mock` 命令。

## 命令概览

```bash
lmock --help
```

输出：

```
lmock <command> [options]

Commands:
  lmock init [dir]           初始化 Mock 项目
  lmock start [dir]          启动 Mock 服务器
  lmock generate [type]      生成配置或模板
  lmock validate [file]      验证配置文件
  lmock record               记录真实接口
  lmock export [format]      导出 Mock 数据
  lmock templates            管理模板

Options:
  --version    显示版本号
  --help       显示帮助信息
```

## init - 初始化项目

快速创建 Mock 项目结构和配置文件。

### 基本用法

```bash
lmock init
```

这会在当前目录创建：

```
.
├── mock/
│   ├── index.js           # 主配置文件
│   └── routes/            # 路由目录
│       └── example.js     # 示例路由
└── mock.config.js         # 配置文件
```

### 指定目录

```bash
lmock init my-mock-project
```

### 选择模板

```bash
lmock init --template ecommerce
```

支持的模板：
- `basic` - 基础模板（默认）
- `ecommerce` - 电商系统
- `cms` - 内容管理系统
- `restful` - RESTful API
- `graphql` - GraphQL API

### 交互式创建

```bash
lmock init --interactive
```

会提示你选择：
- 项目名称
- 模板类型
- 是否使用 TypeScript
- 端口号
- 是否启用跨域
- 是否启用日志

### 选项

```bash
lmock init [dir] [options]

选项:
  -t, --template <name>     使用指定模板 (basic|ecommerce|cms|restful|graphql)
  -i, --interactive         交互式创建
  -p, --port <number>       指定端口号 (默认: 3001)
  --ts, --typescript        使用 TypeScript
  --no-install              跳过依赖安装
  --no-git                  不初始化 Git 仓库
  -f, --force               强制覆盖已存在的文件
```

### 示例

```bash
# 使用 TypeScript 创建电商项目
lmock init --template ecommerce --typescript

# 创建在指定目录，使用 CMS 模板
lmock init my-api --template cms --port 8080

# 交互式创建
lmock init --interactive
```

## start - 启动服务器

启动 Mock 服务器。

### 基本用法

```bash
lmock start
```

默认在 `http://localhost:3001` 启动服务。

### 指定配置目录

```bash
lmock start ./mock
```

### 选项

```bash
lmock start [dir] [options]

选项:
  -p, --port <number>       指定端口 (默认: 3001)
  -h, --host <address>      指定主机 (默认: localhost)
  -w, --watch               监听文件变化并自动重启
  --no-open                 不自动打开浏览器
  --quiet                   静默模式
  --verbose                 详细日志
  -c, --config <path>       指定配置文件路径
  --cors                    启用 CORS
  --delay <ms>              全局延迟 (毫秒)
  --record                  启动时记录请求
```

### 示例

```bash
# 指定端口启动
lmock start --port 8080

# 监听文件变化
lmock start --watch

# 静默模式，不打开浏览器
lmock start --quiet --no-open

# 启用 CORS 并添加全局延迟
lmock start --cors --delay 500

# 使用指定配置文件
lmock start --config ./custom-config.js

# 启动并记录请求
lmock start --record
```

## generate - 生成代码

快速生成配置文件、路由或模板。

### 生成路由文件

```bash
lmock generate route user
```

生成 `mock/routes/user.js`：

```javascript path=null start=null
export default {
  'GET /api/users': {
    response: {
      success: true,
      data: []
    }
  }
}
```

### 生成 RESTful 路由

```bash
lmock generate rest product
```

生成完整的 CRUD 接口：

```javascript path=null start=null
export default {
  'GET /api/products': { /* 列表 */ },
  'GET /api/products/:id': { /* 详情 */ },
  'POST /api/products': { /* 创建 */ },
  'PUT /api/products/:id': { /* 更新 */ },
  'DELETE /api/products/:id': { /* 删除 */ }
}
```

### 生成配置文件

```bash
lmock generate config
```

生成 `mock.config.js`。

### 选项

```bash
lmock generate <type> [name] [options]

类型:
  route      生成路由文件
  rest       生成 RESTful 路由
  config     生成配置文件
  template   生成自定义模板

选项:
  -o, --output <path>       输出路径
  -f, --force               强制覆盖已存在的文件
  --ts, --typescript        生成 TypeScript 文件
```

### 示例

```bash
# 生成 TypeScript 路由
lmock generate route user --typescript

# 生成到指定路径
lmock generate rest product --output ./api

# 强制覆盖已存在的文件
lmock generate config --force
```

## validate - 验证配置

验证配置文件的语法和逻辑是否正确。

### 基本用法

```bash
lmock validate
```

验证 `mock/index.js` 和 `mock.config.js`。

### 验证指定文件

```bash
lmock validate mock/routes/user.js
```

### 验证整个目录

```bash
lmock validate ./mock
```

### 选项

```bash
lmock validate [file] [options]

选项:
  -r, --recursive           递归验证目录
  --strict                  严格模式（更严格的检查）
  --fix                     自动修复可修复的问题
  --format <type>           输出格式 (table|json|pretty)
```

### 示例

```bash
# 严格模式验证
lmock validate --strict

# 验证并尝试修复
lmock validate --fix

# 递归验证目录，输出 JSON 格式
lmock validate ./mock --recursive --format json
```

### 验证结果

```bash
✓ mock/index.js - 验证通过
✓ mock/routes/user.js - 验证通过
✗ mock/routes/product.js - 发现错误:
  - 第 5 行: 缺少 response 字段
  - 第 12 行: 无效的状态码 999

验证完成: 2 通过, 1 失败
```

## record - 记录请求

记录真实 API 的请求和响应，生成 Mock 配置。

### 基本用法

```bash
lmock record https://api.example.com
```

会启动代理服务器，记录所有请求。

### 选项

```bash
lmock record [url] [options]

选项:
  -p, --port <number>       代理服务器端口 (默认: 3002)
  -o, --output <path>       输出文件路径 (默认: mock/recorded.js)
  -f, --filter <pattern>    过滤路径 (支持正则)
  --format <type>           输出格式 (js|json|typescript)
  --pretty                  美化输出
  --watch                   实时保存
  --max <number>            最大记录数量
```

### 示例

```bash
# 记录到指定文件
lmock record https://api.example.com --output ./api-backup.js

# 只记录 /api/users 相关接口
lmock record https://api.example.com --filter "/api/users.*"

# 输出为 JSON 格式
lmock record https://api.example.com --format json --pretty

# 实时保存，最多记录 100 个
lmock record https://api.example.com --watch --max 100
```

### 使用代理

记录后，将你的应用请求代理到：

```bash
http://localhost:3002
```

所有请求都会被记录并转发到真实服务器。

按 `Ctrl+C` 停止记录并保存。

## export - 导出数据

导出 Mock 数据为其他格式，便于分享或导入其他工具。

### 基本用法

```bash
lmock export
```

默认导出为 JSON 格式。

### 导出为 OpenAPI

```bash
lmock export openapi
```

生成 OpenAPI 3.0 规范文件。

### 导出为 Postman Collection

```bash
lmock export postman
```

生成 Postman Collection v2.1 格式。

### 选项

```bash
lmock export [format] [options]

格式:
  json           JSON 格式 (默认)
  openapi        OpenAPI 3.0 规范
  swagger        Swagger 2.0 规范
  postman        Postman Collection
  apidoc         API Blueprint
  har            HAR 格式

选项:
  -o, --output <path>       输出文件路径
  --pretty                  美化输出
  --include-examples        包含示例数据
```

### 示例

```bash
# 导出为 OpenAPI 并美化
lmock export openapi --pretty --output ./api-spec.json

# 导出为 Postman Collection
lmock export postman --output ./api.postman.json

# 导出为 HAR 格式
lmock export har --include-examples
```

## templates - 管理模板

查看、使用和管理内置模板。

### 列出所有模板

```bash
lmock templates list
```

输出：

```
可用模板:

📦 业务模板:
  - ecommerce     电商系统 (20+ 接口)
  - cms           内容管理系统 (25+ 接口)
  
👤 基础模板:
  - user          用户管理
  - product       商品管理
  
🎨 专业模板:
  - restful       RESTful API
  - graphql       GraphQL API
```

### 查看模板详情

```bash
lmock templates show ecommerce
```

### 使用模板

```bash
lmock templates use ecommerce
```

会将模板添加到当前项目。

### 选项

```bash
lmock templates <command> [options]

命令:
  list              列出所有模板
  show <name>       查看模板详情
  use <name>        使用模板
  search <query>    搜索模板
  update            更新模板库

选项:
  -c, --category <name>     按分类过滤
  -t, --tag <name>          按标签过滤
```

### 示例

```bash
# 搜索包含"订单"的模板
lmock templates search 订单

# 列出业务类模板
lmock templates list --category business

# 列出带有"电商"标签的模板
lmock templates list --tag 电商

# 更新模板库
lmock templates update
```

## 全局选项

所有命令都支持以下全局选项：

```bash
--version, -v        显示版本号
--help, -h           显示帮助信息
--no-color           禁用颜色输出
--debug              开启调试模式
```

### 示例

```bash
# 查看版本
lmock --version

# 调试模式启动
lmock start --debug

# 禁用颜色
lmock validate --no-color
```

## 配置文件

CLI 会按以下顺序查找配置：

1. 命令行参数
2. `mock.config.js`
3. `package.json` 中的 `mock` 字段
4. 默认配置

### mock.config.js

```javascript path=null start=null
export default {
  port: 3001,
  host: 'localhost',
  watch: true,
  cors: true,
  delay: 0,
  
  // 路由配置
  routes: './mock',
  
  // 日志配置
  log: {
    level: 'info',
    format: 'pretty'
  },
  
  // 记录配置
  record: {
    enabled: false,
    output: './mock/recorded.js'
  }
}
```

### package.json

```json
{
  "mock": {
    "port": 3001,
    "watch": true
  },
  "scripts": {
    "mock": "lmock start",
    "mock:record": "lmock record https://api.example.com"
  }
}
```

## 环境变量

支持通过环境变量配置：

```bash
# 设置端口
LMOCK_PORT=8080 lmock start

# 设置主机
LMOCK_HOST=0.0.0.0 lmock start

# 启用调试
DEBUG=lmock:* lmock start
```

支持的环境变量：

- `LMOCK_PORT` - 端口号
- `LMOCK_HOST` - 主机地址
- `LMOCK_CONFIG` - 配置文件路径
- `LMOCK_LOG_LEVEL` - 日志级别
- `DEBUG` - 调试命名空间

## npm scripts 集成

推荐在 `package.json` 中添加脚本：

```json
{
  "scripts": {
    "mock": "lmock start",
    "mock:dev": "lmock start --watch",
    "mock:record": "lmock record https://api.example.com",
    "mock:validate": "lmock validate",
    "mock:export": "lmock export openapi --output ./api-spec.json"
  }
}
```

使用：

```bash
npm run mock          # 启动 Mock 服务
npm run mock:dev      # 开发模式（自动重启）
npm run mock:record   # 记录真实接口
npm run mock:validate # 验证配置
npm run mock:export   # 导出 API 规范
```

## 最佳实践

### 1. 使用 watch 模式开发

```bash
lmock start --watch
```

修改配置文件后自动重启，无需手动。

### 2. 记录后验证

```bash
lmock record https://api.example.com
lmock validate mock/recorded.js
```

### 3. 版本控制

```bash
# 提交 Mock 配置
git add mock/
git commit -m "feat: add user mock apis"

# 忽略记录文件（可选）
echo "mock/recorded.js" >> .gitignore
```

### 4. 团队协作

```bash
# 导出为 OpenAPI，分享给团队
lmock export openapi --output ./api-spec.json
git add api-spec.json
git commit -m "docs: update api specification"
```

### 5. CI/CD 集成

```bash
# .gitlab-ci.yml
test:
  script:
    - npm run mock:validate
    - npm run mock &  # 后台启动
    - npm test        # 运行测试
```

## 常见问题

### 端口被占用

```bash
# 错误: Port 3001 is already in use
# 解决: 使用其他端口
lmock start --port 3002
```

### 配置文件找不到

```bash
# 错误: Cannot find mock config
# 解决: 指定配置路径
lmock start --config ./path/to/mock.config.js
```

### 权限错误

```bash
# 错误: EACCES: permission denied
# 解决: 使用 sudo 或修改端口为 > 1024
lmock start --port 8080
```

### TypeScript 支持

```bash
# 安装 tsx
npm install -D tsx

# 运行 TypeScript 配置
npx tsx node_modules/.bin/lmock start
```

或在 `package.json` 中：

```json
{
  "scripts": {
    "mock": "tsx node_modules/.bin/lmock start"
  }
}
```

## 调试

### 启用调试日志

```bash
DEBUG=lmock:* lmock start
```

### 详细模式

```bash
lmock start --verbose
```

输出详细的请求日志、配置信息和错误堆栈。

### 检查配置

```bash
lmock start --debug --no-open
```

打印完整配置信息，不启动服务器。

## 相关链接

- [快速开始](/guide/getting-started)
- [配置参考](/api/config)
- [请求记录](/guide/recording)
- [模板库](/guide/templates)
