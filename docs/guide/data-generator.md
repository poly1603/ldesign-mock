# 数据生成器

数据生成器是 @ldesign/mock 的核心功能之一，基于 [@faker-js/faker](https://fakerjs.dev/) 构建，提供了简洁而强大的数据生成能力。

## 基本概念

数据生成器使用 `@placeholder` 语法，在运行时自动替换为生成的数据：

```javascript
export default {
  'GET /api/user': {
    response: {
      id: '@uuid',        // 生成 UUID
      name: '@name',      // 生成随机姓名
      email: '@email',    // 生成随机邮箱
    },
  },
}
```

每次请求都会生成新的数据，保证数据的随机性。

## 内置数据类型

### 基础类型

```javascript
{
  // UUID
  id: '@uuid',              // 5f8c7d9e-1234-5678-9abc-def012345678
  guid: '@guid',            // 同 @uuid
  
  // 数字
  age: '@int(18, 60)',      // 18-60 之间的整数
  price: '@float(10, 1000, 2)',  // 10-1000 之间的浮点数，保留2位小数
  count: '@number(1, 100)', // 1-100 之间的数字
  
  // 布尔值
  isActive: '@boolean',     // true 或 false
  enabled: '@bool',         // 同 @boolean
}
```

### 人物信息

```javascript
{
  // 姓名
  name: '@name',            // 完整姓名
  firstName: '@firstName',  // 名
  lastName: '@lastName',    // 姓
  
  // 联系方式
  email: '@email',          // email@example.com
  phone: '@phone',          // 手机号码
  
  // 头像和个人信息
  avatar: '@avatar',        // 头像 URL
  jobTitle: '@jobTitle',    // 职位名称
}
```

### 地址信息

```javascript
{
  address: '@address',      // 完整地址
  city: '@city',           // 城市
  country: '@country',     // 国家
  zipCode: '@zipCode',     // 邮编
}
```

### 公司信息

```javascript
{
  company: '@company',          // 公司名称
  companyName: '@companyName',  // 同 @company
  jobTitle: '@jobTitle',        // 职位
}
```

### 互联网

```javascript
{
  url: '@url',             // https://example.com
  domain: '@domain',       // example.com
  ip: '@ip',              // 192.168.1.1
  mac: '@mac',            // 00:11:22:33:44:55
  username: '@username',   // 用户名
  password: '@password',   // 随机密码
}
```

### 日期时间

```javascript
{
  date: '@date',           // 最近的日期
  past: '@past',           // 过去的日期
  future: '@future',       // 未来的日期
  timestamp: '@timestamp', // 时间戳
}
```

### 文本内容

```javascript
{
  title: '@title',         // 标题（句子）
  sentence: '@sentence',   // 句子
  paragraph: '@paragraph', // 段落
  text: '@text',          // 文本
  word: '@word',          // 单词
  words: '@words',        // 多个单词
}
```

### 图片

```javascript
{
  image: '@image',         // 图片 URL
  imageUrl: '@imageUrl',   // 同 @image
  avatar: '@avatar',       // 头像 URL
}
```

### 颜色

```javascript
{
  color: '@color',         // 颜色名称（英文）
  hexColor: '@hexColor',   // 十六进制颜色 #RRGGBB
}
```

## 高级用法

### 带参数的生成器

许多生成器支持参数来控制生成的数据：

```javascript
{
  // 数字范围
  age: '@int(18, 65)',           // 18-65 之间
  price: '@float(10, 1000, 2)',  // 10-1000，保留2位小数
  
  // 日期范围（年数）
  birthday: '@past(30)',         // 过去30年内
  deadline: '@future(1)',        // 未来1年内
}
```

### 数组生成

使用数据生成器的 `generateArray` 方法：

```javascript
'GET /api/users': (req, res) => {
  const { dataGenerator } = req.app.locals
  
  const users = dataGenerator.generateArray({
    id: '@uuid',
    name: '@name',
    email: '@email',
  }, 10)  // 生成10条数据
  
  res.json({ success: true, data: users })
}
```

### 分页数据

使用 `generatePaginated` 生成分页数据：

```javascript
'GET /api/users': (req, res) => {
  const { dataGenerator } = req.app.locals
  const { page = 1, pageSize = 10 } = req.query
  
  const result = dataGenerator.generatePaginated({
    id: '@uuid',
    name: '@name',
    email: '@email',
  }, {
    page: Number(page),
    pageSize: Number(pageSize),
    total: 100,  // 总数
  })
  
  res.json({ success: true, ...result })
}
```

### 自定义生成器

注册自定义数据生成器：

```javascript
// mock.config.js
import { createDataGenerator } from '@ldesign/mock-core'

const generator = createDataGenerator({
  customGenerators: {
    // 自定义 @chinese 生成器
    chinese: (faker) => {
      const surnames = ['张', '王', '李', '赵', '刘']
      const names = ['明', '华', '强', '伟', '芳']
      return surnames[Math.floor(Math.random() * surnames.length)] +
             names[Math.floor(Math.random() * names.length)]
    },
    
    // 自定义 @mobile 生成器
    mobile: (faker) => {
      const prefixes = ['138', '139', '186', '188']
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
      const number = Math.floor(Math.random() * 100000000).toString().padStart(8, '0')
      return prefix + number
    },
  },
})

export default {
  dataGenerator: generator,
  // ... 其他配置
}
```

使用自定义生成器：

```javascript
export default {
  'GET /api/user': {
    response: {
      name: '@chinese',    // 使用自定义中文姓名生成器
      mobile: '@mobile',   // 使用自定义手机号生成器
    },
  },
}
```

## 完整示例

### 用户数据

```javascript
export default {
  'GET /api/users': {
    response: {
      success: true,
      data: {
        items: Array.from({ length: 10 }, () => ({
          id: '@uuid',
          username: '@username',
          email: '@email',
          name: '@name',
          avatar: '@avatar',
          phone: '@phone',
          address: {
            street: '@address',
            city: '@city',
            country: '@country',
            zipCode: '@zipCode',
          },
          company: {
            name: '@company',
            jobTitle: '@jobTitle',
          },
          profile: {
            bio: '@paragraph',
            website: '@url',
          },
          status: '@boolean',
          createdAt: '@past',
          updatedAt: '@date',
        })),
        total: 100,
        page: 1,
        pageSize: 10,
      },
    },
  },
}
```

### 商品数据

```javascript
export default {
  'GET /api/products': {
    response: {
      success: true,
      data: {
        items: Array.from({ length: 20 }, () => ({
          id: '@uuid',
          name: '@word 商品',
          description: '@paragraph',
          price: '@float(10, 9999, 2)',
          originalPrice: '@float(20, 10000, 2)',
          stock: '@int(0, 1000)',
          sales: '@int(0, 10000)',
          rating: '@float(3, 5, 1)',
          reviewCount: '@int(0, 1000)',
          images: [
            '@image',
            '@image',
            '@image',
          ],
          thumbnail: '@image',
          category: {
            id: '@uuid',
            name: '@word',
          },
          brand: {
            id: '@uuid',
            name: '@company',
          },
          tags: ['@word', '@word', '@word'],
          specifications: {
            color: ['红色', '蓝色', '黑色'],
            size: ['S', 'M', 'L', 'XL'],
          },
          createdAt: '@past',
          updatedAt: '@date',
        })),
      },
    },
  },
}
```

### 订单数据

```javascript
export default {
  'GET /api/orders': {
    response: {
      success: true,
      data: Array.from({ length: 10 }, () => ({
        id: '@uuid',
        orderNo: '@uuid',
        user: {
          id: '@uuid',
          name: '@name',
          email: '@email',
          phone: '@phone',
        },
        items: Array.from({ length: '@int(1, 5)' }, () => ({
          productId: '@uuid',
          productName: '@word 商品',
          quantity: '@int(1, 5)',
          price: '@float(10, 999, 2)',
          thumbnail: '@image',
        })),
        totalAmount: '@float(100, 5000, 2)',
        status: ['pending', 'paid', 'shipped', 'delivered'][Math.floor(Math.random() * 4)],
        shippingAddress: {
          name: '@name',
          phone: '@phone',
          address: '@address',
          city: '@city',
          zipCode: '@zipCode',
        },
        payment: {
          method: ['alipay', 'wechat', 'card'][Math.floor(Math.random() * 3)],
          transactionId: '@uuid',
          paidAt: '@past',
        },
        createdAt: '@past',
        updatedAt: '@date',
      })),
    },
  },
}
```

## 程序化使用

在函数式 Mock 中直接使用数据生成器：

```javascript
import { createDataGenerator } from '@ldesign/mock-core'

const generator = createDataGenerator()

export default {
  'GET /api/users': (req, res) => {
    const users = generator.generateArray({
      id: '@uuid',
      name: '@name',
      email: '@email',
      avatar: '@avatar',
      createdAt: '@date',
    }, 10)
    
    res.json({
      success: true,
      data: users,
    })
  },
  
  'GET /api/user/:id': (req, res) => {
    const user = generator.generate({
      id: req.params.id,
      name: '@name',
      email: '@email',
      avatar: '@avatar',
      phone: '@phone',
      address: '@address',
      createdAt: '@past',
      updatedAt: '@date',
    })
    
    res.json({
      success: true,
      data: user,
    })
  },
}
```

## 性能优化

### 缓存生成的数据

对于不需要每次都变化的数据，可以缓存：

```javascript
const cachedUsers = null

export default {
  'GET /api/users': (req, res) => {
    if (!cachedUsers) {
      cachedUsers = generator.generateArray({
        id: '@uuid',
        name: '@name',
        email: '@email',
      }, 100)
    }
    
    res.json({ success: true, data: cachedUsers })
  },
}
```

### 延迟生成

只在需要时生成数据：

```javascript
export default {
  'GET /api/user/:id': (req, res) => {
    // 根据 ID 动态生成数据
    const seed = parseInt(req.params.id, 10)
    generator.resetSeed(seed)
    
    const user = generator.generate({
      id: req.params.id,
      name: '@name',
      email: '@email',
    })
    
    res.json({ success: true, data: user })
  },
}
```

## 常见问题

### 为什么每次生成的数据都不同？

这是设计的行为。如果需要固定的数据，有两种方案：

1. 不使用占位符，直接写死数据
2. 使用随机种子固定生成结果

```javascript
generator.resetSeed(12345)  // 固定种子
```

### 如何生成中文数据？

可以使用自定义生成器，或者直接在响应中使用中文：

```javascript
{
  name: '张三',
  city: '北京',
  // 或者使用自定义生成器
  name: '@chinese',
}
```

### 如何生成符合特定格式的数据？

使用自定义生成器或在函数中处理：

```javascript
'GET /api/code': (req, res) => {
  const code = 'CODE-' + Math.random().toString(36).substr(2, 9).toUpperCase()
  res.json({ code })
}
```

## 相关链接

- [API 参考 - Data Generator](/api/data-generator)
- [@faker-js/faker 文档](https://fakerjs.dev/)
- [模板库](/guide/templates)
- [Mock Server](/guide/mock-server)
