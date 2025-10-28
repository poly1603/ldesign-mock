# 配置参考

@ldesign/mock 提供了灵活的配置选项，让你可以根据项目需求定制 Mock 服务行为。

## 配置文件

配置文件支持多种格式：

- `mock.config.js` - JavaScript 格式（推荐）
- `mock.config.ts` - TypeScript 格式
- `mock.config.json` - JSON 格式
- `package.json` 中的 `mock` 字段

## 完整配置示例

```javascript path=null start=null
// mock.config.js
export default {
  // 服务器配置
  port: 3001,
  host: 'localhost',
  
  // 路由配置
  routes: './mock',
  
  // 全局配置
  delay: 0,
  cors: true,
  
  // 日志配置
  log: {
    level: 'info',
    format: 'pretty',
    timestamp: true
  },
  
  // 场景配置
  scenarios: {
    enabled: true,
    defaultScenario: 'default'
  },
  
  // 代理配置
  proxy: {
    '/api': 'http://localhost:8080'
  },
  
  // 中间件
  middlewares: [],
  
  // UI 配置
  ui: {
    enabled: true,
    path: '/__mock__'
  }
}
```

## 服务器配置

### port

- **类型**: `number`
- **默认值**: `3001`
- **说明**: Mock 服务器监听的端口号

```javascript path=null start=null
export default {
  port: 8080
}
```

### host

- **类型**: `string`
- **默认值**: `'localhost'`
- **说明**: Mock 服务器监听的主机地址

```javascript path=null start=null
export default {
  host: '0.0.0.0'  // 允许外部访问
}
```

### https

- **类型**: `boolean | object`
- **默认值**: `false`
- **说明**: 启用 HTTPS 支持

```javascript path=null start=null
// 自动生成证书
export default {
  https: true
}

// 使用自定义证书
export default {
  https: {
    key: './cert/key.pem',
    cert: './cert/cert.pem'
  }
}
```

### open

- **类型**: `boolean | string`
- **默认值**: `false`
- **说明**: 启动后自动打开浏览器

```javascript path=null start=null
export default {
  open: true,              // 打开默认页面
  open: '/api/users'       // 打开指定路径
}
```

## 路由配置

### routes

- **类型**: `string | object`
- **默认值**: `'./mock'`
- **说明**: Mock 路由配置文件或目录

```javascript path=null start=null
// 指定目录
export default {
  routes: './mock'
}

// 指定文件
export default {
  routes: './mock/index.js'
}

// 直接配置
export default {
  routes: {
    'GET /api/users': {
      response: { success: true, data: [] }
    }
  }
}
```

### baseURL

- **类型**: `string`
- **默认值**: `''`
- **说明**: 所有路由的基础路径

```javascript path=null start=null
export default {
  baseURL: '/api/v1',
  routes: {
    // 实际路径为 /api/v1/users
    'GET /users': { /* ... */ }
  }
}
```

### routePrefix

- **类型**: `string`
- **默认值**: `''`
- **说明**: 路由前缀（已废弃，请使用 `baseURL`）

## 全局配置

### delay

- **类型**: `number | [number, number]`
- **默认值**: `0`
- **说明**: 全局响应延迟（毫秒）

```javascript path=null start=null
// 固定延迟
export default {
  delay: 1000  // 1秒
}

// 随机延迟
export default {
  delay: [500, 2000]  // 500ms - 2000ms
}
```

### cors

- **类型**: `boolean | object`
- **默认值**: `true`
- **说明**: CORS 跨域配置

```javascript path=null start=null
// 启用默认 CORS
export default {
  cors: true
}

// 自定义 CORS
export default {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
}
```

### headers

- **类型**: `object`
- **默认值**: `{}`
- **说明**: 全局响应头

```javascript path=null start=null
export default {
  headers: {
    'X-Custom-Header': 'value',
    'X-Response-Time': '100ms'
  }
}
```

### watch

- **类型**: `boolean`
- **默认值**: `false`
- **说明**: 监听文件变化并自动重启

```javascript path=null start=null
export default {
  watch: true
}
```

### quiet

- **类型**: `boolean`
- **默认值**: `false`
- **说明**: 静默模式，不输出日志

```javascript path=null start=null
export default {
  quiet: true
}
```

## 日志配置

### log.level

- **类型**: `'debug' | 'info' | 'warn' | 'error' | 'silent'`
- **默认值**: `'info'`
- **说明**: 日志级别

```javascript path=null start=null
export default {
  log: {
    level: 'debug'  // 显示所有日志
  }
}
```

### log.format

- **类型**: `'pretty' | 'json' | 'compact'`
- **默认值**: `'pretty'`
- **说明**: 日志格式

```javascript path=null start=null
export default {
  log: {
    format: 'json'  // JSON 格式，便于解析
  }
}
```

### log.timestamp

- **类型**: `boolean`
- **默认值**: `true`
- **说明**: 是否显示时间戳

```javascript path=null start=null
export default {
  log: {
    timestamp: false
  }
}
```

### log.file

- **类型**: `string`
- **默认值**: `undefined`
- **说明**: 日志文件路径

```javascript path=null start=null
export default {
  log: {
    file: './logs/mock.log'
  }
}
```

## 场景配置

### scenarios.enabled

- **类型**: `boolean`
- **默认值**: `true`
- **说明**: 是否启用场景管理

```javascript path=null start=null
export default {
  scenarios: {
    enabled: true
  }
}
```

### scenarios.defaultScenario

- **类型**: `string`
- **默认值**: `'default'`
- **说明**: 默认场景名称

```javascript path=null start=null
export default {
  scenarios: {
    defaultScenario: 'success'
  }
}
```

### scenarios.paramName

- **类型**: `string`
- **默认值**: `'scenario'`
- **说明**: URL 参数名称

```javascript path=null start=null
export default {
  scenarios: {
    paramName: 'scene'  // 使用 ?scene=error
  }
}
```

### scenarios.headerName

- **类型**: `string`
- **默认值**: `'X-Mock-Scenario'`
- **说明**: 请求头名称

```javascript path=null start=null
export default {
  scenarios: {
    headerName: 'X-Scene'
  }
}
```

## 代理配置

### proxy

- **类型**: `object`
- **默认值**: `{}`
- **说明**: 反向代理配置

```javascript path=null start=null
// 基本代理
export default {
  proxy: {
    '/api': 'http://localhost:8080'
  }
}

// 详细配置
export default {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      }
    }
  }
}
```

### proxy.bypass

- **类型**: `function`
- **说明**: 代理跳过函数

```javascript path=null start=null
export default {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      bypass: (req, res, proxyOptions) => {
        // 跳过某些请求
        if (req.url.includes('/test')) {
          return '/mock/test'
        }
      }
    }
  }
}
```

## 中间件配置

### middlewares

- **类型**: `Array<Function>`
- **默认值**: `[]`
- **说明**: Express 中间件列表

```javascript path=null start=null
import bodyParser from 'body-parser'

export default {
  middlewares: [
    bodyParser.json(),
    (req, res, next) => {
      console.log('Custom middleware')
      next()
    }
  ]
}
```

### before

- **类型**: `function`
- **说明**: 在路由注册之前执行

```javascript path=null start=null
export default {
  before: (app) => {
    app.use((req, res, next) => {
      console.log('Before routes')
      next()
    })
  }
}
```

### after

- **类型**: `function`
- **说明**: 在路由注册之后执行

```javascript path=null start=null
export default {
  after: (app) => {
    app.use((req, res, next) => {
      console.log('After routes')
      next()
    })
  }
}
```

## UI 配置

### ui.enabled

- **类型**: `boolean`
- **默认值**: `true`
- **说明**: 是否启用管理界面

```javascript path=null start=null
export default {
  ui: {
    enabled: false  // 禁用管理界面
  }
}
```

### ui.path

- **类型**: `string`
- **默认值**: `'/__mock__'`
- **说明**: 管理界面路径

```javascript path=null start=null
export default {
  ui: {
    path: '/admin'
  }
}
```

### ui.title

- **类型**: `string`
- **默认值**: `'Mock Server'`
- **说明**: 管理界面标题

```javascript path=null start=null
export default {
  ui: {
    title: '我的 Mock 服务'
  }
}
```

### ui.theme

- **类型**: `'light' | 'dark' | 'auto'`
- **默认值**: `'auto'`
- **说明**: 界面主题

```javascript path=null start=null
export default {
  ui: {
    theme: 'dark'
  }
}
```

## 记录配置

### record.enabled

- **类型**: `boolean`
- **默认值**: `false`
- **说明**: 是否启用请求记录

```javascript path=null start=null
export default {
  record: {
    enabled: true
  }
}
```

### record.output

- **类型**: `string`
- **默认值**: `'./mock/recorded.js'`
- **说明**: 记录文件输出路径

```javascript path=null start=null
export default {
  record: {
    output: './recorded/api.js'
  }
}
```

### record.filter

- **类型**: `string | RegExp | function`
- **说明**: 过滤要记录的请求

```javascript path=null start=null
// 字符串匹配
export default {
  record: {
    filter: '/api/users'
  }
}

// 正则匹配
export default {
  record: {
    filter: /\/api\/(users|products)/
  }
}

// 函数过滤
export default {
  record: {
    filter: (req) => req.method === 'GET'
  }
}
```

### record.format

- **类型**: `'js' | 'json' | 'typescript'`
- **默认值**: `'js'`
- **说明**: 记录文件格式

```javascript path=null start=null
export default {
  record: {
    format: 'typescript'
  }
}
```

## 数据生成配置

### faker

- **类型**: `object`
- **说明**: Faker.js 配置

```javascript path=null start=null
export default {
  faker: {
    locale: 'zh_CN',  // 中文
    seed: 123         // 固定种子，确保数据一致
  }
}
```

### dataGenerator

- **类型**: `object`
- **说明**: 自定义数据生成器

```javascript path=null start=null
export default {
  dataGenerator: {
    // 自定义占位符
    placeholders: {
      '@customId': () => `ID_${Date.now()}`,
      '@customName': () => '自定义名称'
    }
  }
}
```

## 模板配置

### templates

- **类型**: `object`
- **说明**: 模板配置

```javascript path=null start=null
export default {
  templates: {
    // 自定义模板路径
    path: './templates',
    // 使用的模板
    use: ['ecommerce', 'user']
  }
}
```

## 高级配置

### onStart

- **类型**: `function`
- **说明**: 服务启动后的回调

```javascript path=null start=null
export default {
  onStart: ({ port, host }) => {
    console.log(`Mock server running at http://${host}:${port}`)
  }
}
```

### onRequest

- **类型**: `function`
- **说明**: 每个请求的回调

```javascript path=null start=null
export default {
  onRequest: (req, res) => {
    console.log(`${req.method} ${req.url}`)
  }
}
```

### onResponse

- **类型**: `function`
- **说明**: 每个响应的回调

```javascript path=null start=null
export default {
  onResponse: (req, res, data) => {
    console.log(`Response: ${JSON.stringify(data)}`)
  }
}
```

### transform

- **类型**: `function`
- **说明**: 响应数据转换

```javascript path=null start=null
export default {
  transform: (data, req) => {
    // 统一包装响应格式
    return {
      code: 0,
      data,
      message: 'success',
      timestamp: Date.now()
    }
  }
}
```

## 环境变量

支持通过环境变量覆盖配置：

```bash
# 端口
MOCK_PORT=8080

# 主机
MOCK_HOST=0.0.0.0

# 日志级别
MOCK_LOG_LEVEL=debug

# 场景
MOCK_SCENARIO=error
```

在配置文件中使用：

```javascript path=null start=null
export default {
  port: process.env.MOCK_PORT || 3001,
  log: {
    level: process.env.MOCK_LOG_LEVEL || 'info'
  }
}
```

## 多环境配置

### 开发环境

```javascript path=null start=null
// mock.config.dev.js
export default {
  port: 3001,
  watch: true,
  log: {
    level: 'debug'
  }
}
```

### 生产环境

```javascript path=null start=null
// mock.config.prod.js
export default {
  port: 80,
  watch: false,
  quiet: true,
  log: {
    level: 'error',
    file: './logs/mock.log'
  }
}
```

### 使用配置

```bash
# 开发环境
lmock start --config mock.config.dev.js

# 生产环境
lmock start --config mock.config.prod.js
```

## 配置合并

配置按以下优先级合并：

1. 命令行参数（最高优先级）
2. 环境变量
3. 配置文件
4. 默认配置（最低优先级）

```javascript path=null start=null
// 配置文件中的 port: 3001
// 环境变量 MOCK_PORT=8080
// 命令行参数 --port 9000
// 最终使用: 9000
```

## 配置验证

启动时会自动验证配置：

```bash
lmock validate --config
```

输出：

```
✓ 配置验证通过
  - port: 3001
  - host: localhost
  - routes: ./mock
  - watch: true
```

## 配置示例

### 最小配置

```javascript path=null start=null
export default {
  port: 3001,
  routes: './mock'
}
```

### 完整配置

```javascript path=null start=null
export default {
  // 服务器
  port: 3001,
  host: 'localhost',
  https: false,
  open: true,
  
  // 路由
  routes: './mock',
  baseURL: '/api',
  
  // 全局
  delay: [100, 500],
  cors: true,
  watch: true,
  
  // 日志
  log: {
    level: 'info',
    format: 'pretty',
    timestamp: true,
    file: './logs/mock.log'
  },
  
  // 场景
  scenarios: {
    enabled: true,
    defaultScenario: 'default',
    paramName: 'scenario',
    headerName: 'X-Mock-Scenario'
  },
  
  // 代理
  proxy: {
    '/external': 'http://api.example.com'
  },
  
  // UI
  ui: {
    enabled: true,
    path: '/__mock__',
    title: 'Mock Server',
    theme: 'auto'
  },
  
  // 记录
  record: {
    enabled: false,
    output: './mock/recorded.js',
    format: 'js'
  },
  
  // 数据生成
  faker: {
    locale: 'zh_CN',
    seed: 123
  },
  
  // 钩子
  onStart: ({ port, host }) => {
    console.log(`Server started at http://${host}:${port}`)
  }
}
```

## 相关链接

- [快速开始](/guide/getting-started)
- [CLI 命令](/guide/cli)
- [路由配置](/api/routes)
- [类型定义](/api/types)
