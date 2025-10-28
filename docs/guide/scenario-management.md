# 场景管理 <Badge type="tip" text="高级功能" />

场景管理是 @ldesign/mock 的强大功能之一，允许你为不同的测试场景准备不同的 Mock 数据，轻松在多种业务状态之间切换。

## 为什么需要场景管理？

在实际开发和测试中，我们经常需要模拟不同的业务状态：

- ✅ **成功场景** - 正常的业务流程
- ❌ **失败场景** - 错误处理和异常情况
- ⏳ **加载场景** - 慢速网络或长时间处理
- 📝 **空数据场景** - 初始状态或无数据情况
- 🔒 **权限场景** - 未授权或权限不足

传统做法是频繁修改 Mock 代码，而场景管理让你提前定义所有场景，随时切换。

## 基本概念

### 场景 (Scenario)

场景是一组 Mock 配置的集合，代表特定的业务状态。

```javascript path=null start=null
export const scenarios = {
  // 成功场景
  success: {
    'GET /api/user': {
      response: { success: true, data: { name: '张三' } }
    }
  },
  
  // 失败场景
  error: {
    'GET /api/user': {
      status: 500,
      response: { success: false, message: '服务器错误' }
    }
  }
}
```

### 场景切换

通过 URL 参数或配置切换当前激活的场景。

```javascript path=null start=null
// 访问不同场景
http://localhost:3001/api/user?scenario=success
http://localhost:3001/api/user?scenario=error
```

## 快速开始

### 1. 定义场景

```javascript path=null start=null
// mock/scenarios.js
export default {
  // 默认场景
  default: {
    'GET /api/products': {
      response: {
        success: true,
        data: [
          { id: 1, name: 'iPhone', price: 7999 },
          { id: 2, name: 'iPad', price: 4999 }
        ]
      }
    }
  },
  
  // 空数据场景
  empty: {
    'GET /api/products': {
      response: {
        success: true,
        data: []
      }
    }
  },
  
  // 错误场景
  error: {
    'GET /api/products': {
      status: 500,
      response: {
        success: false,
        message: '服务器内部错误'
      }
    }
  },
  
  // 慢速场景
  slow: {
    'GET /api/products': {
      delay: 3000,
      response: {
        success: true,
        data: [
          { id: 1, name: 'iPhone', price: 7999 }
        ]
      }
    }
  }
}
```

### 2. 注册场景

```javascript path=null start=null
// mock/index.js
import scenarios from './scenarios.js'

export default {
  // 启用场景管理
  scenarios,
  
  // 默认场景
  defaultScenario: 'default'
}
```

### 3. 使用场景

#### 方式一：URL 参数

```bash
# 默认场景
curl http://localhost:3001/api/products

# 空数据场景
curl http://localhost:3001/api/products?scenario=empty

# 错误场景
curl http://localhost:3001/api/products?scenario=error
```

#### 方式二：请求头

```bash
curl http://localhost:3001/api/products \
  -H "X-Mock-Scenario: error"
```

#### 方式三：全局切换

```javascript path=null start=null
// mock.config.js
export default {
  currentScenario: 'error'  // 全局切换到错误场景
}
```

## 场景结构

### 基本场景

最简单的场景定义：

```javascript path=null start=null
export default {
  success: {
    'GET /api/user': {
      response: { success: true, data: {} }
    }
  }
}
```

### 完整场景

包含元数据的场景：

```javascript path=null start=null
export default {
  success: {
    meta: {
      name: '成功场景',
      description: '所有请求都返回成功',
      tags: ['success', 'happy-path']
    },
    routes: {
      'GET /api/user': {
        response: { success: true, data: {} }
      }
    }
  }
}
```

### 继承场景

场景可以继承其他场景：

```javascript path=null start=null
export default {
  base: {
    'GET /api/user': {
      response: { success: true, data: { id: 1 } }
    }
  },
  
  extended: {
    extends: 'base',  // 继承 base 场景
    'GET /api/products': {
      response: { success: true, data: [] }
    }
  }
}
```

## 高级用法

### 条件场景

根据请求动态决定使用哪个场景：

```javascript path=null start=null
export default {
  scenarios: {
    success: { /* ... */ },
    error: { /* ... */ }
  },
  
  // 场景选择器
  scenarioSelector: (req) => {
    // 根据用户 ID 选择场景
    if (req.query.userId === '999') {
      return 'error'
    }
    return 'success'
  }
}
```

### 场景组合

组合多个场景：

```javascript path=null start=null
import userScenarios from './scenarios/user.js'
import productScenarios from './scenarios/product.js'

export default {
  scenarios: {
    // 组合场景
    fullSuccess: {
      ...userScenarios.success,
      ...productScenarios.success
    },
    
    fullError: {
      ...userScenarios.error,
      ...productScenarios.error
    }
  }
}
```

### 动态场景

场景数据可以是函数：

```javascript path=null start=null
export default {
  dynamic: {
    'GET /api/time': (req, res) => {
      res.json({
        success: true,
        data: {
          timestamp: Date.now(),
          scenario: req.query.scenario
        }
      })
    }
  }
}
```

### 场景变量

在场景中使用变量：

```javascript path=null start=null
export default {
  scenarios: {
    customUser: {
      variables: {
        userName: '李四',
        userId: 100
      },
      routes: {
        'GET /api/user': {
          response: {
            success: true,
            data: {
              id: '{{userId}}',
              name: '{{userName}}'
            }
          }
        }
      }
    }
  }
}
```

使用时可以覆盖变量：

```bash
curl "http://localhost:3001/api/user?scenario=customUser&userName=王五"
```

## 场景管理 UI

@ldesign/mock 提供了场景管理界面。

### 访问管理界面

启动服务后访问：

```
http://localhost:3001/__mock__
```

### 功能特性

- 📋 **查看所有场景** - 列出所有可用场景
- 🔄 **快速切换** - 一键切换当前场景
- 📊 **场景预览** - 查看场景配置详情
- 🧪 **测试场景** - 直接在 UI 中测试场景
- 📝 **场景编辑** - 动态修改场景配置

### 管理界面配置

```javascript path=null start=null
// mock.config.js
export default {
  ui: {
    enabled: true,
    path: '/__mock__',
    scenarioManager: {
      enabled: true,
      allowEdit: true,      // 允许在 UI 中编辑
      showVariables: true   // 显示场景变量
    }
  }
}
```

## 实战示例

### 电商场景

```javascript path=null start=null
// mock/scenarios/ecommerce.js
export default {
  // 正常购物流程
  normal: {
    'GET /api/products': {
      response: { success: true, data: [/* 商品列表 */] }
    },
    'POST /api/cart': {
      response: { success: true, message: '添加成功' }
    },
    'POST /api/order': {
      response: { success: true, orderId: '@uuid' }
    }
  },
  
  // 库存不足
  outOfStock: {
    'GET /api/products': {
      response: {
        success: true,
        data: [
          { id: 1, name: 'iPhone', stock: 0 }
        ]
      }
    },
    'POST /api/cart': {
      status: 400,
      response: { success: false, message: '库存不足' }
    }
  },
  
  // 支付失败
  paymentFailed: {
    'GET /api/products': {
      response: { success: true, data: [/* 正常 */] }
    },
    'POST /api/order': {
      response: { success: true, orderId: '@uuid' }
    },
    'POST /api/payment': {
      status: 500,
      response: { success: false, message: '支付失败' }
    }
  }
}
```

### 用户权限场景

```javascript path=null start=null
// mock/scenarios/auth.js
export default {
  // 已登录用户
  authenticated: {
    'GET /api/user': {
      response: {
        success: true,
        data: { id: 1, name: '张三', role: 'user' }
      }
    },
    'GET /api/profile': {
      response: {
        success: true,
        data: { /* 个人信息 */ }
      }
    }
  },
  
  // 未登录
  unauthenticated: {
    'GET /api/user': {
      status: 401,
      response: { success: false, message: '未登录' }
    },
    'GET /api/profile': {
      status: 401,
      response: { success: false, message: '请先登录' }
    }
  },
  
  // 管理员
  admin: {
    'GET /api/user': {
      response: {
        success: true,
        data: { id: 1, name: '管理员', role: 'admin' }
      }
    },
    'GET /api/admin/users': {
      response: {
        success: true,
        data: [/* 用户列表 */]
      }
    }
  },
  
  // 权限不足
  forbidden: {
    'GET /api/admin/users': {
      status: 403,
      response: { success: false, message: '权限不足' }
    }
  }
}
```

### 网络状态场景

```javascript path=null start=null
// mock/scenarios/network.js
export default {
  // 快速响应
  fast: {
    'GET /api/*': {
      delay: 50,
      response: { success: true }
    }
  },
  
  // 慢速网络
  slow: {
    'GET /api/*': {
      delay: 3000,
      response: { success: true }
    }
  },
  
  // 超时
  timeout: {
    'GET /api/*': {
      delay: 30000,
      response: { success: false, message: '请求超时' }
    }
  },
  
  // 不稳定网络
  unstable: {
    'GET /api/*': (req, res) => {
      // 50% 概率成功
      if (Math.random() > 0.5) {
        res.json({ success: true })
      } else {
        res.status(500).json({ success: false })
      }
    }
  }
}
```

## 场景切换策略

### 全局切换

影响所有请求：

```javascript path=null start=null
// mock.config.js
export default {
  currentScenario: 'error'
}
```

### 路由级切换

只影响特定路由：

```javascript path=null start=null
export default {
  'GET /api/user': {
    scenarios: {
      success: { response: { success: true } },
      error: { status: 500 }
    }
  }
}
```

### 时间窗口切换

在特定时间使用特定场景：

```javascript path=null start=null
export default {
  scenarioSchedule: {
    // 工作日白天使用正常场景
    'Mon-Fri 9-18': 'normal',
    // 其他时间使用慢速场景
    default: 'slow'
  }
}
```

### 概率切换

按概率随机选择场景：

```javascript path=null start=null
export default {
  scenarioProbability: {
    success: 0.8,   // 80% 成功
    error: 0.15,    // 15% 错误
    timeout: 0.05   // 5% 超时
  }
}
```

## 最佳实践

### 1. 场景命名规范

使用语义化的场景名称：

```javascript path=null start=null
// ✅ 好的命名
scenarios: {
  success,
  userNotFound,
  networkError,
  slowNetwork
}

// ❌ 避免的命名
scenarios: {
  s1,
  test,
  temp,
  scenario1
}
```

### 2. 场景分组

按功能模块组织场景：

```
mock/
├── scenarios/
│   ├── user.js        # 用户相关场景
│   ├── product.js     # 商品相关场景
│   ├── order.js       # 订单相关场景
│   └── payment.js     # 支付相关场景
└── index.js
```

### 3. 场景文档化

为每个场景添加说明：

```javascript path=null start=null
export default {
  paymentFailed: {
    meta: {
      name: '支付失败场景',
      description: '模拟支付过程中的失败情况',
      useCases: [
        '测试支付失败的错误提示',
        '测试支付失败后的重试逻辑'
      ],
      tags: ['payment', 'error']
    },
    routes: { /* ... */ }
  }
}
```

### 4. 场景测试

为场景编写测试：

```javascript path=null start=null
// tests/scenarios.test.js
import { test } from 'vitest'
import request from 'supertest'
import app from '../mock'

test('success scenario', async () => {
  const res = await request(app)
    .get('/api/user?scenario=success')
  
  expect(res.status).toBe(200)
  expect(res.body.success).toBe(true)
})

test('error scenario', async () => {
  const res = await request(app)
    .get('/api/user?scenario=error')
  
  expect(res.status).toBe(500)
  expect(res.body.success).toBe(false)
})
```

### 5. 场景复用

提取公共场景配置：

```javascript path=null start=null
// mock/scenarios/common.js
export const commonResponses = {
  success: { success: true },
  notFound: { 
    status: 404, 
    response: { success: false, message: '未找到' }
  },
  serverError: {
    status: 500,
    response: { success: false, message: '服务器错误' }
  }
}

// 在其他场景中复用
import { commonResponses } from './common.js'

export default {
  userNotFound: {
    'GET /api/user/:id': commonResponses.notFound
  }
}
```

## 场景与测试集成

### Jest/Vitest 集成

```javascript path=null start=null
// tests/utils/mock.js
export async function setScenario(scenario) {
  await fetch('http://localhost:3001/__mock__/scenario', {
    method: 'POST',
    body: JSON.stringify({ scenario })
  })
}

// tests/user.test.js
import { setScenario } from './utils/mock'

beforeEach(async () => {
  await setScenario('success')
})

test('fetch user', async () => {
  // 测试成功场景
})

test('handle error', async () => {
  await setScenario('error')
  // 测试错误场景
})
```

### Playwright/Cypress 集成

```javascript path=null start=null
// e2e/support/mock.js
Cypress.Commands.add('setScenario', (scenario) => {
  cy.request('POST', 'http://localhost:3001/__mock__/scenario', {
    scenario
  })
})

// e2e/user.spec.js
describe('User Profile', () => {
  it('shows user info', () => {
    cy.setScenario('success')
    cy.visit('/profile')
    cy.contains('张三')
  })
  
  it('handles error', () => {
    cy.setScenario('error')
    cy.visit('/profile')
    cy.contains('加载失败')
  })
})
```

## 常见问题

### 场景不生效？

检查场景名称是否正确：

```javascript path=null start=null
// ❌ 场景名称拼写错误
?scenario=sucess

// ✅ 正确的场景名称
?scenario=success
```

### 如何查看当前场景？

访问管理界面或通过 API：

```bash
curl http://localhost:3001/__mock__/scenario
```

### 场景切换后需要重启吗？

不需要，场景切换是实时生效的。

### 可以同时使用多个场景吗？

可以，通过场景组合：

```javascript path=null start=null
export default {
  combined: {
    extends: ['scenario1', 'scenario2']
  }
}
```

## 调试场景

### 启用场景日志

```javascript path=null start=null
// mock.config.js
export default {
  log: {
    scenario: true  // 记录场景切换
  }
}
```

输出：

```
[Scenario] Switched to: error
[Scenario] Using: GET /api/user -> error.routes
```

### 场景验证

启动时验证所有场景：

```bash
lmock validate --scenarios
```

## 相关链接

- [快速开始](/guide/getting-started)
- [数据生成器](/guide/data-generator)
- [请求记录](/guide/recording)
- [场景示例](/examples/scenarios)
