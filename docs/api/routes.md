# 路由配置

路由是 @ldesign/mock 的核心，定义了如何响应不同的 HTTP 请求。

## 基本语法

路由格式为：`METHOD /path`

```javascript path=null start=null
export default {
  'GET /api/users': {
    response: { success: true, data: [] }
  }
}
```

## HTTP 方法

支持所有标准 HTTP 方法：

```javascript path=null start=null
export default {
  'GET /api/users': { /* 获取列表 */ },
  'POST /api/users': { /* 创建 */ },
  'PUT /api/users/:id': { /* 更新 */ },
  'PATCH /api/users/:id': { /* 部分更新 */ },
  'DELETE /api/users/:id': { /* 删除 */ },
  'HEAD /api/users': { /* HEAD 请求 */ },
  'OPTIONS /api/users': { /* OPTIONS 请求 */ }
}
```

## 路径参数

### 动态参数

使用 `:param` 定义动态参数：

```javascript path=null start=null
export default {
  'GET /api/users/:id': (req, res) => {
    res.json({
      success: true,
      data: { id: req.params.id }
    })
  }
}
```

### 多个参数

```javascript path=null start=null
export default {
  'GET /api/posts/:postId/comments/:commentId': (req, res) => {
    const { postId, commentId } = req.params
    res.json({ postId, commentId })
  }
}
```

### 可选参数

```javascript path=null start=null
export default {
  'GET /api/users/:id?': (req, res) => {
    if (req.params.id) {
      // 返回单个用户
    } else {
      // 返回用户列表
    }
  }
}
```

## 通配符

### 星号通配符

```javascript path=null start=null
export default {
  // 匹配 /api/users 下的所有路径
  'GET /api/users/*': {
    response: { success: true }
  }
}
```

### 正则表达式

```javascript path=null start=null
export default {
  // 匹配数字 ID
  'GET /api/users/:id(\\d+)': (req, res) => {
    res.json({ id: parseInt(req.params.id) })
  }
}
```

## 响应配置

### response

- **类型**: `any`
- **说明**: 响应数据

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

### status

- **类型**: `number`
- **默认值**: `200`
- **说明**: HTTP 状态码

```javascript path=null start=null
export default {
  'POST /api/users': {
    status: 201,
    response: { success: true }
  },
  
  'GET /api/not-found': {
    status: 404,
    response: { message: '未找到' }
  }
}
```

### headers

- **类型**: `object`
- **说明**: 响应头

```javascript path=null start=null
export default {
  'GET /api/users': {
    headers: {
      'X-Total-Count': '100',
      'X-Custom-Header': 'value'
    },
    response: { data: [] }
  }
}
```

### delay

- **类型**: `number | [number, number]`
- **说明**: 响应延迟（毫秒）

```javascript path=null start=null
export default {
  // 固定延迟
  'GET /api/slow': {
    delay: 2000,
    response: { data: 'slow response' }
  },
  
  // 随机延迟
  'GET /api/random': {
    delay: [500, 2000],
    response: { data: 'random delay' }
  }
}
```

### cookies

- **类型**: `object`
- **说明**: 设置 Cookie

```javascript path=null start=null
export default {
  'POST /api/login': {
    cookies: {
      token: 'abc123',
      userId: '1'
    },
    response: { success: true }
  }
}
```

## 函数响应

使用函数提供动态响应：

```javascript path=null start=null
export default {
  'GET /api/users/:id': (req, res) => {
    const { id } = req.params
    
    res.json({
      success: true,
      data: {
        id,
        name: `User ${id}`,
        email: `user${id}@example.com`
      }
    })
  }
}
```

### 请求对象 (req)

```javascript path=null start=null
export default {
  'POST /api/users': (req, res) => {
    // 路径参数
    console.log(req.params)
    
    // 查询参数
    console.log(req.query)
    
    // 请求体
    console.log(req.body)
    
    // 请求头
    console.log(req.headers)
    
    // Cookie
    console.log(req.cookies)
    
    res.json({ success: true })
  }
}
```

### 响应对象 (res)

```javascript path=null start=null
export default {
  'GET /api/users': (req, res) => {
    // JSON 响应
    res.json({ data: [] })
    
    // 设置状态码
    res.status(201).json({ success: true })
    
    // 设置响应头
    res.set('X-Total-Count', '100')
    res.header('X-Custom', 'value')
    
    // 设置 Cookie
    res.cookie('token', 'abc123')
    
    // 发送文本
    res.send('Hello')
    
    // 结束响应
    res.end()
  }
}
```

## 数据生成

使用占位符生成动态数据：

```javascript path=null start=null
export default {
  'GET /api/users': {
    response: {
      success: true,
      data: [
        {
          id: '@uuid',
          name: '@name',
          email: '@email',
          avatar: '@avatar',
          createdAt: '@datetime'
        }
      ]
    }
  }
}
```

支持的占位符：

- `@uuid` - UUID
- `@id` - 数字 ID
- `@name` - 姓名
- `@email` - 邮箱
- `@phone` - 手机号
- `@avatar` - 头像 URL
- `@url` - URL
- `@ip` - IP 地址
- `@datetime` - 日期时间
- `@date` - 日期
- `@time` - 时间
- `@title` - 标题
- `@paragraph` - 段落
- `@sentence` - 句子
- `@word` - 单词
- `@boolean` - 布尔值
- `@integer` - 整数
- `@float` - 浮点数
- `@price` - 价格
- `@color` - 颜色
- `@image` - 图片 URL
- `@address` - 地址
- `@city` - 城市
- `@country` - 国家

## 数组生成

使用 `@repeat` 生成数组：

```javascript path=null start=null
export default {
  'GET /api/users': {
    response: {
      success: true,
      data: '@repeat(10)' + JSON.stringify({
        id: '@uuid',
        name: '@name',
        email: '@email'
      })
    }
  }
}
```

或使用函数：

```javascript path=null start=null
export default {
  'GET /api/users': (req, res) => {
    const users = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`
    }))
    
    res.json({ success: true, data: users })
  }
}
```

## 分页支持

```javascript path=null start=null
export default {
  'GET /api/users': (req, res) => {
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.pageSize) || 10
    
    const total = 100
    const data = Array.from({ length: pageSize }, (_, i) => ({
      id: (page - 1) * pageSize + i + 1,
      name: `User ${(page - 1) * pageSize + i + 1}`
    }))
    
    res.json({
      success: true,
      data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    })
  }
}
```

## 条件响应

根据请求返回不同响应：

```javascript path=null start=null
export default {
  'GET /api/users/:id': (req, res) => {
    const { id } = req.params
    
    // 特殊 ID 返回 404
    if (id === '999') {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      })
    }
    
    res.json({
      success: true,
      data: { id, name: `User ${id}` }
    })
  }
}
```

## 文件上传

处理文件上传请求：

```javascript path=null start=null
export default {
  'POST /api/upload': (req, res) => {
    // 模拟文件上传
    const file = req.body.file || req.files?.file
    
    res.json({
      success: true,
      data: {
        filename: file?.name || 'uploaded.jpg',
        size: file?.size || 1024,
        url: '@image'
      }
    })
  }
}
```

## 路由分组

### 按功能分组

```javascript path=null start=null
// mock/routes/users.js
export default {
  'GET /api/users': { /* ... */ },
  'GET /api/users/:id': { /* ... */ },
  'POST /api/users': { /* ... */ }
}

// mock/routes/products.js
export default {
  'GET /api/products': { /* ... */ },
  'GET /api/products/:id': { /* ... */ }
}

// mock/index.js
import users from './routes/users.js'
import products from './routes/products.js'

export default {
  ...users,
  ...products
}
```

### 使用对象分组

```javascript path=null start=null
export default {
  // 用户相关
  users: {
    'GET /api/users': { /* ... */ },
    'POST /api/users': { /* ... */ }
  },
  
  // 商品相关
  products: {
    'GET /api/products': { /* ... */ },
    'POST /api/products': { /* ... */ }
  }
}
```

## RESTful API

快速创建 RESTful 路由：

```javascript path=null start=null
// 使用 CLI 生成
// lmock generate rest user

export default {
  'GET /api/users': {
    response: {
      success: true,
      data: [
        { id: 1, name: 'User 1' },
        { id: 2, name: 'User 2' }
      ]
    }
  },
  
  'GET /api/users/:id': (req, res) => {
    res.json({
      success: true,
      data: { id: req.params.id, name: `User ${req.params.id}` }
    })
  },
  
  'POST /api/users': (req, res) => {
    res.status(201).json({
      success: true,
      data: { id: '@uuid', ...req.body }
    })
  },
  
  'PUT /api/users/:id': (req, res) => {
    res.json({
      success: true,
      data: { id: req.params.id, ...req.body }
    })
  },
  
  'DELETE /api/users/:id': (req, res) => {
    res.json({
      success: true,
      message: '删除成功'
    })
  }
}
```

## 中间件

### 路由级中间件

```javascript path=null start=null
export default {
  'POST /api/users': [
    // 验证中间件
    (req, res, next) => {
      if (!req.body.name) {
        return res.status(400).json({
          success: false,
          message: '缺少 name 参数'
        })
      }
      next()
    },
    
    // 主处理函数
    (req, res) => {
      res.json({
        success: true,
        data: { id: '@uuid', ...req.body }
      })
    }
  ]
}
```

## 错误处理

```javascript path=null start=null
export default {
  'GET /api/users/:id': (req, res) => {
    try {
      const { id } = req.params
      
      // 验证 ID
      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: '无效的 ID'
        })
      }
      
      // 业务逻辑
      res.json({
        success: true,
        data: { id, name: `User ${id}` }
      })
      
    } catch (error) {
      res.status(500).json({
        success: false,
        message: '服务器错误',
        error: error.message
      })
    }
  }
}
```

## 跨域配置

### 全局 CORS

在 `mock.config.js` 中配置：

```javascript path=null start=null
export default {
  cors: true  // 允许所有来源
}
```

### 自定义 CORS

```javascript path=null start=null
export default {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
}
```

### 路由级 CORS

```javascript path=null start=null
export default {
  'GET /api/users': (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')
    res.json({ data: [] })
  }
}
```

## WebSocket 支持

```javascript path=null start=null
export default {
  'WS /api/notifications': (ws, req) => {
    ws.on('message', (msg) => {
      console.log('Received:', msg)
      ws.send(JSON.stringify({ type: 'ack', data: msg }))
    })
    
    // 定时推送
    const interval = setInterval(() => {
      ws.send(JSON.stringify({
        type: 'notification',
        data: { message: 'New notification' }
      }))
    }, 5000)
    
    ws.on('close', () => {
      clearInterval(interval)
    })
  }
}
```

## 代理转发

某些路由转发到真实服务器：

```javascript path=null start=null
// mock.config.js
export default {
  proxy: {
    '/api/external': 'http://api.example.com'
  }
}
```

## 最佳实践

### 1. 使用常量定义路由

```javascript path=null start=null
const ROUTES = {
  USERS_LIST: 'GET /api/users',
  USERS_DETAIL: 'GET /api/users/:id',
  USERS_CREATE: 'POST /api/users'
}

export default {
  [ROUTES.USERS_LIST]: { /* ... */ },
  [ROUTES.USERS_DETAIL]: { /* ... */ },
  [ROUTES.USERS_CREATE]: { /* ... */ }
}
```

### 2. 提取公共响应

```javascript path=null start=null
const successResponse = (data) => ({
  success: true,
  data,
  timestamp: Date.now()
})

const errorResponse = (message) => ({
  success: false,
  message,
  timestamp: Date.now()
})

export default {
  'GET /api/users': {
    response: successResponse([])
  },
  
  'GET /api/error': {
    status: 500,
    response: errorResponse('服务器错误')
  }
}
```

### 3. 数据持久化

```javascript path=null start=null
// mock/data/users.js
let users = [
  { id: 1, name: 'User 1' },
  { id: 2, name: 'User 2' }
]

export default {
  'GET /api/users': (req, res) => {
    res.json({ success: true, data: users })
  },
  
  'POST /api/users': (req, res) => {
    const newUser = {
      id: users.length + 1,
      ...req.body
    }
    users.push(newUser)
    res.status(201).json({ success: true, data: newUser })
  },
  
  'DELETE /api/users/:id': (req, res) => {
    users = users.filter(u => u.id !== parseInt(req.params.id))
    res.json({ success: true })
  }
}
```

### 4. 类型安全（TypeScript）

```typescript path=null start=null
import type { Request, Response } from 'express'

interface User {
  id: number
  name: string
  email: string
}

export default {
  'GET /api/users': (req: Request, res: Response) => {
    const users: User[] = [
      { id: 1, name: 'User 1', email: 'user1@example.com' }
    ]
    res.json({ success: true, data: users })
  }
}
```

## 示例集合

### 完整的 CRUD 示例

```javascript path=null start=null
let users = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' }
]

export default {
  // 列表（带分页和搜索）
  'GET /api/users': (req, res) => {
    const { page = 1, pageSize = 10, keyword } = req.query
    
    let filtered = users
    if (keyword) {
      filtered = users.filter(u => 
        u.name.includes(keyword) || u.email.includes(keyword)
      )
    }
    
    const start = (page - 1) * pageSize
    const data = filtered.slice(start, start + pageSize)
    
    res.json({
      success: true,
      data,
      pagination: {
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        total: filtered.length
      }
    })
  },
  
  // 详情
  'GET /api/users/:id': (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id))
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      })
    }
    
    res.json({ success: true, data: user })
  },
  
  // 创建
  'POST /api/users': (req, res) => {
    const newUser = {
      id: users.length + 1,
      ...req.body,
      createdAt: new Date().toISOString()
    }
    
    users.push(newUser)
    
    res.status(201).json({
      success: true,
      data: newUser
    })
  },
  
  // 更新
  'PUT /api/users/:id': (req, res) => {
    const index = users.findIndex(u => u.id === parseInt(req.params.id))
    
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      })
    }
    
    users[index] = {
      ...users[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    }
    
    res.json({ success: true, data: users[index] })
  },
  
  // 删除
  'DELETE /api/users/:id': (req, res) => {
    const index = users.findIndex(u => u.id === parseInt(req.params.id))
    
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      })
    }
    
    users.splice(index, 1)
    
    res.json({
      success: true,
      message: '删除成功'
    })
  }
}
```

## 相关链接

- [配置参考](/api/config)
- [数据生成器](/guide/data-generator)
- [场景管理](/guide/scenario-management)
- [类型定义](/api/types)
