# 最佳实践

本指南提供使用 @ldesign/mock 的最佳实践和建议，帮助你构建高质量、易维护的 Mock 服务。

## 项目组织

### 目录结构

推荐的项目结构：

```
project/
├── mock/
│   ├── data/              # 模拟数据
│   │   ├── users.js
│   │   └── products.js
│   ├── routes/            # 路由配置
│   │   ├── user.js
│   │   ├── product.js
│   │   └── order.js
│   ├── scenarios/         # 场景配置
│   │   ├── success.js
│   │   ├── error.js
│   │   └── loading.js
│   ├── utils/             # 工具函数
│   │   ├── response.js
│   │   └── validate.js
│   └── index.js           # 主入口
├── mock.config.js         # Mock 配置
└── package.json
```

### 模块化配置

将配置拆分为多个模块：

```javascript path=null start=null
// mock/routes/user.js
export default {
  'GET /api/users': { /* ... */ },
  'POST /api/users': { /* ... */ }
}

// mock/routes/product.js
export default {
  'GET /api/products': { /* ... */ },
  'POST /api/products': { /* ... */ }
}

// mock/index.js
import user from './routes/user.js'
import product from './routes/product.js'

export default {
  ...user,
  ...product
}
```

## 数据管理

### 使用独立的数据文件

```javascript path=null start=null
// mock/data/users.js
export const users = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' }
]

// mock/routes/user.js
import { users } from '../data/users.js'

export default {
  'GET /api/users': {
    response: { success: true, data: users }
  }
}
```

### 数据持久化

在会话期间保持数据状态：

```javascript path=null start=null
// mock/data/store.js
class DataStore {
  constructor() {
    this.users = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' }
    ]
  }
  
  getUsers() {
    return this.users
  }
  
  addUser(user) {
    user.id = this.users.length + 1
    this.users.push(user)
    return user
  }
  
  deleteUser(id) {
    this.users = this.users.filter(u => u.id !== id)
  }
  
  reset() {
    this.users = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' }
    ]
  }
}

export const store = new DataStore()

// mock/routes/user.js
import { store } from '../data/store.js'

export default {
  'GET /api/users': (req, res) => {
    res.json({ success: true, data: store.getUsers() })
  },
  
  'POST /api/users': (req, res) => {
    const user = store.addUser(req.body)
    res.status(201).json({ success: true, data: user })
  },
  
  'DELETE /api/users/:id': (req, res) => {
    store.deleteUser(parseInt(req.params.id))
    res.json({ success: true })
  },
  
  // 重置数据
  'POST /api/__reset__': (req, res) => {
    store.reset()
    res.json({ success: true })
  }
}
```

## 响应格式

### 统一响应格式

创建统一的响应工具函数：

```javascript path=null start=null
// mock/utils/response.js
export const success = (data, message = 'success') => ({
  code: 0,
  success: true,
  data,
  message,
  timestamp: Date.now()
})

export const error = (message, code = -1) => ({
  code,
  success: false,
  message,
  timestamp: Date.now()
})

export const paginated = (data, page, pageSize, total) => ({
  code: 0,
  success: true,
  data,
  pagination: {
    page: parseInt(page),
    pageSize: parseInt(pageSize),
    total,
    totalPages: Math.ceil(total / pageSize)
  },
  timestamp: Date.now()
})

// mock/routes/user.js
import { success, error, paginated } from '../utils/response.js'

export default {
  'GET /api/users': (req, res) => {
    const { page = 1, pageSize = 10 } = req.query
    // ... 获取数据
    res.json(paginated(data, page, pageSize, total))
  },
  
  'GET /api/users/:id': (req, res) => {
    const user = findUser(req.params.id)
    if (!user) {
      return res.status(404).json(error('用户不存在', 404))
    }
    res.json(success(user))
  }
}
```

## 场景管理

### 场景分离

为不同场景创建独立配置：

```javascript path=null start=null
// mock/scenarios/success.js
export default {
  'GET /api/users': {
    response: { success: true, data: [...] }
  }
}

// mock/scenarios/error.js
export default {
  'GET /api/users': {
    status: 500,
    response: { success: false, message: '服务器错误' }
  }
}

// mock/scenarios/empty.js
export default {
  'GET /api/users': {
    response: { success: true, data: [] }
  }
}

// mock/index.js
import success from './scenarios/success.js'
import error from './scenarios/error.js'
import empty from './scenarios/empty.js'

export default {
  scenarios: {
    success,
    error,
    empty
  },
  defaultScenario: 'success'
}
```

### 场景组合

创建可复用的场景片段：

```javascript path=null start=null
// mock/scenarios/common.js
export const commonErrors = {
  unauthorized: {
    status: 401,
    response: { success: false, message: '未登录' }
  },
  forbidden: {
    status: 403,
    response: { success: false, message: '权限不足' }
  },
  notFound: {
    status: 404,
    response: { success: false, message: '未找到' }
  }
}

// mock/scenarios/user-errors.js
import { commonErrors } from './common.js'

export default {
  'GET /api/users/:id': commonErrors.notFound,
  'POST /api/users': commonErrors.forbidden
}
```

## 验证和错误处理

### 请求验证

```javascript path=null start=null
// mock/utils/validate.js
export const validateRequired = (fields) => (req, res, next) => {
  const missing = fields.filter(field => !req.body[field])
  
  if (missing.length > 0) {
    return res.status(400).json({
      success: false,
      message: `缺少必填字段: ${missing.join(', ')}`
    })
  }
  
  next()
}

export const validateEmail = (req, res, next) => {
  const { email } = req.body
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (email && !emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: '邮箱格式不正确'
    })
  }
  
  next()
}

// mock/routes/user.js
import { validateRequired, validateEmail } from '../utils/validate.js'

export default {
  'POST /api/users': [
    validateRequired(['name', 'email']),
    validateEmail,
    (req, res) => {
      // 处理请求
      res.status(201).json({
        success: true,
        data: { id: '@uuid', ...req.body }
      })
    }
  ]
}
```

### 统一错误处理

```javascript path=null start=null
// mock/utils/errorHandler.js
export const errorHandler = (handler) => async (req, res) => {
  try {
    await handler(req, res)
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({
      success: false,
      message: error.message || '服务器内部错误',
      ...(process.env.NODE_ENV === 'development' && {
        stack: error.stack
      })
    })
  }
}

// mock/routes/user.js
import { errorHandler } from '../utils/errorHandler.js'

export default {
  'GET /api/users/:id': errorHandler(async (req, res) => {
    // 可能抛出错误的代码
    const user = await getUser(req.params.id)
    res.json({ success: true, data: user })
  })
}
```

## 性能优化

### 懒加载数据

```javascript path=null start=null
// mock/data/generator.js
let cachedUsers = null

export function generateUsers(count = 100) {
  if (cachedUsers && cachedUsers.length === count) {
    return cachedUsers
  }
  
  cachedUsers = Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`
  }))
  
  return cachedUsers
}

// mock/routes/user.js
import { generateUsers } from '../data/generator.js'

export default {
  'GET /api/users': (req, res) => {
    const users = generateUsers() // 只在首次调用时生成
    res.json({ success: true, data: users })
  }
}
```

### 分页优化

```javascript path=null start=null
export default {
  'GET /api/users': (req, res) => {
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.pageSize) || 10
    
    // 只生成当前页需要的数据
    const start = (page - 1) * pageSize
    const data = Array.from({ length: pageSize }, (_, i) => ({
      id: start + i + 1,
      name: `User ${start + i + 1}`
    }))
    
    res.json({
      success: true,
      data,
      pagination: { page, pageSize, total: 1000 }
    })
  }
}
```

## 测试集成

### 与单元测试集成

```javascript path=null start=null
// tests/setup.js
import { createMockServer } from '@ldesign/mock'
import mockConfig from '../mock/index.js'

let server

export async function startMockServer() {
  server = await createMockServer(mockConfig)
  await server.listen(3001)
}

export async function stopMockServer() {
  await server.close()
}

// tests/user.test.js
import { beforeAll, afterAll, test, expect } from 'vitest'
import { startMockServer, stopMockServer } from './setup.js'

beforeAll(async () => {
  await startMockServer()
})

afterAll(async () => {
  await stopMockServer()
})

test('fetch users', async () => {
  const response = await fetch('http://localhost:3001/api/users')
  const data = await response.json()
  
  expect(data.success).toBe(true)
  expect(Array.isArray(data.data)).toBe(true)
})
```

### E2E 测试场景切换

```javascript path=null start=null
// e2e/support/mock.js
export async function setMockScenario(scenario) {
  await fetch('http://localhost:3001/__mock__/scenario', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scenario })
  })
}

// e2e/user.spec.js
import { test, expect } from '@playwright/test'
import { setMockScenario } from './support/mock.js'

test('handles successful user fetch', async ({ page }) => {
  await setMockScenario('success')
  await page.goto('/users')
  await expect(page.locator('.user-list')).toBeVisible()
})

test('handles error state', async ({ page }) => {
  await setMockScenario('error')
  await page.goto('/users')
  await expect(page.locator('.error-message')).toBeVisible()
})
```

## 文档化

### 添加注释

```javascript path=null start=null
export default {
  /**
   * 获取用户列表
   * 
   * Query 参数:
   * - page: 页码 (默认: 1)
   * - pageSize: 每页数量 (默认: 10)
   * - keyword: 搜索关键词
   * 
   * 返回:
   * - success: boolean
   * - data: User[]
   * - pagination: PaginationInfo
   */
  'GET /api/users': (req, res) => {
    // 实现...
  },
  
  /**
   * 创建用户
   * 
   * Body:
   * - name: string (必填)
   * - email: string (必填)
   * - age: number (可选)
   * 
   * 返回:
   * - 201: 创建成功
   * - 400: 参数错误
   */
  'POST /api/users': (req, res) => {
    // 实现...
  }
}
```

### 使用 JSDoc

```javascript path=null start=null
/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} name
 * @property {string} email
 */

/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success
 * @property {any} data
 * @property {string} message
 */

/**
 * 获取用户信息
 * @param {Object} req - Express 请求对象
 * @param {Object} res - Express 响应对象
 * @returns {ApiResponse<User>}
 */
export function getUser(req, res) {
  // 实现...
}
```

## 安全性

### 避免暴露敏感信息

```javascript path=null start=null
// ❌ 不好的做法
export default {
  'POST /api/login': {
    response: {
      success: true,
      data: {
        token: 'real-jwt-token-12345',
        password: 'user-password'  // 永远不要返回密码
      }
    }
  }
}

// ✅ 好的做法
export default {
  'POST /api/login': {
    response: {
      success: true,
      data: {
        token: '@uuid',  // 使用随机生成的 token
        user: {
          id: 1,
          name: 'User',
          email: 'user@example.com'
          // 不包含密码
        }
      }
    }
  }
}
```

### 限制 Mock 环境

```javascript path=null start=null
// mock.config.js
export default {
  // 只在开发环境启用
  enabled: process.env.NODE_ENV === 'development',
  
  // 禁止外部访问
  host: 'localhost',
  
  // 禁用 UI（生产环境）
  ui: {
    enabled: process.env.NODE_ENV === 'development'
  }
}
```

## 版本控制

### Git 配置

```bash
# .gitignore
# 忽略录制的临时文件
mock/recorded/
mock/*.recorded.js

# 保留配置文件
!mock/index.js
!mock/routes/
!mock/scenarios/
```

### 提交规范

```bash
# 好的提交消息
git commit -m "feat(mock): add user CRUD endpoints"
git commit -m "fix(mock): correct order status response"
git commit -m "refactor(mock): extract common response helpers"

# 不好的提交消息
git commit -m "update mock"
git commit -m "fix"
```

## 团队协作

### 共享配置

```javascript path=null start=null
// mock/shared/config.js
export const API_BASE_URL = '/api'
export const DEFAULT_PAGE_SIZE = 10
export const RESPONSE_DELAY = 300

// mock/routes/user.js
import { API_BASE_URL, RESPONSE_DELAY } from '../shared/config.js'

export default {
  [`GET ${API_BASE_URL}/users`]: {
    delay: RESPONSE_DELAY,
    response: { /* ... */ }
  }
}
```

### 代码审查清单

- [ ] 路由命名是否清晰
- [ ] 是否使用了统一的响应格式
- [ ] 错误处理是否完善
- [ ] 是否添加了必要的注释
- [ ] 场景配置是否合理
- [ ] 是否有重复代码可以提取
- [ ] 数据生成是否高效

## 调试技巧

### 启用详细日志

```javascript path=null start=null
// mock.config.js
export default {
  log: {
    level: 'debug',
    format: 'pretty',
    timestamp: true
  },
  
  // 记录所有请求
  onRequest: (req, res) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
    console.log('Query:', req.query)
    console.log('Body:', req.body)
  },
  
  // 记录所有响应
  onResponse: (req, res, data) => {
    console.log(`[${new Date().toISOString()}] Response:`, data)
  }
}
```

### 使用调试端点

```javascript path=null start=null
export default {
  // 查看当前配置
  'GET /api/__debug__/config': (req, res) => {
    res.json({
      scenarios: Object.keys(scenarios),
      currentScenario: currentScenario,
      routes: Object.keys(routes)
    })
  },
  
  // 查看数据状态
  'GET /api/__debug__/data': (req, res) => {
    res.json({
      users: store.users.length,
      products: store.products.length
    })
  }
}
```

## 常见陷阱

### 1. 忘记返回响应

```javascript path=null start=null
// ❌ 错误：没有发送响应
export default {
  'GET /api/users/:id': (req, res) => {
    const user = findUser(req.params.id)
    if (!user) {
      res.status(404)  // 忘记调用 .json() 或 .send()
    }
    // 代码继续执行...
  }
}

// ✅ 正确：使用 return 或确保只有一个响应
export default {
  'GET /api/users/:id': (req, res) => {
    const user = findUser(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'Not found' })
    }
    res.json({ success: true, data: user })
  }
}
```

### 2. 异步操作未等待

```javascript path=null start=null
// ❌ 错误：没有等待异步操作
export default {
  'GET /api/users': (req, res) => {
    fetchUsers().then(users => {
      res.json({ data: users })
    })
    // 可能在响应发送前就继续执行了
  }
}

// ✅ 正确：使用 async/await
export default {
  'GET /api/users': async (req, res) => {
    const users = await fetchUsers()
    res.json({ data: users })
  }
}
```

### 3. 数据污染

```javascript path=null start=null
// ❌ 错误：直接修改共享数据
const users = [{ id: 1, name: 'Alice' }]

export default {
  'POST /api/users': (req, res) => {
    users.push(req.body)  // 污染共享数据
  }
}

// ✅ 正确：使用独立的数据存储
import { store } from './data/store.js'

export default {
  'POST /api/users': (req, res) => {
    const user = store.addUser(req.body)
    res.json({ data: user })
  }
}
```

## 相关链接

- [快速开始](/guide/getting-started)
- [配置参考](/api/config)
- [路由配置](/api/routes)
- [场景管理](/guide/scenario-management)
