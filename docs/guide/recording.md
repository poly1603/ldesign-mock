# 请求录制 <Badge type="tip" text="新功能" />

请求录制是 @ldesign/mock 的革命性功能，可以从真实 API 自动生成 Mock 配置，大幅减少手动编写的工作量。

## 为什么需要请求录制？

### 传统方式的痛点

手动编写 Mock 配置通常需要：

1. 📖 查看 API 文档
2. ✍️ 手动编写路由
3. 🎨 构造响应数据
4. 🐛 调试和验证

这个过程耗时且容易出错。

### 请求录制的优势

- ⚡ **快速** - 从真实 API 自动生成，减少 80% 配置时间
- 🎯 **准确** - 使用真实的请求和响应数据
- 🔄 **同步** - 快速与后端 API 保持同步
- 🛡️ **可靠** - 减少人为错误

## 基本用法

### 简单录制

录制所有请求（手动停止）：

```bash
npx lmock record http://api.example.com
```

在另一个终端或浏览器中操作目标 API，按 `Ctrl+C` 停止录制。

### 限时录制

录制 30 秒：

```bash
npx lmock record http://api.example.com -d 30000
```

### 限量录制

最多录制 50 个请求：

```bash
npx lmock record http://api.example.com -m 50
```

## 过滤选项

### 按 HTTP 方法过滤

只录制 GET 和 POST 请求：

```bash
npx lmock record http://api.example.com --methods GET,POST
```

### 按路径过滤

只录制特定路径：

```bash
# 录制 /api/users 和 /api/products 下的所有请求
npx lmock record http://api.example.com \
  --paths '/api/users/*,/api/products/*'
```

### 排除特定路径

排除不需要的路径：

```bash
# 排除登录和健康检查接口
npx lmock record http://api.example.com \
  --exclude '/api/login,/api/health'
```

### 组合过滤

```bash
npx lmock record http://api.example.com \
  --methods GET,POST \
  --paths '/api/*' \
  --exclude '/api/internal/*' \
  -d 60000 \
  -m 100
```

## 输出选项

### JavaScript 格式（默认）

```bash
npx lmock record http://api.example.com -o mock/api.js
```

生成的文件：

```javascript
/**
 * Mock routes - Recorded from http://api.example.com
 * Recorded at: 2024-01-15T10:30:00.000Z
 * Total requests: 15
 */

export default {
  'GET /api/users': {
    "status": 200,
    "response": {
      "success": true,
      "data": [...]
    },
    "delay": 45,
    "headers": {
      "content-type": "application/json"
    }
  },
  
  'POST /api/user': {
    "status": 201,
    "response": {
      "success": true,
      "data": {...}
    },
    "delay": 123
  }
}
```

### TypeScript 格式

```bash
npx lmock record http://api.example.com -f ts -o mock/api.ts
```

生成的文件：

```typescript
import type { MockFileDefinition } from '@ldesign/mock-core'

/**
 * Mock routes - Recorded from http://api.example.com
 */

const routes: MockFileDefinition = {
  'GET /api/users': {
    status: 200,
    response: {
      success: true,
      data: [...]
    }
  }
}

export default routes
```

### JSON 格式

```bash
npx lmock record http://api.example.com -f json -o mock/api.json
```

## 完整工作流程

### 1. 准备环境

确保目标 API 服务正在运行：

```bash
# 假设后端运行在 8080 端口
curl http://localhost:8080/api/health
```

### 2. 开始录制

```bash
npx lmock record http://localhost:8080 \
  --methods GET,POST,PUT,DELETE \
  --paths '/api/*' \
  -o mock/recorded.js
```

你会看到：

```
🎬 开始录制 API 请求

目标: http://localhost:8080
输出: mock/recorded.js
格式: js

⚠ 请在另一个终端中发送请求到目标 API
  或使用浏览器访问目标 URL 并进行操作

按 Ctrl+C 停止录制
```

### 3. 操作 API

在浏览器或另一个终端中操作 API：

```bash
# 在另一个终端
curl http://localhost:8080/api/users
curl http://localhost:8080/api/user/123
curl -X POST http://localhost:8080/api/user \
  -H "Content-Type: application/json" \
  -d '{"name":"张三"}'
```

你会在录制终端看到实时反馈：

```
✓ GET /api/users (123ms)
✓ GET /api/user/123 (45ms)
✓ POST /api/user (234ms)
```

### 4. 停止录制

按 `Ctrl+C` 停止：

```
⚠ 收到停止信号

录制统计:
  请求总数: 3
  录制时长: 15.2s
  输出文件: D:\project\mock\recorded.js

✓ Mock 文件已生成，可以在配置中使用了！
```

### 5. 使用生成的 Mock

将生成的文件添加到配置：

```javascript
// mock.config.js
export default {
  files: [
    'mock/**/*.js',
    'mock/recorded.js',  // 添加录制的文件
  ],
}
```

启动 Mock 服务器：

```bash
npx lmock start
```

## 高级技巧

### 录制特定场景

#### 成功场景

```bash
# 录制成功场景
npx lmock record http://api.example.com \
  --paths '/api/success/*' \
  -o mock/scenarios/success/api.js
```

#### 错误场景

```bash
# 触发错误，然后录制
npx lmock record http://api.example.com \
  --paths '/api/error/*' \
  -o mock/scenarios/error/api.js
```

### 录制完整用户流程

创建一个脚本来模拟用户操作：

```bash
# test-flow.sh
#!/bin/bash

# 1. 登录
curl -X POST http://localhost:8080/api/login \
  -d '{"username":"test","password":"123456"}'

# 2. 获取用户信息
curl http://localhost:8080/api/user/me

# 3. 浏览商品
curl http://localhost:8080/api/products

# 4. 添加购物车
curl -X POST http://localhost:8080/api/cart \
  -d '{"productId":"123","quantity":1}'

# 5. 创建订单
curl -X POST http://localhost:8080/api/order \
  -d '{"items":[...]}'
```

然后同时运行录制：

```bash
# 终端 1：开始录制
npx lmock record http://localhost:8080 \
  -o mock/user-flow.js

# 终端 2：运行测试脚本
bash test-flow.sh
```

### 自动化录制

在 package.json 中添加脚本：

```json
{
  "scripts": {
    "mock:record": "lmock record http://localhost:8080 -o mock/recorded.js",
    "mock:record:users": "lmock record http://localhost:8080 --paths '/api/users/*' -o mock/users.js",
    "mock:record:products": "lmock record http://localhost:8080 --paths '/api/products/*' -o mock/products.js"
  }
}
```

使用：

```bash
npm run mock:record:users
```

## 程序化使用

在代码中使用录制器：

```typescript
import { RequestRecorder } from '@ldesign/mock-core'
import { writeFile } from 'fs/promises'

const recorder = new RequestRecorder()

// 开始录制
const sessionId = recorder.startRecording({
  target: 'http://api.example.com',
  filter: {
    methods: ['GET', 'POST'],
    paths: ['/api/*'],
  },
  duration: 30000,
})

// 监听录制事件
recorder.on('request-recorded', (request) => {
  console.log(`录制: ${request.method} ${request.path}`)
})

// 停止并导出
setTimeout(async () => {
  const session = recorder.stopRecording(sessionId)
  const content = recorder.exportSession(sessionId, 'js')
  await writeFile('mock/api.js', content)
  console.log('录制完成！')
}, 30000)
```

## 最佳实践

### 1. 定期录制更新

当后端 API 更新时，重新录制：

```bash
# 更新用户相关 API
npx lmock record http://api.example.com \
  --paths '/api/users/*' \
  -o mock/users.js
```

### 2. 分模块录制

按功能模块分别录制，便于管理：

```
mock/
├── auth.js        # 认证相关
├── users.js       # 用户管理
├── products.js    # 商品管理
└── orders.js      # 订单管理
```

### 3. 敏感信息处理

录制后检查并清理敏感信息：

```javascript
// mock/api.js
export default {
  'POST /api/login': {
    response: {
      token: '@uuid',  // 替换真实 token
      user: {
        id: '@uuid',
        email: 'demo@example.com',  // 替换真实邮箱
        // 移除敏感字段
      }
    }
  }
}
```

### 4. 版本控制

提交录制的 Mock 文件到版本控制：

```bash
git add mock/recorded.js
git commit -m "feat: 更新 API Mock 配置"
```

### 5. 文档化

添加注释说明录制信息：

```javascript
/**
 * API Mock 配置
 * 
 * 录制时间: 2024-01-15
 * 录制来源: http://api.example.com
 * API 版本: v1.2.0
 * 
 * 最后更新: 2024-01-15
 */
export default {
  // ...
}
```

## 注意事项

### ⚠️ 录制限制

1. **无法录制 HTTPS** - 目前只支持 HTTP，HTTPS 需要证书配置
2. **Cookie 和会话** - 录制时可能需要手动处理认证
3. **WebSocket** - 不支持录制 WebSocket 连接

### ⚠️ 安全建议

1. **不要在生产环境录制** - 只在开发/测试环境使用
2. **清理敏感数据** - 录制后检查并移除敏感信息
3. **限制录制范围** - 使用过滤器只录制需要的接口

### ⚠️ 性能考虑

1. **限制录制数量** - 使用 `-m` 参数避免录制过多
2. **过滤不必要的请求** - 排除静态资源、健康检查等
3. **定期清理** - 删除不再使用的录制文件

## 故障排除

### 问题：录制的文件为空

**原因**：可能没有匹配的请求

**解决**：
1. 检查过滤条件是否正确
2. 确认目标 API 可访问
3. 使用 `--debug` 查看详细日志

### 问题：录制的数据不完整

**原因**：响应体可能太大被截断

**解决**：
```bash
# 增加超时时间
npx lmock record http://api.example.com --timeout 60000
```

### 问题：无法录制需要认证的 API

**解决**：
```bash
# 方案1：在浏览器中操作（自动携带 Cookie）
# 方案2：使用 curl 带上认证头
curl -H "Authorization: Bearer TOKEN" http://api.example.com/api/users
```

## 相关链接

- [CLI 命令参考](/guide/cli-commands)
- [数据导入导出](/guide/import-export)
- [API 参考 - RequestRecorder](/api/request-recorder)
- [最佳实践 - 团队协作](/best-practices/team-collaboration)
