# 模板库 <Badge type="tip" text="新功能" />

@ldesign/mock 内置了丰富的业务模板，涵盖常见的应用场景，让你快速开始项目开发。

## 概述

模板库提供了开箱即用的 Mock 配置，包括：

- 🛒 **电商系统** - 完整的电商业务流程 (20+ 接口)
- 📝 **CMS 系统** - 内容管理系统 (25+ 接口)
- 👤 **用户管理** - 用户认证和管理
- 📦 **商品管理** - 商品 CRUD 操作

## 快速开始

### 使用单个模板

```javascript
// mock/index.js
import ecommerce from '@ldesign/mock/templates/ecommerce.template.js'

export default {
  ...ecommerce.routes
}
```

### 组合多个模板

```javascript
import ecommerce from '@ldesign/mock/templates/ecommerce.template.js'
import cms from '@ldesign/mock/templates/cms.template.js'

export default {
  ...ecommerce.routes,
  ...cms.routes,
}
```

### 覆盖模板接口

```javascript
import ecommerce from '@ldesign/mock/templates/ecommerce.template.js'

export default {
  ...ecommerce.routes,
  
  // 覆盖模板中的接口
  'GET /api/products': {
    response: {
      success: true,
      data: {
        // 你的自定义数据
      },
    },
  },
}
```

## 电商系统模板

### 功能概览

电商模板包含完整的购物流程：

- 商品管理（列表、详情、分类）
- 购物车功能（增删改查）
- 订单管理（创建、查询、取消）
- 支付功能（创建支付、查询状态）
- 收货地址管理

### 接口列表

#### 商品相关

```javascript
'GET /api/products'        // 商品列表（分页、筛选）
'GET /api/products/:id'    // 商品详情
'GET /api/categories'      // 商品分类
```

#### 购物车

```javascript
'GET /api/cart'            // 获取购物车
'POST /api/cart'           // 添加到购物车
'PUT /api/cart/:id'        // 更新商品数量
'DELETE /api/cart/:id'     // 删除商品
```

#### 订单

```javascript
'GET /api/orders'          // 订单列表
'GET /api/orders/:id'      // 订单详情
'POST /api/orders'         // 创建订单
'POST /api/orders/:id/cancel'  // 取消订单
```

#### 支付

```javascript
'POST /api/payment/create'     // 创建支付
'GET /api/payment/:id/status'  // 查询支付状态
```

#### 地址

```javascript
'GET /api/addresses'           // 地址列表
'POST /api/addresses'          // 添加地址
'PUT /api/addresses/:id'       // 更新地址
'DELETE /api/addresses/:id'    // 删除地址
'POST /api/addresses/:id/default'  // 设置默认地址
```

### 使用示例

```javascript
import ecommerce from '@ldesign/mock/templates/ecommerce.template.js'

export default {
  ...ecommerce.routes,
}
```

启动服务后，可以访问：

```bash
# 商品列表
curl http://localhost:3001/api/products

# 商品详情
curl http://localhost:3001/api/products/123

# 购物车
curl http://localhost:3001/api/cart

# 创建订单
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -d '{"items":[...]}'
```

### 自定义商品数据

```javascript
import ecommerce from '@ldesign/mock/templates/ecommerce.template.js'

export default {
  ...ecommerce.routes,
  
  // 自定义商品列表
  'GET /api/products': (req, res) => {
    res.json({
      success: true,
      data: {
        items: [
          {
            id: '1',
            name: 'iPhone 15 Pro',
            price: 7999,
            image: 'https://...',
            // 你的商品数据
          },
        ],
        total: 1,
      },
    })
  },
}
```

## CMS 系统模板

### 功能概览

CMS 模板包含完整的内容管理功能：

- 文章管理（CRUD、发布）
- 分类和标签管理
- 评论系统（审核、拒绝）
- 媒体库（上传、管理）
- 菜单管理
- 仪表盘统计

### 接口列表

#### 文章管理

```javascript
'GET /api/articles'             // 文章列表
'GET /api/articles/:id'         // 文章详情
'POST /api/articles'            // 创建文章
'PUT /api/articles/:id'         // 更新文章
'DELETE /api/articles/:id'      // 删除文章
'POST /api/articles/:id/publish'  // 发布文章
```

#### 分类和标签

```javascript
'GET /api/categories'           // 分类列表
'POST /api/categories'          // 创建分类
'PUT /api/categories/:id'       // 更新分类
'DELETE /api/categories/:id'    // 删除分类

'GET /api/tags'                 // 标签列表
'POST /api/tags'                // 创建标签
```

#### 评论管理

```javascript
'GET /api/comments'                   // 评论列表
'POST /api/comments/:id/approve'      // 审核通过
'POST /api/comments/:id/reject'       // 审核拒绝
'DELETE /api/comments/:id'            // 删除评论
```

#### 媒体库

```javascript
'GET /api/media'                // 媒体列表
'POST /api/media/upload'        // 上传文件
'DELETE /api/media/:id'         // 删除文件
```

#### 统计

```javascript
'GET /api/dashboard/stats'      // 仪表盘统计
'GET /api/articles/popular'     // 热门文章
```

### 使用示例

```javascript
import cms from '@ldesign/mock/templates/cms.template.js'

export default {
  ...cms.routes,
}
```

## 用户管理模板

### 功能概览

- 用户注册和登录
- 用户信息管理
- 权限和角色
- 用户列表

### 使用示例

```javascript
import user from '@ldesign/mock/templates/user.template.js'

export default {
  ...user.routes,
}
```

## 商品管理模板

### 功能概览

- 商品 CRUD
- 商品分类
- 库存管理

### 使用示例

```javascript
import product from '@ldesign/mock/templates/product.template.js'

export default {
  ...product.routes,
}
```

## 模板元数据

每个模板都包含元数据信息：

```javascript
import ecommerce from '@ldesign/mock/templates/ecommerce.template.js'

console.log(ecommerce.metadata)
// {
//   id: 'ecommerce',
//   name: '电商系统',
//   description: '包含商品管理、订单、购物车...',
//   category: 'business',
//   tags: ['电商', 'ecommerce', '订单', '商品'],
//   author: 'LDesign Team',
//   version: '1.0.0'
// }
```

## 模板工具函数

### 获取模板列表

```javascript
import { getTemplateList } from '@ldesign/mock/templates/index.js'

const templates = getTemplateList()
console.log(templates)
// [
//   { id: 'ecommerce', name: '电商系统', ... },
//   { id: 'cms', name: 'CMS内容管理', ... },
//   ...
// ]
```

### 获取特定模板

```javascript
import { getTemplate } from '@ldesign/mock/templates/index.js'

const ecommerce = getTemplate('ecommerce')
```

### 按分类获取

```javascript
import { getTemplatesByCategory } from '@ldesign/mock/templates/index.js'

const businessTemplates = getTemplatesByCategory('business')
```

### 搜索模板

```javascript
import { searchTemplates } from '@ldesign/mock/templates/index.js'

const results = searchTemplates('订单')
```

## 高级用法

### 场景化模板

为不同场景准备不同的模板数据：

```javascript
import ecommerce from '@ldesign/mock/templates/ecommerce.template.js'

// 成功场景
export const successScenario = {
  ...ecommerce.routes,
  'POST /api/payment/create': {
    response: {
      success: true,
      data: { paymentId: '@uuid', status: 'success' }
    }
  }
}

// 失败场景
export const errorScenario = {
  ...ecommerce.routes,
  'POST /api/payment/create': {
    status: 500,
    response: {
      success: false,
      message: '支付失败'
    }
  }
}
```

### 数据本地化

替换模板中的数据为本地化内容：

```javascript
import ecommerce from '@ldesign/mock/templates/ecommerce.template.js'

export default {
  ...ecommerce.routes,
  
  'GET /api/categories': {
    response: {
      success: true,
      data: [
        { id: '1', name: '数码产品' },
        { id: '2', name: '服装鞋包' },
        { id: '3', name: '食品生鲜' },
      ]
    }
  }
}
```

### 扩展模板

在模板基础上添加新接口：

```javascript
import ecommerce from '@ldesign/mock/templates/ecommerce.template.js'

export default {
  ...ecommerce.routes,
  
  // 添加优惠券接口
  'GET /api/coupons': {
    response: {
      success: true,
      data: [
        {
          id: '@uuid',
          code: 'SAVE10',
          discount: 10,
          expiresAt: '@future'
        }
      ]
    }
  },
  
  // 添加收藏接口
  'GET /api/favorites': {
    response: {
      success: true,
      data: []
    }
  }
}
```

## 最佳实践

### 1. 选择合适的模板

根据项目类型选择对应的模板：

- 电商项目 → `ecommerce`
- 博客/新闻站 → `cms`
- 管理后台 → `user` + `其他模板`

### 2. 渐进式使用

从模板开始，逐步定制：

```javascript
// 第一步：使用完整模板
import ecommerce from '@ldesign/mock/templates/ecommerce.template.js'
export default { ...ecommerce.routes }

// 第二步：覆盖部分接口
export default {
  ...ecommerce.routes,
  'GET /api/products': { /* 自定义 */ }
}

// 第三步：添加新接口
export default {
  ...ecommerce.routes,
  'GET /api/products': { /* 自定义 */ },
  'GET /api/recommendations': { /* 新接口 */ }
}
```

### 3. 模板组合

组合多个模板满足复杂需求：

```javascript
import ecommerce from '@ldesign/mock/templates/ecommerce.template.js'
import cms from '@ldesign/mock/templates/cms.template.js'
import user from '@ldesign/mock/templates/user.template.js'

export default {
  // 用户系统
  ...user.routes,
  // 商城功能
  ...ecommerce.routes,
  // 内容管理
  ...cms.routes,
}
```

### 4. 版本控制

模板文件也应纳入版本控制：

```bash
git add mock/index.js
git commit -m "feat: 使用电商模板"
```

## 自定义模板

### 创建自己的模板

```javascript
// templates/my-template.js
export default {
  metadata: {
    id: 'my-template',
    name: '我的模板',
    description: '自定义模板',
    category: 'custom',
    tags: ['custom'],
    version: '1.0.0'
  },
  
  routes: {
    'GET /api/custom': {
      response: {
        success: true,
        data: []
      }
    }
  }
}
```

### 分享模板

创建 npm 包分享你的模板：

```json
{
  "name": "@your-org/mock-templates",
  "version": "1.0.0",
  "main": "index.js",
  "exports": {
    "./ecommerce": "./templates/ecommerce.js",
    "./custom": "./templates/custom.js"
  }
}
```

使用：

```javascript
import ecommerce from '@your-org/mock-templates/ecommerce'
```

## 常见问题

### 模板冲突怎么办？

当多个模板有相同路由时，后面的会覆盖前面的：

```javascript
export default {
  ...template1.routes,  // 这里的 GET /api/users 会被覆盖
  ...template2.routes,  // 这里的 GET /api/users 生效
}
```

解决方案：手动选择需要的接口

```javascript
const { 'GET /api/users': _, ...template1Rest } = template1.routes
export default {
  ...template1Rest,
  ...template2.routes,
}
```

### 如何知道模板有哪些接口？

查看模板元数据和路由：

```javascript
import ecommerce from '@ldesign/mock/templates/ecommerce.template.js'

console.log(Object.keys(ecommerce.routes))
```

或查看源码：`node_modules/@ldesign/mock/templates/`

### 模板数据可以修改吗？

可以，有两种方式：

1. 覆盖整个接口
2. 修改部分数据

```javascript
// 方式1：完全覆盖
export default {
  ...template.routes,
  'GET /api/products': { /* 全新的 */ }
}

// 方式2：部分修改
export default {
  ...template.routes,
  'GET /api/products': {
    ...template.routes['GET /api/products'],
    response: {
      ...template.routes['GET /api/products'].response,
      data: { /* 修改的数据 */ }
    }
  }
}
```

## 相关链接

- [电商示例](/examples/ecommerce)
- [CMS 示例](/examples/cms)
- [数据生成器](/guide/data-generator)
- [场景管理](/guide/scenario-management)
